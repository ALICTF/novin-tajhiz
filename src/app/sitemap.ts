import type { MetadataRoute } from "next";
import { getProductSlugs, getPublishedArticles } from "@/lib/db/public";
import { siteConfig } from "@/lib/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: `${base}/`, priority: 1, changeFrequency: "weekly" },
      { url: `${base}/products`, priority: 0.9, changeFrequency: "daily" },
      { url: `${base}/blog`, priority: 0.8, changeFrequency: "weekly" },
      { url: `${base}/about`, priority: 0.6, changeFrequency: "yearly" },
      { url: `${base}/contact`, priority: 0.7, changeFrequency: "yearly" },
      { url: `${base}/faq`, priority: 0.6, changeFrequency: "monthly" },
      { url: `${base}/terms`, priority: 0.3, changeFrequency: "yearly" },
      { url: `${base}/privacy`, priority: 0.3, changeFrequency: "yearly" },
    ] satisfies MetadataRoute.Sitemap
  ).map((r) => ({ ...r, lastModified: now }));

  const [productSlugs, articles] = await Promise.all([
    getProductSlugs(),
    getPublishedArticles(),
  ]);

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${base}/products/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
