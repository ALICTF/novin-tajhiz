const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** تبدیل ارقام لاتین یک رشته به ارقام فارسی. */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** تبدیل ارقام فارسی/عربی به لاتین — برای ورودی‌های فرم. */
export function toLatinDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

/** جداکننده هزارگان با ارقام فارسی. مثال: ۴,۵۰۰,۰۰۰ */
export function formatNumber(value: number): string {
  return toPersianDigits(value.toLocaleString("en-US"));
}

/**
 * قیمت را برای نمایش آماده می‌کند.
 * قیمت `null` یعنی «تماس بگیرید».
 */
export function formatPrice(value: number | null, withUnit = true): string {
  if (value === null || value === 0) return "تماس بگیرید";
  return withUnit ? `${formatNumber(value)} تومان` : formatNumber(value);
}

/** درصد تخفیف بین قیمت قدیم و جدید. */
export function discountPercent(price: number | null, oldPrice?: number | null): number | null {
  if (!price || !oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** «۵ دقیقه» از روی تعداد کلمات متن. */
export function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  return `${toPersianDigits(Math.max(1, Math.round(words / 200)))} دقیقه`;
}
