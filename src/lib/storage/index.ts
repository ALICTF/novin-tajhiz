import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * ذخیره فایل‌های آپلودی (تصویر محصول، رسید پرداخت).
 *
 * دو حالت دارد و با متغیر محیطی انتخاب می‌شود:
 *
 *  ۱. دیسک محلی — پیش‌فرض. فایل زیر UPLOAD_DIR نوشته می‌شود و از مسیر
 *     /uploads سرو می‌شود. روی سرور اختصاصی (پارس‌پک) گزینه درست است، به شرط
 *     آنکه UPLOAD_DIR روی یک volume دائمی باشد.
 *
 *  ۲. S3 سازگار — اگر S3_BUCKET تنظیم شده باشد. برای هاست‌هایی مثل لیارا که
 *     فایل‌سیستمشان با هر استقرار پاک می‌شود، این تنها راه امن است.
 *
 * انتخاب حالت در زمان اجرا انجام می‌شود، پس همین یک ایمیج داکر روی هر دو
 * محیط کار می‌کند.
 */

const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["application/pdf", "pdf"],
]);

export type StoredFile = { url: string; key: string; size: number };

export type StorageError = { error: string };

function isS3Enabled(): boolean {
  return Boolean(process.env.S3_BUCKET && process.env.S3_ENDPOINT);
}

/** نام امن و یکتا؛ نام اصلی کاربر هرگز مستقیم روی دیسک نمی‌نشیند. */
function buildKey(prefix: string, ext: string): string {
  const day = new Date().toISOString().slice(0, 10);
  return `${prefix}/${day}/${randomUUID()}.${ext}`;
}

export async function storeUpload(
  file: File,
  prefix: "products" | "receipts",
): Promise<StoredFile | StorageError> {
  if (file.size === 0) return { error: "فایل خالی است" };
  if (file.size > MAX_BYTES) {
    return { error: "حجم فایل نباید بیشتر از ۵ مگابایت باشد" };
  }

  const ext = ALLOWED.get(file.type);
  if (!ext) {
    return { error: "فقط تصویر (JPG، PNG، WebP، AVIF) یا PDF پذیرفته می‌شود" };
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // نوع فایل را از خود بایت‌ها هم بررسی می‌کنیم؛ هدر Content-Type را کلاینت
  // می‌فرستد و قابل جعل است.
  if (!looksLikeDeclaredType(bytes, ext)) {
    return { error: "محتوای فایل با پسوند اعلام‌شده نمی‌خواند" };
  }

  const key = buildKey(prefix, ext);

  if (isS3Enabled()) {
    return uploadToS3(key, bytes, file.type);
  }

  const baseDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");
  const target = path.join(baseDir, key);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);

  return { url: `/uploads/${key}`, key, size: bytes.length };
}

/** بررسی امضای بایت ابتدای فایل (magic number). */
function looksLikeDeclaredType(bytes: Buffer, ext: string): boolean {
  if (bytes.length < 12) return false;

  switch (ext) {
    case "jpg":
      return bytes[0] === 0xff && bytes[1] === 0xd8;
    case "png":
      return (
        bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
      );
    case "pdf":
      return bytes.subarray(0, 4).toString("latin1") === "%PDF";
    case "webp":
      return (
        bytes.subarray(0, 4).toString("latin1") === "RIFF" &&
        bytes.subarray(8, 12).toString("latin1") === "WEBP"
      );
    case "avif":
      return bytes.subarray(4, 8).toString("latin1") === "ftyp";
    default:
      return false;
  }
}

/**
 * آیا این آدرس واقعاً به فایلی اشاره می‌کند که خودمان ذخیره کرده‌ایم؟
 *
 * آدرس فیش از سمت کلاینت به سرور برمی‌گردد و بدون این بررسی می‌شد هر لینکی
 * را جای فیش نشاند؛ آن‌وقت ادمین با کلیک روی «مشاهده رسید» به سایت دیگری
 * می‌رفت. هر دو حالت ذخیره‌سازی پوشش داده می‌شود.
 */
export function isOwnUploadUrl(
  url: string,
  prefix: "products" | "receipts",
): boolean {
  if (!url) return false;

  // حالت دیسک محلی: مسیر نسبی.
  if (url.startsWith(`/uploads/${prefix}/`)) return true;

  // حالت S3: باید دقیقاً زیر دامنه عمومی همان باکت باشد.
  const publicBase = process.env.S3_PUBLIC_URL?.replace(/\/$/, "");
  if (publicBase && url.startsWith(`${publicBase}/${prefix}/`)) return true;

  return false;
}

/* ------------------------------ S3 سازگار ------------------------------ */

/**
 * آپلود با امضای AWS Signature V4، بدون SDK.
 *
 * SDK رسمی چند مگابایت وابستگی می‌آورد در حالی که ما فقط یک PUT ساده لازم
 * داریم. امضا مطابق مستندات AWS ساخته می‌شود و با لیارا، آروان و هر سرویس
 * S3-سازگار دیگری کار می‌کند.
 */
async function uploadToS3(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<StoredFile | StorageError> {
  const endpoint = process.env.S3_ENDPOINT!;
  const bucket = process.env.S3_BUCKET!;
  const region = process.env.S3_REGION ?? "us-east-1";
  const accessKey = process.env.S3_ACCESS_KEY;
  const secretKey = process.env.S3_SECRET_KEY;

  if (!accessKey || !secretKey) {
    return { error: "کلیدهای S3 تنظیم نشده‌اند" };
  }

  const url = new URL(`${endpoint.replace(/\/$/, "")}/${bucket}/${key}`);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = createHash("sha256").update(body).digest("hex");

  const canonicalHeaders =
    `host:${url.host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = [
    "PUT",
    url.pathname,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n");

  const { createHmac } = await import("node:crypto");
  const hmac = (key: Buffer | string, data: string) =>
    createHmac("sha256", key).update(data).digest();

  const signature = hmac(
    hmac(hmac(hmac(hmac(`AWS4${secretKey}`, dateStamp), region), "s3"), "aws4_request"),
    stringToSign,
  ).toString("hex");

  const response = await fetch(url, {
    method: "PUT",
    body: new Uint8Array(body),
    headers: {
      "content-type": contentType,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      authorization:
        `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, ` +
        `SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
  });

  if (!response.ok) {
    return { error: `آپلود به فضای ابری ناموفق بود (کد ${response.status})` };
  }

  const publicBase = process.env.S3_PUBLIC_URL?.replace(/\/$/, "");
  return {
    url: publicBase ? `${publicBase}/${key}` : url.toString(),
    key,
    size: body.length,
  };
}
