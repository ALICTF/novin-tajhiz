import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/client";
import type {
  Category,
  CategoryId,
  Product,
  ProductSummary,
} from "@/lib/data/catalog-meta";
import type {
  Article,
  ArticleBlock,
  ArticleCategory,
} from "@/lib/data/article-meta";

/**
 * خواندن داده سایت عمومی از دیتابیس.
 *
 * مسئله عملکردی اینجا این است: صفحه محصول و وبلاگ تا دیروز از فایل ثابت
 * می‌خواندند و در زمان build به HTML استاتیک تبدیل می‌شدند. حالا که منبع
 * دیتابیس است، اگر ساده کوئری بزنیم هر بازدید یک رفت‌وبرگشت به دیتابیس
 * می‌شود و صفحه از حالت استاتیک درمی‌آید.
 *
 * راه‌حل: هر تابع داخل unstable_cache با یک برچسب بسته‌بندی شده. نتیجه تا
 * وقتی ادمین چیزی عوض نکند از کش خوانده می‌شود، و اکشن‌های پنل با
 * revalidateTag همان برچسب را باطل می‌کنند (src/lib/db/tags.ts).
 *
 * یعنی سرعت صفحه استاتیک را داریم، ولی محتوا بلافاصله بعد از ویرایش تازه
 * می‌شود — بدون build دوباره.
 */

export const CACHE_TAGS = {
  products: "products",
  articles: "articles",
  categories: "categories",
  reviews: "reviews",
} as const;

/** JSON.parse امن — یک رکورد خراب نباید کل صفحه را بیندازد. */
function parseList<T>(raw: string): T[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? (value as T[]) : [];
  } catch {
    return [];
  }
}

/**
 * اجرای کوئری با تحمل نبودِ دیتابیس.
 *
 * هنگام ساخت ایمیج داکر هیچ دیتابیسی بالا نیست، ولی نکست همان موقع صفحه‌های
 * استاتیک را می‌سازد. بدون این محافظ، کل build شکست می‌خورد.
 *
 * در این حالت نتیجه خالی برمی‌گردد و صفحه با محتوای خالی ساخته می‌شود؛ چون
 * صفحه‌ها revalidate دارند و اکشن‌های پنل هم برچسب‌ها را باطل می‌کنند، اولین
 * بازدید بعد از بالا آمدن سرویس داده واقعی را می‌سازد و کش می‌کند.
 *
 * در زمان اجرا خطا پنهان نمی‌شود و لاگ می‌گیرد تا در مانیتورینگ دیده شود.
 */
async function safeQuery<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    if (process.env.NEXT_PHASE !== "phase-production-build") {
      console.error("[db] کوئری ناموفق:", error);
    }
    return fallback;
  }
}

/* ----------------------------- دسته‌بندی‌ها ----------------------------- */

export const getCategories = unstable_cache(
  async (): Promise<Category[]> =>
    safeQuery(async () => {
      const rows = await prisma.category.findMany({
        orderBy: { sortIndex: "asc" },
      });
      return rows.map((c) => ({
        id: c.id as CategoryId,
        name: c.name,
        shortName: c.shortName,
        description: c.description,
        icon: c.icon as Category["icon"],
      }));
    }, []),
  ["categories"],
  { tags: [CACHE_TAGS.categories] },
);

export const getCategoryCounts = unstable_cache(
  async (): Promise<Record<string, number>> =>
    safeQuery(async () => {
      const rows = await prisma.product.groupBy({
        by: ["categoryId"],
        where: { published: true },
        _count: { _all: true },
      });
      return Object.fromEntries(rows.map((r) => [r.categoryId, r._count._all]));
    }, {}),
  ["category-counts"],
  { tags: [CACHE_TAGS.products] },
);

/* ------------------------------ محصولات ------------------------------ */

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  categoryId: string;
  price: number | null;
  oldPrice: number | null;
  images: string;
  shortDescription: string;
  tags: string;
  rating: number;
  reviewsCount: number;
  sku: string;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  sortIndex: number;
};

function toSummary(row: ProductRow): ProductSummary {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    categoryId: row.categoryId as CategoryId,
    price: row.price,
    oldPrice: row.oldPrice ?? undefined,
    images: parseList<string>(row.images),
    shortDescription: row.shortDescription,
    tags: parseList<string>(row.tags),
    rating: row.rating,
    reviewsCount: row.reviewsCount,
    sku: row.sku,
    inStock: row.inStock,
    isNew: row.isNew,
    isFeatured: row.isFeatured,
    sortIndex: row.sortIndex,
  };
}

/** ستون‌های لازم برای کارت محصول — عمداً بدون description تا payload سبک بماند. */
const SUMMARY_SELECT = {
  id: true,
  slug: true,
  name: true,
  brand: true,
  categoryId: true,
  price: true,
  oldPrice: true,
  images: true,
  shortDescription: true,
  tags: true,
  rating: true,
  reviewsCount: true,
  sku: true,
  inStock: true,
  isNew: true,
  isFeatured: true,
  sortIndex: true,
} as const;

/**
 * کل کاتالوگ منتشرشده.
 *
 * ۸۶ رکورد سبک است و یک‌بار در کش می‌نشیند؛ صفحه فهرست، جستجو و مقایسه همه از
 * همین یکی تغذیه می‌شوند و فیلتر کردنشان در حافظه ارزان‌تر از چند کوئری جدا است.
 */
