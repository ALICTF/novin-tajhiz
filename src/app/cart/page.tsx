import type { Metadata } from "next";
import { CartClient } from "./cart-client";

export const metadata: Metadata = {
  title: "سبد خرید",
  description: "بازبینی و ویرایش اقلام انتخابی پیش از ثبت نهایی سفارش.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartClient />;
}
