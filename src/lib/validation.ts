import { z } from "zod";
import { toLatinDigits } from "@/lib/format";

/** موبایل ایران؛ ارقام فارسی هم پذیرفته و نرمال می‌شوند. */
export const iranPhone = z
  .string()
  .min(1, "شماره تماس را وارد کنید")
  .transform(toLatinDigits)
  .refine((v) => /^0?9\d{9}$/.test(v.replace(/[\s-]/g, "")), {
    message: "شماره موبایل معتبر نیست (مثال: ۰۹۱۵۱۲۳۴۵۶۷)",
  });

export const optionalIranPhone = z
  .string()
  .transform(toLatinDigits)
  .refine((v) => v === "" || /^0?9\d{9}$/.test(v.replace(/[\s-]/g, "")), {
    message: "شماره موبایل معتبر نیست",
  })
  .optional();

export const persianName = z
  .string()
  .min(3, "نام و نام خانوادگی را کامل وارد کنید")
  .max(60, "نام واردشده بیش از حد طولانی است");

export const emailField = z
  .string()
  .min(1, "ایمیل را وارد کنید")
  .email("ایمیل معتبر نیست");

/* ------------------------------ فرم تماس ------------------------------ */

export const contactSchema = z.object({
  name: persianName,
  phone: iranPhone,
  email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  subject: z.string().min(3, "موضوع پیام را وارد کنید").max(100),
  message: z
    .string()
    .min(10, "متن پیام باید حداقل ۱۰ نویسه باشد")
    .max(1500, "متن پیام بیش از حد طولانی است"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

/* ------------------------------ خبرنامه ------------------------------ */

export const newsletterSchema = z.object({
  email: emailField,
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

/* ----------------------------- تسویه‌حساب ----------------------------- */

export const checkoutShippingSchema = z.object({
  firstName: z.string().min(2, "نام را وارد کنید").max(40),
  lastName: z.string().min(2, "نام خانوادگی را وارد کنید").max(40),
  phone: iranPhone,
  email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  province: z.string().min(1, "استان را انتخاب کنید"),
  city: z.string().min(2, "شهر را وارد کنید").max(40),
  address: z.string().min(10, "نشانی را کامل وارد کنید").max(300),
  postalCode: z
    .string()
    .transform(toLatinDigits)
    .refine((v) => /^\d{10}$/.test(v.replace(/[\s-]/g, "")), {
      message: "کد پستی باید ۱۰ رقم باشد",
    }),
  shippingMethod: z.enum(["courier", "post", "pickup"]),
  paymentMethod: z.enum(["online", "transfer", "onDelivery"]),
  note: z.string().max(500).optional().or(z.literal("")),
});

export type CheckoutFormValues = z.infer<typeof checkoutShippingSchema>;

/* ------------------------------ ثبت دیدگاه ------------------------------ */

export const reviewSchema = z.object({
  name: persianName,
  rating: z.number().min(1, "امتیاز خود را انتخاب کنید").max(5),
  text: z.string().min(10, "متن دیدگاه باید حداقل ۱۰ نویسه باشد").max(800),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
