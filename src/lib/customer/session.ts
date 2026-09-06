import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * نشست پیگیری سفارش مشتری.
 *
 * سایت حساب کاربری ندارد و ساختنش برای این کار لازم هم نیست. مشتری یک‌بار با
 * «کد پیگیری + شماره موبایل» خودش را اثبات می‌کند؛ چون کد پیگیری فقط به خود
 * او داده شده و شماره هم باید با همان سفارش بخواند، دانستن هر دو یعنی سفارش
 * مال اوست.
 *
 * بعد از آن شماره در یک کوکی امضاشده با HMAC نگه داشته می‌شود تا فهرست
 * سفارش‌هایش را ببیند. کوکی قابل جعل نیست، ولی چون فقط شماره داخلش است و
 * هیچ عملیات نوشتنی با آن ممکن نیست، سطح دسترسی‌اش هم حداقلی است.
 */

const COOKIE_NAME = "novin_customer";
const SESSION_DAYS = 30;

function secret(): string {
  // همان کلید پنل استفاده می‌شود؛ متغیر محیطی جدا فقط یک چیز بیشتر برای
  // فراموش کردن هنگام استقرار بود.
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET تنظیم نشده یا کوتاه است.");
  }
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function startCustomerSession(phone: string): Promise<void> {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${phone}.${expiresAt}`;

  const store = await cookies();
  store.set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endCustomerSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** شماره موبایل مشتری واردشده، یا null. */
export async function getCustomerPhone(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [phone, expiresAt, signature] = parts;
  const payload = `${phone}.${expiresAt}`;

  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return null;
  }
  if (!safeEqual(signature, expected)) return null;

  const expiry = Number(expiresAt);
  if (!Number.isFinite(expiry) || expiry <= Date.now()) return null;

  return phone;
}

export { COOKIE_NAME as CUSTOMER_COOKIE };
