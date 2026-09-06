import { toPersianDigits } from "@/lib/format";

/**
 * قالب‌بندی تاریخ برای پنل.
 *
 * از تقویم شمسی خود مرورگر/Node استفاده می‌شود (`fa-IR-u-ca-persian`) تا لازم
 * نباشد کتابخانه تاریخ به پروژه اضافه شود. تاریخ‌ها به‌صورت رشته ISO از سرور
 * می‌آیند و همیشه با منطقه زمانی تهران نمایش داده می‌شوند، وگرنه سرور و مرورگر
 * ممکن بود دو روز مختلف نشان بدهند و hydration ناهماهنگ شود.
 */

const DATE = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "Asia/Tehran",
});

const DATE_TIME = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Tehran",
});

export function formatOrderDate(iso: string): string {
  return DATE.format(new Date(iso));
}

export function formatOrderDateTime(iso: string): string {
  return DATE_TIME.format(new Date(iso));
}

/** «۳ روز پیش» — برای فهرست‌هایی که تاریخ دقیق مهم نیست. */
export function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);

  if (minutes < 1) return "همین الان";
  if (minutes < 60) return `${toPersianDigits(minutes)} دقیقه پیش`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${toPersianDigits(hours)} ساعت پیش`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${toPersianDigits(days)} روز پیش`;

  return formatOrderDate(iso);
}
