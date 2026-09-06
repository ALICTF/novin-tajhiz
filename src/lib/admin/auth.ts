import "server-only";

import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

/**
 * احراز هویت پنل مدیریت — تک‌کاربره، با رمز داخل متغیر محیطی.
 *
 * عمداً هیچ کتابخانه‌ای اضافه نشده. نشست یک کوکی امضاشده با HMAC است: مقدارش
 * «تاریخ انقضا» به‌علاوه امضای آن با کلید سری. سرور چیزی ذخیره نمی‌کند و
 * کوکی هم قابل جعل نیست، چون بدون کلید نمی‌شود امضای معتبر ساخت.
 *
 * محدودیت آگاهانه: چون نشست سمت سرور نگهداری نمی‌شود، «خروج از همه دستگاه‌ها»
 * وجود ندارد؛ برای ابطال همه نشست‌ها باید ADMIN_SESSION_SECRET عوض شود.
 */

const COOKIE_NAME = "novin_admin";
const SESSION_DAYS = 7;

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET تنظیم نشده یا کوتاه است. یک رشته تصادفی حداقل ۱۶ نویسه‌ای در فایل .env بگذار.",
    );
  }
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

/** مقایسه‌ای که زمانش به محل اختلاف دو رشته بستگی ندارد. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function isPasswordCorrect(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD در فایل .env تنظیم نشده است.");
  }
  return safeEqual(input, expected);
}

function createToken(): string {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  // نویز تصادفی باعث می‌شود دو نشست هم‌زمان توکن یکسان نگیرند.
  const payload = `${expiresAt}.${randomBytes(12).toString("hex")}`;
  return `${payload}.${sign(payload)}`;
}

function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expiresAt, nonce, signature] = parts;
  const payload = `${expiresAt}.${nonce}`;

  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }
  if (!safeEqual(signature, expected)) return false;

  const expiry = Number(expiresAt);
  return Number.isFinite(expiry) && expiry > Date.now();
}

export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isSignedIn(): Promise<boolean> {
  const store = await cookies();
  return isTokenValid(store.get(COOKIE_NAME)?.value);
}

export { COOKIE_NAME };
