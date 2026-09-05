import * as z from "zod/mini";
import { toLatinDigits } from "@/lib/format";

/**
 * از `zod/mini` استفاده می‌شود، نه `zod`.
 *
 * API معمول zod متدزنجیره‌ای است (`z.string().min(1).email()`) و همین باعث
 * می‌شود کل کتابخانه — حدود ۱۰۰ کیلوبایت gzip — وارد باندل شود، چون هیچ متدی
 * قابل حذف در tree-shaking نیست. نسخه mini همان هسته اعتبارسنجی را دارد ولی
 * هر بررسی یک تابع مستقل است، پس فقط چیزی که واقعاً استفاده می‌شود باندل
 * می‌شود. رفتار و متن خطاها عیناً حفظ شده است.
 */

const stripSeparators = (value: string) => value.replace(/[\s-]/g, "");
const isIranMobile = (value: string) => /^0?9\d{9}$/.test(stripSeparators(value));

/** موبایل ایران؛ ارقام فارسی هم پذیرفته و نرمال می‌شوند. */
export const iranPhone = z
  .pipe(
    z.string().check(z.minLength(1, "شماره تماس را وارد کنید")),
    z.transform(toLatinDigits),
  )
  .check(z.refine(isIranMobile, "شماره موبایل معتبر نیست (مثال: ۰۹۱۵۱۲۳۴۵۶۷)"));

export const optionalIranPhone = z.optional(
  z
    .pipe(z.string(), z.transform(toLatinDigits))
    .check(
      z.refine((v: string) => v === "" || isIranMobile(v), "شماره موبایل معتبر نیست"),
    ),
);

export const persianName = z
  .string()
  .check(
    z.minLength(3, "نام و نام خانوادگی را کامل وارد کنید"),
    z.maxLength(60, "نام واردشده بیش از حد طولانی است"),
  );

export const emailField = z
  .string()
  .check(z.minLength(1, "ایمیل را وارد کنید"), z.email("ایمیل معتبر نیست"));

/** ایمیل اختیاری: یا خالی، یا اصلاً وارد نشده، یا یک ایمیل معتبر. */
const optionalEmail = z.optional(
  z.union([z.literal(""), z.string().check(z.email("ایمیل معتبر نیست"))]),
);

/* ------------------------------ فرم تماس ------------------------------ */

export const contactSchema = z.object({
  name: persianName,
  phone: iranPhone,
  email: optionalEmail,
  subject: z
    .string()
    .check(z.minLength(3, "موضوع پیام را وارد کنید"), z.maxLength(100)),
  message: z
    .string()
    .check(
      z.minLength(10, "متن پیام باید حداقل ۱۰ نویسه باشد"),
      z.maxLength(1500, "متن پیام بیش از حد طولانی است"),
    ),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

/* ------------------------------ خبرنامه ------------------------------ */

export const newsletterSchema = z.object({
  email: emailField,
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

/* ----------------------------- تسویه‌حساب ----------------------------- */

export const checkoutShippingSchema = z.object({
  firstName: z.string().check(z.minLength(2, "نام را وارد کنید"), z.maxLength(40)),
  lastName: z
    .string()
    .check(z.minLength(2, "نام خانوادگی را وارد کنید"), z.maxLength(40)),
  phone: iranPhone,
  email: optionalEmail,
  province: z.string().check(z.minLength(1, "استان را انتخاب کنید")),
  city: z.string().check(z.minLength(2, "شهر را وارد کنید"), z.maxLength(40)),
  address: z
    .string()
    .check(z.minLength(10, "نشانی را کامل وارد کنید"), z.maxLength(300)),
  postalCode: z
    .pipe(z.string(), z.transform(toLatinDigits))
    .check(
      z.refine(
        (v: string) => /^\d{10}$/.test(stripSeparators(v)),
        "کد پستی باید ۱۰ رقم باشد",
      ),
    ),
  shippingMethod: z.enum(["courier", "post", "pickup"]),
  paymentMethod: z.enum(["online", "transfer", "onDelivery"]),
  note: z.union([z.literal(""), z.optional(z.string().check(z.maxLength(500)))]),
});

export type CheckoutFormValues = z.infer<typeof checkoutShippingSchema>;

/* ------------------------------ ثبت دیدگاه ------------------------------ */

export const reviewSchema = z.object({
  name: persianName,
  rating: z.number().check(z.gte(1, "امتیاز خود را انتخاب کنید"), z.lte(5)),
  text: z
    .string()
    .check(
      z.minLength(10, "متن دیدگاه باید حداقل ۱۰ نویسه باشد"),
      z.maxLength(800),
    ),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
