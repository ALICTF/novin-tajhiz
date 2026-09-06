import "server-only";

import { headers } from "next/headers";

/**
 * محدودیت نرخ برای مسیرهای عمومی.
 *
 * چند نقطه از سایت بدون احراز هویت می‌نویسند — و باید هم باشند، چون مشتری
 * حساب کاربری ندارد: آپلود فیش، فرم تماس، ثبت دیدگاه، خبرنامه و ثبت سفارش.
 * بدون محدودیت، یک اسکریپت ساده می‌تواند دیسک را با فیش‌های جعلی پر کند یا
 * جدول پیام‌ها را با هزاران رکورد بی‌معنی اشغال کند.
 *
 * محدودیت آگاهانه: شمارنده در حافظه همین پروسه است. برای استقرار تک‌نمونه‌ای
 * (که هدف فعلی است) کافی است، ولی اگر روزی برنامه روی چند نمونه اجرا شود هر
 * نمونه سهم خودش را می‌شمارد و سقف واقعی چند برابر می‌شود. در آن حالت باید
 * به Redis منتقل شود.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** هر از چندی رکوردهای منقضی پاک می‌شوند تا حافظه بی‌نهایت رشد نکند. */
let lastSweep = Date.now();
const SWEEP_INTERVAL_MS = 60_000;

function sweep(now: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * نشانی مشتری.
 *
 * پشت nginx یا لیارا، آدرس واقعی در X-Forwarded-For است و اولین مقدار آن
 * متعلق به خود کاربر است. اگر هیچ‌کدام نبود، همه درخواست‌ها در یک سطل مشترک
 * می‌افتند — سخت‌گیرانه، ولی امن‌تر از بی‌سقف ماندن.
 */
async function clientKey(): Promise<string> {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return store.get("x-real-ip")?.trim() || "unknown";
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

/**
 * آیا این درخواست مجاز است؟
 *
 * @param name    نام عملیات، تا سقف هر کدام جدا شمرده شود
 * @param limit   حداکثر تعداد در بازه
 * @param windowMs طول بازه به میلی‌ثانیه
 */
export async function checkRateLimit(
  name: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  sweep(now);

  const key = `${name}:${await clientKey()}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true };
}

/** سقف‌های هر عملیات، یکجا تا قابل مرور باشند. */
export const LIMITS = {
  /** آپلود فیش — سنگین‌ترین عملیات، چون روی دیسک می‌نویسد. */
  receipt: { limit: 10, windowMs: 10 * 60_000 },
  /** ثبت سفارش. سخاوتمند است تا خرید واقعی هرگز بلوکه نشود. */
  order: { limit: 20, windowMs: 10 * 60_000 },
  /** فرم تماس و ثبت دیدگاه. */
  message: { limit: 5, windowMs: 10 * 60_000 },
  /** خبرنامه. */
  newsletter: { limit: 5, windowMs: 60 * 60_000 },
  /** تلاش برای ورود به بخش پیگیری سفارش — جلوی حدس زدن کد پیگیری را می‌گیرد. */
  track: { limit: 10, windowMs: 10 * 60_000 },
} as const;
