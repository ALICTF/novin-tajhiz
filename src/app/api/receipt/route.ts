import { NextResponse } from "next/server";
import { storeUpload } from "@/lib/storage";
import { checkRateLimit, LIMITS } from "@/lib/rate-limit";

/**
 * آپلود فیش واریزی توسط مشتری، هنگام تسویه‌حساب.
 *
 * برخلاف آپلود تصویر محصول، اینجا نمی‌توان احراز هویت خواست — مشتری حساب
 * کاربری ندارد. محافظت از راه‌های دیگر است:
 *  • نوع فایل هم از هدر و هم از بایت‌های ابتدایی بررسی می‌شود.
 *  • سقف حجم ۵ مگابایت.
 *  • نام فایل UUID است، پس آپلودکننده روی مسیر ذخیره کنترلی ندارد.
 *  • فایل تا وقتی به یک سفارش وصل نشود در پنل دیده نمی‌شود.
 */
export async function POST(request: Request) {
  const gate = await checkRateLimit("receipt", LIMITS.receipt.limit, LIMITS.receipt.windowMs);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "تعداد تلاش‌ها زیاد است. کمی بعد دوباره امتحان کنید." },
      { status: 429, headers: { "retry-after": String(gate.retryAfterSeconds) } },
    );
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "فایلی ارسال نشده" }, { status: 400 });
  }

  const result = await storeUpload(file, "receipts");
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ url: result.url });
}
