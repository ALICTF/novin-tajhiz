import type { IconName } from "@/lib/icon-map";

/* -------------------------------------------------------------------------- */
/*  فراداده مقالات — بدون خودِ آرایه مقالات.                                    */
/*                                                                            */
/*  به همان دلیل catalog-meta.ts جدا شده: کامپوننت‌های کلاینت (فهرست وبلاگ،     */
/*  جستجو، کارت مقاله) فقط به تایپ‌ها و فهرست دسته‌ها نیاز دارند. اگر آن‌ها را  */
/*  از articles.ts بگیرند، متن کامل همه مقالات هم وارد باندل مرورگر می‌شود.     */
/* -------------------------------------------------------------------------- */

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; id: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; source?: string }
  | { type: "callout"; title: string; text: string };

export const articleCategories = [
  "همه مطالب",
  "تست خواب",
  "راهنمای بیمار",
  "سلامت خواب",
] as const;

export type ArticleCategory = Exclude<
  (typeof articleCategories)[number],
  "همه مطالب"
>;

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  icon: IconName;
  category: ArticleCategory;
  author: string;
  authorRole: string;
  date: string;
  /** برای مرتب‌سازی — تاریخ میلادی انتشار. */
  publishedAt: string;
  readTime: string;
  isFeatured?: boolean;
  tags: string[];
  body: ArticleBlock[];
};

