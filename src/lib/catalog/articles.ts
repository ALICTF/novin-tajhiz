import type { Article, ArticleBlock } from "@/lib/data/article-meta";

/**
 * منطق خالص مقالات — بدون وابستگی به منبع داده.
 * دلیل جدا بودنش همان دلیل filter.ts است: قابل استفاده روی نتیجه دیتابیس و
 * داخل کامپوننت کلاینت، بدون آوردن خودِ مقالات به باندل.
 */

export function getFeaturedArticle(articles: Article[]): Article | undefined {
  return articles.find((a) => a.isFeatured) ?? articles[0];
}

export function getLatestArticles(articles: Article[], limit = 3): Article[] {
  return [...articles]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

export function getRelatedArticles(
  articles: Article[],
  article: Article,
  limit = 3,
): Article[] {
  const sameCategory = articles.filter(
    (a) => a.id !== article.id && a.category === article.category,
  );
  const rest = articles.filter(
    (a) => a.id !== article.id && a.category !== article.category,
  );
  return [...sameCategory, ...rest].slice(0, limit);
}

export function getArticleCategoryCounts(
  articles: Article[],
): Record<string, number> {
  return articles.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});
}

/** فهرست عناوین برای ساخت «فهرست مطالب» صفحه مقاله. */
export function getArticleHeadings(article: Article) {
  return article.body
    .filter(
      (b): b is Extract<ArticleBlock, { type: "heading" }> => b.type === "heading",
    )
    .map((b) => ({ id: b.id, text: b.text }));
}

/** جستجوی ساده در عنوان، خلاصه و برچسب‌ها. */
export function searchArticles(
  articles: Article[],
  query: string,
  category?: string,
): Article[] {
  const q = query.trim().toLowerCase();
  return articles.filter((a) => {
    const matchesCategory =
      !category || category === "همه مطالب" || a.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;
    return [a.title, a.excerpt, a.author, ...a.tags]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
}
