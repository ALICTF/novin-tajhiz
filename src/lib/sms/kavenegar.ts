import "server-only";

/**
 * ارسال پیامک از طریق کاوه‌نگار.
 *
 * عمداً بدون SDK نوشته شده — کل کاری که لازم داریم یک درخواست POST است و
 * کتابخانه رسمی فقط وابستگی اضافه می‌کند.
 *
 * اگر کلید API تنظیم نشده باشد، تابع بی‌سروصدا رد می‌شود و خطا نمی‌دهد. این
 * عمدی است: تا وقتی حساب کاوه‌نگار آماده نشده، سایت باید کامل کار کند و
 * سفارش‌ها ثبت شوند؛ فقط پیامکی ارسال نمی‌شود.
 */

/**
 * آدرس پایه API. در حالت عادی نباید تنظیم شود؛ فقط برای تست و محیط staging
 * وجود دارد تا بشود درخواست‌ها را به یک سرور جعلی فرستاد و بدون خرج کردن
 * اعتبار واقعی، مسیر ارسال را بررسی کرد.
 */
const ENDPOINT = process.env.KAVENEGAR_BASE_URL?.trim() || "https://api.kavenegar.com/v1";

/** پس از این مدت درخواست رها می‌شود تا پاسخ به مشتری معطل نماند. */
const TIMEOUT_MS = 8000;

export type SmsResult =
  | { ok: true; messageId: number | null }
  | { ok: false; reason: string; skipped?: boolean };

type KavenegarResponse = {
  return?: { status?: number; message?: string };
  entries?: { messageid?: number }[] | null;
};

/** توضیح فارسی کدهای خطای کاوه‌نگار، برای اینکه لاگ قابل فهم باشد. */
const STATUS_TEXT: Record<number, string> = {
  400: "پارامترها ناقص یا نامعتبرند",
  401: "حساب غیرفعال است",
  402: "عملیات ناموفق بود",
  403: "کلید API نامعتبر است",
  406: "پارامتر اجباری خالی ارسال شده",
  411: "شماره گیرنده نامعتبر است",
  412: "شماره فرستنده نامعتبر است",
  413: "متن پیام خالی یا بیش از حد بلند است",
  414: "تعداد گیرنده‌ها بیش از حد مجاز است",
  418: "اعتبار حساب کافی نیست",
  424: "الگوی درخواستی پیدا نشد",
  426: "این سرویس نیاز به پلن دارد",
};

/**
 * ارسال یک پیامک ساده.
 *
 * هیچ‌وقت throw نمی‌کند؛ نتیجه را برمی‌گرداند تا صدازننده تصمیم بگیرد. دلیلش
 * این است که این تابع در مسیر ثبت سفارش صدا زده می‌شود و شکست پیامک نباید
 * سفارشِ ثبت‌شده را خراب کند.
 */
export async function sendSms(
  receptor: string,
  message: string,
): Promise<SmsResult> {
  const apiKey = process.env.KAVENEGAR_API_KEY?.trim();

  if (!apiKey) {
    return { ok: false, reason: "کلید KAVENEGAR_API_KEY تنظیم نشده", skipped: true };
  }
  if (!receptor.trim()) {
    return { ok: false, reason: "شماره گیرنده خالی است", skipped: true };
  }

  const body = new URLSearchParams({ receptor: receptor.trim(), message });

  // خط فرستنده اختیاری است؛ اگر تنظیم نشود کاوه‌نگار خط پیش‌فرض حساب را می‌زند.
  const sender = process.env.KAVENEGAR_SENDER?.trim();
  if (sender) body.set("sender", sender);

  try {
    const response = await fetch(`${ENDPOINT}/${apiKey}/sms/send.json`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // پاسخ کاوه‌نگار هرگز نباید کش شود.
      cache: "no-store",
    });

    const data = (await response.json()) as KavenegarResponse;
    const status = data.return?.status;

    if (status !== 200) {
      const known = status ? STATUS_TEXT[status] : undefined;
      return {
        ok: false,
        reason: `کاوه‌نگار کد ${status ?? "نامشخص"} برگرداند${known ? ` — ${known}` : ""}`,
      };
    }

    return { ok: true, messageId: data.entries?.[0]?.messageid ?? null };
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "TimeoutError"
        ? "پاسخ کاوه‌نگار در زمان مجاز نرسید"
        : `ارتباط با کاوه‌نگار برقرار نشد: ${(error as Error).message}`;
    return { ok: false, reason };
  }
}
