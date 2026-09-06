import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsClient } from "./products-client";
import ProductsLoading from "./loading";
import {
  getBrandCounts,
  getBrands,
  getCategories,
  getCategoryCounts,
  getPriceBounds,
  getPublishedProducts,
} from "@/lib/db/public";

/*
  صفحه از دیتابیس می‌خواند. کوئری‌ها با برچسب کش شده‌اند و اکشن‌های پنل بعد از
  هر ویرایش برچسب را باطل می‌کنند، پس معمولاً همین که ادمین ذخیره کند صفحه
  تازه می‌شود. این revalidate فقط تور ایمنی است: اگر ایمیج بدون دیتابیس ساخته
  شده باشد (حالت داکر) صفحه خالی build می‌شود و باید خودش را بسازد.
*/
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "فروشگاه محصولات",
  description:
    "خرید دستگاه CPAP و BiPAP، ماسک‌های تنفسی، سنسورهای پلی‌سومنوگرافی، الکترودهای EEG، اکسیژن‌ساز و لوازم جانبی با گارانتی رسمی.",
  alternates: { canonical: "/products" },
};

/**
 * کاتالوگ از دیتابیس خوانده و به کامپوننت کلاینت پاس داده می‌شود.
 *
 * فیلتر کردن همچنان سمت کلاینت انجام می‌شود (بدون رفت‌وبرگشت شبکه، تجربه
 * آنی)، ولی خودِ داده دیگر داخل باندل جاوااسکریپت نیست: به‌صورت payload سرور
 * می‌آید و چون همه کوئری‌ها کش‌شده‌اند، دیتابیس در بازدید عادی اصلاً صدا زده
 * نمی‌شود.
 */
export default async function ProductsPage() {
  const [products, categories, brands, categoryCounts, brandCounts, priceBounds] =
    await Promise.all([
      getPublishedProducts(),
      getCategories(),
      getBrands(),
      getCategoryCounts(),
      getBrandCounts(),
      getPriceBounds(),
    ]);

  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsClient
        products={products}
        categories={categories}
        brands={brands}
        categoryCounts={categoryCounts}
        brandCounts={brandCounts}
        priceBounds={priceBounds}
      />
    </Suspense>
  );
}