export const getPublishedProducts = unstable_cache(
  async (): Promise<ProductSummary[]> =>
    safeQuery(async () => {
      const rows = await prisma.product.findMany({
        where: { published: true },
        orderBy: { sortIndex: "desc" },
        select: SUMMARY_SELECT,
      });
      return rows.map(toSummary);
    }, []),
  ["published-products"],
  { tags: [CACHE_TAGS.products] },
);

export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<Product | null> =>
    safeQuery(async () => {
      const row = await prisma.product.findFirst({
        where: { slug, published: true },
      });
      if (!row) return null;
      return {
        ...toSummary(row),
        description: parseList<string>(row.description),
      };
    }, null),
  ["product-by-slug"],
  { tags: [CACHE_TAGS.products] },
);

/** فقط اسلاگ‌ها — برای generateStaticParams. */
export const getProductSlugs = unstable_cache(
  async (): Promise<string[]> =>
    safeQuery(async () => {
      const rows = await prisma.product.findMany({
        where: { published: true },
        select: { slug: true },
      });
      return rows.map((r) => r.slug);
    }, []),
  ["product-slugs"],
  { tags: [CACHE_TAGS.products] },
);

/**
 * اسلاگ و تاریخ آخرین ویرایش هر محصول — برای sitemap.
 *
 * جدا از getProductSlugs است چون آنجا فقط برای generateStaticParams لازم
 * است و اضافه کردن updatedAt به آن، بی‌دلیل داده بیشتری در کش می‌گذاشت.
 */
export const getProductSitemapEntries = unstable_cache(
  async (): Promise<{ slug: string; updatedAt: Date }[]> =>
    safeQuery(async () => {
      return prisma.product.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      });
    }, []),
  ["product-sitemap"],
  { tags: [CACHE_TAGS.products] },
);

export const getBrands = unstable_cache(
  async (): Promise<string[]> =>
    safeQuery(async () => {
      const rows = await prisma.product.findMany({
        where: { published: true },
        distinct: ["brand"],
        select: { brand: true },
        orderBy: { brand: "asc" },
      });
      return rows.map((r) => r.brand);
    }, []),
  ["brands"],
  { tags: [CACHE_TAGS.products] },
);

export const getBrandCounts = unstable_cache(
  async (): Promise<Record<string, number>> =>
    safeQuery(async () => {
      const rows = await prisma.product.groupBy({
        by: ["brand"],
        where: { published: true },
        _count: { _all: true },
      });
      return Object.fromEntries(rows.map((r) => [r.brand, r._count._all]));
    }, {}),
  ["brand-counts"],
  { tags: [CACHE_TAGS.products] },
);

export const getPriceBounds = unstable_cache(
  async (): Promise<{ min: number; max: number }> =>
    safeQuery(
      async () => {
        const agg = await prisma.product.aggregate({
          where: { published: true },
          _max: { price: true },
        });
        return { min: 0, max: agg._max.price ?? 0 };
      },
      { min: 0, max: 0 },
    ),
  ["price-bounds"],
  { tags: [CACHE_TAGS.products] },
);

/* ------------------------------- مقالات ------------------------------- */

type ArticleRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  icon: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  tags: string;
  body: string;
  isFeatured: boolean;
  publishedAt: Date;
};

function toArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    image: row.image,
    icon: row.icon as Article["icon"],
    category: row.category as ArticleCategory,
    author: row.author,
    authorRole: row.authorRole,
    date: row.date,
    publishedAt: row.publishedAt.toISOString().slice(0, 10),
    readTime: row.readTime,
    isFeatured: row.isFeatured,
    tags: parseList<string>(row.tags),
    body: parseList<ArticleBlock>(row.body),
  };
}

export const getPublishedArticles = unstable_cache(
  async (): Promise<Article[]> =>
    safeQuery(async () => {
      const rows = await prisma.article.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
      });
      return rows.map(toArticle);
    }, []),
  ["published-articles"],
  { tags: [CACHE_TAGS.articles] },
);

export const getArticleBySlug = unstable_cache(
  async (slug: string): Promise<Article | null> =>
    safeQuery(async () => {
      const row = await prisma.article.findFirst({
        where: { slug, published: true },
      });
      return row ? toArticle(row) : null;
    }, null),
  ["article-by-slug"],
  { tags: [CACHE_TAGS.articles] },
);

export const getArticleSlugs = unstable_cache(
  async (): Promise<string[]> =>
    safeQuery(async () => {
      const rows = await prisma.article.findMany({
        where: { published: true },
        select: { slug: true },
      });
      return rows.map((r) => r.slug);
    }, []),
  ["article-slugs"],
  { tags: [CACHE_TAGS.articles] },
);

/* ------------------------------- نظرات ------------------------------- */

export type PublicReview = {
  id: number;
  productId: number;
  user: string;
  date: string;
  rating: number;
  text: string;
  helpful: number;
  verified: boolean;
};

export const getProductReviews = unstable_cache(
  async (productId: number): Promise<PublicReview[]> =>
    safeQuery(async () => {
      const rows = await prisma.review.findMany({
        where: { productId, published: true },
        orderBy: { createdAt: "desc" },
      });
      return rows.map((r) => ({
        id: r.id,
        productId: r.productId,
        user: r.user,
        date: r.createdAt.toISOString().slice(0, 10),
        rating: r.rating,
        text: r.text,
        helpful: r.helpful,
        verified: r.verified,
      }));
    }, []),
  ["product-reviews"],
  { tags: [CACHE_TAGS.reviews] },
);
