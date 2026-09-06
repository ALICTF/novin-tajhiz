import "server-only";

import { sendSms } from "@/lib/sms/kavenegar";
import { primaryPhone } from "@/lib/data/site";
import { formatNumber, toPersianDigits } from "@/lib/format";

/**
 * اطلاع‌رسانی پیامکی به مدیریت.
 *
 * فقط لحظه ثبت سفارش صدا زده می‌شود.
 *
 * درباره طول پیام: پیامک فارسی هر ۷۰ نویسه یک بخش حساب می‌شود و این متن حدود
 * ۸۵ نویسه است، یعنی دو بخش. عمداً کوتاه‌ترش نکردیم چون حذف نام یا شماره
 * مشتری یعنی مدیر برای هر سفارش باید پنل را باز کند. اگر تعداد سفارش‌ها زیاد
 * شد و هزینه پیامک مهم شد، کوتاه کردن این متن اولین جای صرفه‌جویی است.
 */

/** شماره‌ای که پیامک سفارش به آن می‌رود. */
function adminRecipient(): string {
  // اگر متغیر محیطی تنظیم نشده باشد، شماره اصلی مجموعه از site.ts استفاده
  // می‌شود تا پیکربندی یک جای کمتر برای فراموش کردن داشته باشد.
  return process.env.ADMIN_SMS_RECIPIENT?.trim() || primaryPhone.tel;
}

export type NewOrderSms = {
  reference: string;
  customerName: string;
  phone: string;
  total: number;
  itemCount: number;
};

/**
 * پیامک «سفارش جدید» برای مدیریت.
 *
 * هیچ‌وقت throw نمی‌کند. سفارش در همین لحظه در دیتابیس ثبت شده و اگر پیامک
 * نرود، نباید خرید مشتری خراب شود — فقط در لاگ سرور ثبت می‌شود.
 */
export async function notifyAdminNewOrder(order: NewOrderSms): Promise<void> {
  const message = [
    "سفارش جدید ثبت شد",
    `کد: ${order.reference}`,
    `${order.customerName} - ${order.phone}`,
    `${toPersianDigits(order.itemCount)} قلم - ${formatNumber(order.total)} تومان`,
  ].join("\n");

  const result = await sendSms(adminRecipient(), message);

  if (!result.ok) {
    if (result.skipped) {
      console.info(`[sms] پیامک سفارش ${order.reference} ارسال نشد: ${result.reason}`);
    } else {
      console.error(`[sms] ارسال پیامک سفارش ${order.reference} ناموفق: ${result.reason}`);
    }
  }
}
