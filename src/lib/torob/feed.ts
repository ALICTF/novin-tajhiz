import "server-only";

import { prisma } from "@/lib/db/client";
import { siteConfig, warrantyStatement } from "@/lib/data/site";

/**
 * ساخت فید محصولات برای ترب.
 *
 * ترب خودش دوره‌ای این فید را می‌خواند و قیمت و موجودی را از آن به‌روز می‌کند.
 * قالب دقیقاً مطابق مستندات رسمی ترب است؛ نکات مهمی که در پیاده‌سازی رعایت
 * شده‌اند:
 *
 *  • همه مقادیر عددی به‌صورت رشته برمی‌گردند (خود ترب هم در نمونه‌اش
 *    "5000000" نوشته، نه 5000000).
 *  • هر صفحه دقیقاً ۱۰۰ محصول.
 *  • ترتیب از جدید به قدیم، با اولویت محصولات تازه ویرایش‌شده.
 *  • جستجوی تک‌محصول هم باید *لیستی با یک عضو* برگرداند، نه یک شیء تنها.
 */

export const TOROB_PAGE_SIZE = 100;

export type TorobProduct = {
  title: string;
  subtitle?: string;
  page_unique: string;
  current_price: string;
  old_price?: string;
  availability: "instock" | "outofstock";
  category_name?: string;
  image_link: string;
  page_url: string;
  short_desc?: string;
  spec?: Record<string, string>;
  guarantee?: string;
};

export type TorobFeed = {
  count: string;
  max_pages: string;
  products: TorobProduct[];
};

/** مسیر نسبی را به آدرس کامل تبدیل می‌کند؛ ترب آدرس مطلق می‌خواهد. */
function absolute(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${siteConfig.url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function parseList(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? (value as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * محصولی که به ترب می‌رود باید هم منتشر شده باشد و هم قیمت داشته باشد.
 *
 * محصولات «تماس بگیرید» عمداً کنار گذاشته می‌شوند: ترب موتور مقایسه قیمت است
 * و رکوردی بدون قیمت آنجا معنا ندارد — در بهترین حالت رد می‌شود و در بدترین
 * حالت با قیمت صفر نمایش داده می‌شود.
 */
const FEED_WHERE = { published: true, price: { not: null } } as const;

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  price: number | null;
  oldPrice: number | null;
  images: string;
  shortDescription: string;
  sku: string;
  inStock: boolean;
  category: { shortName: string };
};

function toTorobProduct(row: ProductRow): TorobProduct {
  const images = parseList(row.images);

  const product: TorobProduct = {
    title: row.name,
    page_unique: String(row.id),
    current_price: String(row.price ?? 0),
    availability: row.inStock ? "instock" : "outofstock",
    category_name: row.category.shortName,
    image_link: absolute(images[0] ?? ""),
    page_url: absolute(`/products/${row.slug}`),
    guarantee: warrantyStatement,
    spec: {
      برند: row.brand,
      "کد کالا": row.sku,
    },
  };

  // برند معمولاً نام لاتین محصول است و ترب همان را به‌عنوان زیرعنوان می‌خواهد.
  if (row.brand) product.subtitle = row.brand;
  if (row.shortDescription) product.short_desc = row.shortDescription;

  // قیمت قبلی فقط وقتی معنا دارد که واقعاً بیشتر از قیمت فعلی باشد.
  if (row.oldPrice && row.price && row.oldPrice > row.price) {
    product.old_price = String(row.oldPrice);
  }

  return product;
}

const SELECT = {
  id: true,
  slug: true,
  name: true,
  brand: true,
  price: true,
  oldPrice: true,
  images: true,
  shortDescription: true,
  sku: true,
  inStock: true,
  category: { select: { shortName: true } },
} as const;

/** یک صفحه از فهرست محصولات. */
export async function getTorobPage(page: number): Promise<TorobFeed> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

  const [rows, count] = await Promise.all([
    prisma.product.findMany({
      where: FEED_WHERE,
      // ترب می‌خواهد محصولات تازه‌اضافه‌شده و تازه‌ویرایش‌شده اول بیایند.
      orderBy: { updatedAt: "desc" },
      skip: (safePage - 1) * TOROB_PAGE_SIZE,
      take: TOROB_PAGE_SIZE,
      select: SELECT,
    }),
    prisma.product.count({ where: FEED_WHERE }),
  ]);

  return {
    count: String(count),
    max_pages: String(Math.max(1, Math.ceil(count / TOROB_PAGE_SIZE))),
    products: rows.map(toTorobProduct),
  };
}

/**
 * جستجوی یک محصول با شناسه یا آدرس صفحه.
 *
 * ترب ممکن است پارامترهایی مثل utm به انتهای لینک اضافه کند، پس آدرس قبل از
 * مقایسه از کوئری‌استرینگ پاک می‌شود — وگرنه همان محصول «پیدا نشد» گزارش
 * می‌شد.
 */
export async function getTorobSingle(params: {
  pageUnique?: string;
  pageUrl?: string;
}): Promise<TorobFeed> {
  const { pageUnique, pageUrl } = params;

  let row: ProductRow | null = null;

  if (pageUnique) {
    const id = Number(pageUnique);
    if (Number.isInteger(id)) {
      row = await prisma.product.findFirst({
        where: { id, ...FEED_WHERE },
        select: SELECT,
      });
    }
  }

  if (!row && pageUrl) {
    const slug = slugFromUrl(pageUrl);
    if (slug) {
      row = await prisma.product.findFirst({
        where: { slug, ...FEED_WHERE },
        select: SELECT,
      });
    }
  }

  const products = row ? [toTorobProduct(row)] : [];

  return {
    count: String(products.length),
    max_pages: "1",
    products,
  };
}

/** اسلاگ محصول را از آدرس بیرون می‌کشد، با تحمل utm و اسلش انتهایی. */
export function slugFromUrl(pageUrl: string): string | null {
  try {
    // آدرس ممکن است نسبی باشد؛ دامنه سایت به‌عنوان مبنا داده می‌شود.
    const url = new URL(pageUrl, siteConfig.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const index = parts.indexOf("products");
    if (index === -1 || index === parts.length - 1) return null;
    return decodeURIComponent(parts[index + 1]);
  } catch {
    return null;
  }
}

/** آماری که پنل مدیریت نشان می‌دهد. */
export async function getTorobStats() {
  const [included, unpublished, noPrice, outOfStock, total] = await Promise.all([
    prisma.product.count({ where: FEED_WHERE }),
    prisma.product.count({ where: { published: false } }),
    prisma.product.count({ where: { published: true, price: null } }),
    prisma.product.count({ where: { ...FEED_WHERE, inStock: false } }),
    prisma.product.count(),
  ]);

  return {
    included,
    unpublished,
    noPrice,
    outOfStock,
    total,
    pages: Math.max(1, Math.ceil(included / TOROB_PAGE_SIZE)),
  };
}

/** محصولاتی که منتشر شده‌اند ولی قیمت ندارند، پس به ترب نمی‌روند. */
export async function getTorobExcluded(limit = 50) {
  return prisma.product.findMany({
    where: { published: true, price: null },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: { id: true, name: true, sku: true, brand: true },
  });
}
