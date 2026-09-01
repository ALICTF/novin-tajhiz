/**
 * ارسال فرم‌ها.
 *
 * پروژه فعلاً بک‌اند ندارد؛ این تابع ارسال را شبیه‌سازی می‌کند تا رابط کاربری
 * (حالت در حال ارسال، موفقیت و خطا) کامل و قابل تست باشد. برای اتصال به سرور
 * واقعی کافی است بدنه همین تابع با یک `fetch` جایگزین شود — امضای آن تغییر
 * نمی‌کند و هیچ‌کدام از فرم‌ها نیازی به بازنویسی ندارند.
 */
export async function submitForm<T>(
  formName: string,
  payload: T,
  delayMs = 900,
): Promise<{ ok: true; reference: string }> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (process.env.NODE_ENV === "development") {
    console.info(`[form:${formName}]`, payload);
  }

  return { ok: true, reference: generateReference() };
}

/** کد پیگیری کوتاه و خوانا برای نمایش به کاربر. */
export function generateReference(): string {
  const now = new Date();
  const stamp = `${now.getFullYear()}`.slice(2) + String(now.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 90000 + 10000);
  return `NT-${stamp}-${rand}`;
}
