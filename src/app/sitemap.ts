import type { MetadataRoute } from "next";
import { getProductSitemapEntries, getPublishedArticles } from "@/lib/db/public";
import { siteConfig } from "@/lib/data/site";

/**
 * نقشه سایت.
 *
 * دو نکته که راحت از قلم می‌افتند:
 *
 * ۱. اسلاگ‌های این سایت فارسی‌اند. طبق پروتکل sitemap، آدرس داخل <loc> باید
 *    با RFC-3986 کدگذاری شده باشد. مهم‌تر از خودِ استاندارد این است که تگ
 *    canonical صفحه‌ها را نکست خودکار کد می‌کند؛ اگر نقشه سایت آدرس خام
 *    بفرستد، گوگل دو رشته متفاوت برای یک صفحه می‌بیند.
 *
 * ۲. تاریخ تغییر باید واقعی باشد. قبلاً برای همه محصولات new Date() گذاشته
 *    می‌شد، یعنی هر بار خزنده می‌آمد همه چیز «امروز تغییر کرده» بود. این
 *    سیگنال بی‌ارزش است و گوگل به‌مرور به lastmod سایت بی‌اعتماد می‌شود؛ حالا
 *    از updatedAt خود رکورد خوانده می‌شود.
 */

/** فقط بخش مسیر کد می‌شود، نه اسلش‌های جداکننده. */
function encodePath(...segments: string[]): string {
  return segments.map((s) => encodeURIComponent(s)).join("/");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: `${base}/`, priority: 1, changeFrequency: "weekly" },
      { url: `${base}/products`, priority: 0.9, changeFrequency: "daily" },
      { url: `${base}/blog`, priority: 0.8, changeFrequency: "weekly" },
      { url: `${base}/contact`, priority: 0.7, changeFrequency: "yearly" },
      { url: `${base}/about`, priority: 0.6, changeFrequency: "yearly" },
      { url: `${base}/faq`, priority: 0.6, changeFrequency: "monthly" },
      // صفحه پیگیری سفارش نمایه‌پذیر است و عبارت «پیگیری سفارش» جست‌وجو می‌شود.
      { url: `${base}/track`, priority: 0.5, changeFrequency: "yearly" },
      { url: `${base}/terms`, priority: 0.3, changeFrequency: "yearly" },
      { url: `${base}/privacy`, priority: 0.3, changeFrequency: "yearly" },
    ] satisfies MetadataRoute.Sitemap
  ).map((r) => ({ ...r, lastModified: now }));

  const [products, articles] = await Promise.all([
    getProductSitemapEntries(),
    getPublishedArticles(),
  ]);

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/products/${encodePath(p.slug)}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/blog/${encodePath(a.slug)}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
