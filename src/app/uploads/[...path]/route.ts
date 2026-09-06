import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";

/**
 * سرو کردن فایل‌های آپلودشده روی دیسک محلی.
 *
 * این فایل‌ها عمداً داخل public/ نیستند: هرچه در public باشد در زمان build
 * داخل ایمیج داکر کپی می‌شود، در حالی که آپلودها باید روی volume دائمی و
 * بیرون از ایمیج بمانند تا با هر استقرار پاک نشوند.
 *
 * وقتی S3 فعال باشد آدرس فایل‌ها مستقیم به فضای ابری اشاره می‌کند و این مسیر
 * اصلاً صدا زده نمی‌شود.
 */

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  const baseDir = path.resolve(
    process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads"),
  );
  const target = path.resolve(baseDir, ...segments);

  /*
    محافظت در برابر path traversal: بدون این بررسی، درخواستی مثل
    /uploads/../../.env می‌توانست هر فایلی روی سرور را بخواند.
    resolve مسیر را عادی می‌کند و بعد مطمئن می‌شویم هنوز داخل baseDir است.
  */
  if (target !== baseDir && !target.startsWith(baseDir + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(target).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) return new NextResponse("Not found", { status: 404 });

  try {
    const info = await stat(target);
    if (!info.isFile()) return new NextResponse("Not found", { status: 404 });

    const stream = Readable.toWeb(
      createReadStream(target),
    ) as unknown as ReadableStream;

    return new NextResponse(stream, {
      headers: {
        "content-type": contentType,
        "content-length": String(info.size),
        // نام فایل‌ها UUID است و هرگز بازنویسی نمی‌شوند، پس کش طولانی امن است.
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
