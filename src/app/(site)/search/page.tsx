import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchClient } from "./search-client";
import { getPublishedArticles, getPublishedProducts } from "@/lib/db/public";

/*
  صفحه از دیتابیس می‌خواند. کوئری‌ها با برچسب کش شده‌اند و اکشن‌های پنل بعد از
  هر ویرایش برچسب را باطل می‌کنند، پس معمولاً همین که ادمین ذخیره کند صفحه
  تازه می‌شود. این revalidate فقط تور ایمنی است: اگر ایمیج بدون دیتابیس ساخته
  شده باشد (حالت داکر) صفحه خالی build می‌شود و باید خودش را بسازد.
*/
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "جستجو",
  description: "جستجو در محصولات فروشگاه و مقالات مجله نوین تجهیز.",
  robots: { index: false, follow: true },
};

export default async function SearchPage() {
  const [products, articles] = await Promise.all([
    getPublishedProducts(),
    getPublishedArticles(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="h-56 animate-pulse rounded-[2rem] border border-slate-200 bg-white" />
          </div>
        </div>
      }
    >
      <SearchClient products={products} articles={articles} />
    </Suspense>
  );
}
