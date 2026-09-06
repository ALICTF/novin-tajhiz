import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsClient } from "./products-client";
import ProductsLoading from "./loading";

export const metadata: Metadata = {
  title: "فروشگاه محصولات",
  description:
    "خرید دستگاه CPAP و BiPAP، ماسک‌های تنفسی، سنسورهای پلی‌سومنوگرافی، الکترودهای EEG، اکسیژن‌ساز و لوازم جانبی با گارانتی رسمی.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsClient />
    </Suspense>
  );
}
