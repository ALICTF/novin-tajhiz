import type { Metadata } from "next";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "تسویه‌حساب",
  description: "تکمیل اطلاعات ارسال و ثبت نهایی سفارش.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
