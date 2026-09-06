import type { Metadata } from "next";
import { BlogClient } from "./blog-client";
import { getPublishedArticles } from "@/lib/db/public";
import { breadcrumbJsonLd, collectionJsonLd, JsonLd } from "@/lib/seo/json-ld";

/*
  صفحه از دیتابیس می‌خواند. کوئری‌ها با برچسب کش شده‌اند و اکشن‌های پنل بعد از
  هر ویرایش برچسب را باطل می‌کنند، پس معمولاً همین که ادمین ذخیره کند صفحه
  تازه می‌شود. این revalidate فقط تور ایمنی است: اگر ایمیج بدون دیتابیس ساخته
  شده باشد (حالت داکر) صفحه خالی build می‌شود و باید خودش را بسازد.
*/
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "مجله تخصصی خواب و تنفس",
  description:
    "مقالات علمی و راهنماهای کاربردی درباره آپنه خواب، دستگاه‌های CPAP و BiPAP، نگهداری تجهیزات و سلامت خواب.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "وبلاگ" }], "/blog")} />
      <JsonLd
        data={collectionJsonLd({
          name: "مجله تخصصی خواب و تنفس",
          description:
            "مقالات علمی و راهنماهای کاربردی درباره آپنه خواب، تست خواب، دستگاه‌های CPAP و BiPAP و نگهداری تجهیزات.",
          path: "/blog",
          items: articles.map((a) => ({
            name: a.title,
            url: `/blog/${a.slug}`,
          })),
        })}
      />
      <BlogClient articles={articles} />
    </>
  );
}
