/**
 * ساخت کد پیگیری کوتاه و خوانا برای نمایش به مشتری.
 *
 * قبلاً این فایل یک submitForm شبیه‌سازی‌شده هم داشت که فقط تأخیر ایجاد می‌کرد.
 * حالا همه فرم‌ها به Server Action های واقعی وصل‌اند و در دیتابیس می‌نویسند،
 * پس فقط همین تابع باقی مانده است.
 */
export function generateReference(): string {
  const now = new Date();
  const stamp = `${now.getFullYear()}`.slice(2) + String(now.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 90000 + 10000);
  return `NT-${stamp}-${rand}`;
}
