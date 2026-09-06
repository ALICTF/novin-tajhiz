import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsClient } from "./products-client";
import ProductsLoading from "./loading";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import {
  breadcrumbJsonLd,
  collectionJsonLd,
  JsonLd,
} from "@/lib/seo/json-ld";
import { toPersianDigits } from "@/lib/format";
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

  const crumbs = [{ label: "فروشگاه محصولات" }];

  return (
    <div className="bg-slate-50">
      <JsonLd data={breadcrumbJsonLd(crumbs, "/products")} />
      <JsonLd
        data={collectionJsonLd({
          name: "فروشگاه محصولات نوین تجهیز",
          description:
            "کاتالوگ تجهیزات، اکسسوری و قطعات یدکی پلی‌سومنوگرافی، نوار مغز و دستگاه‌های کمک تنفسی CPAP و BiPAP.",
          path: "/products",
          items: products.map((p) => ({
            name: p.name,
            url: `/products/${p.slug}`,
          })),
        })}
      />

      {/*
        سربرگ صفحه عمداً اینجا و سمت سرور است، نه داخل ProductsClient.

        ProductsClient از useSearchParams استفاده می‌کند و نکست کل زیردرخت آن
        را به رندر سمت کلاینت می‌برد. تا قبل از این، عنوان و مسیر راهنما داخل
        همان کامپوننت بودند و نتیجه‌اش این بود که HTML سرورِ مهم‌ترین صفحه
        تجاری سایت هیچ <h1> و هیچ متنی نداشت — خزنده فقط اسکلت لودینگ را
        می‌دید.
      */}
      <div className="border-b border-slate-200 bg-white pt-32 pb-8">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <Breadcrumbs items={crumbs} className="mb-6" />

          <h1 className="mb-3 text-3xl font-black tracking-tight text-slate-900">
            فروشگاه محصولات
          </h1>

          <p className="max-w-3xl leading-loose text-slate-600">
            {toPersianDigits(products.length)} قلم تجهیزات، اکسسوری و قطعات یدکی
            تخصصی خواب و تنفس در {toPersianDigits(categories.length)} دسته:
            سنسور و پراب پلی‌سومنوگرافی، اقلام مصرفی کلینیک‌های خواب، الکترود و
            اکسسوری نوار مغز و نوروفیدبک، و قطعات دستگاه‌های CPAP و BiPAP
            برندهای رزمد، فیلیپس و لوون‌اشتاین. برای رسیدن سریع‌تر به قطعه
            موردنظر، از فیلتر دسته‌بندی و برند در همین صفحه استفاده کنید.
          </p>

          {/*
            لینک دسته‌ها، سمت سرور.

            دو کار می‌کند: خزنده مسیر رسیدن به هر دسته را در HTML می‌بیند
            (فیلترهای بالا کلاینتی‌اند و لینکی تولید نمی‌کنند)، و توضیح هر
            دسته متن قابل ایندکس به صفحه اضافه می‌کند — این صفحه قبلاً فقط
            چند ده واژه داشت.
          */}
          <ul className="mt-7 flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/products?category=${c.id}`}
                  title={c.description}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  {c.shortName}
                  <span className="text-xs text-slate-400 tabular-nums">
                    {toPersianDigits(categoryCounts[c.id] ?? 0)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
    </div>
  );
}
