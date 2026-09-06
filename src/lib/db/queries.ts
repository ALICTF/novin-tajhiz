import "server-only";

import { prisma } from "@/lib/db/client";
import {
  isOrderStatus,
  OPEN_ORDER_STATUSES,
  type AdminArticle,
  type AdminOrder,
  type AdminProduct,
  type OrderStatus,
} from "@/lib/db/types";

/**
 * همه خواندن‌های پنل از اینجا رد می‌شوند.
 *
 * چند فیلد در دیتابیس به‌صورت رشته JSON نگهداری می‌شوند (تصاویر، برچسب‌ها،
 * بدنه مقاله). تبدیلشان فقط در همین فایل انجام می‌شود تا بقیه کد با آرایه
 * واقعی کار کند و هیچ‌جای دیگری JSON.parse نبیند.
 *
 * نکته: در PostgreSQL عملگر contains حساس به بزرگی و کوچکی حروف است (برخلاف
 * SQLite). برای همین همه جستجوها mode: "insensitive" دارند، وگرنه جستجوی
 * «philips» برند «Philips» را پیدا نمی‌کرد.
 */

/** JSON.parse امن — رکورد خراب نباید کل صفحه را بیندازد. */
function parseList<T>(raw: string, fallback: T[] = []): T[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? (value as T[]) : fallback;
  } catch {
    return fallback;
  }
}

/* ----------------------------- محصولات ----------------------------- */

type ProductRow = Awaited<ReturnType<typeof prisma.product.findFirst>>;

function toAdminProduct(
  row: NonNullable<ProductRow>,
  categoryName: string,
): AdminProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    categoryId: row.categoryId,
    categoryName,
    price: row.price,
    oldPrice: row.oldPrice,
    shortDescription: row.shortDescription,
    description: parseList<string>(row.description),
    images: parseList<string>(row.images),
    tags: parseList<string>(row.tags),
    rating: row.rating,
    reviewsCount: row.reviewsCount,
    sku: row.sku,
    inStock: row.inStock,
    isNew: row.isNew,
    isFeatured: row.isFeatured,
    sortIndex: row.sortIndex,
    published: row.published,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export type ProductQuery = {
  search?: string;
  categoryId?: string;
  status?: "all" | "published" | "draft" | "out-of-stock";
  page?: number;
  perPage?: number;
};

export async function listProducts(query: ProductQuery = {}) {
  const { search, categoryId, status = "all", page = 1, perPage = 20 } = query;

  const where = {
    ...(categoryId ? { categoryId } : {}),
    ...(status === "published" ? { published: true } : {}),
    ...(status === "draft" ? { published: false } : {}),
    ...(status === "out-of-stock" ? { inStock: false } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { brand: { contains: search, mode: "insensitive" as const } },
            { sku: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { sortIndex: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { category: { select: { shortName: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: rows.map((r) => toAdminProduct(r, r.category.shortName)),
    total,
    page,
    perPage,
    pageCount: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getProductById(id: number): Promise<AdminProduct | null> {
  const row = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { shortName: true } } },
  });
  return row ? toAdminProduct(row, row.category.shortName) : null;
}

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { sortIndex: "asc" } });
}

export async function listBrands(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    distinct: ["brand"],
    select: { brand: true },
    orderBy: { brand: "asc" },
  });
  return rows.map((r) => r.brand);
}

/* ------------------------------ مقالات ------------------------------ */

export async function listArticles(query: { search?: string } = {}) {
  const rows = await prisma.article.findMany({
    where: query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" as const } },
            { excerpt: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : undefined,
    orderBy: { publishedAt: "desc" },
  });

  return rows.map(
    (row): AdminArticle => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      image: row.image,
      icon: row.icon,
      category: row.category,
      author: row.author,
      authorRole: row.authorRole,
      date: row.date,
      readTime: row.readTime,
      tags: parseList<string>(row.tags),
      isFeatured: row.isFeatured,
      published: row.published,
      publishedAt: row.publishedAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }),
  );
}

export async function getArticleById(id: number) {
  const row = await prisma.article.findUnique({ where: { id } });
  if (!row) return null;
  return {
    ...row,
    tags: parseList<string>(row.tags),
    body: parseList<Record<string, unknown>>(row.body),
    publishedAt: row.publishedAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

/* ----------------------------- سفارش‌ها ----------------------------- */

type OrderRow = NonNullable<
  Awaited<ReturnType<typeof prisma.order.findFirst>>
> & {
  items: Awaited<ReturnType<typeof prisma.orderItem.findMany>>;
};

function toAdminOrder(row: OrderRow): AdminOrder {
  return {
    id: row.id,
    reference: row.reference,
    customerName: `${row.firstName} ${row.lastName}`.trim(),
    firstName: row.firstName,
    lastName: row.lastName,
    phone: row.phone,
    email: row.email,
    province: row.province,
    city: row.city,
    address: row.address,
    postalCode: row.postalCode,
    note: row.note,
    shippingMethod: row.shippingMethod,
    paymentMethod: row.paymentMethod,
    subtotal: row.subtotal,
    shippingCost: row.shippingCost,
    total: row.total,
    // وضعیت در دیتابیس رشته آزاد است؛ اگر مقدار ناشناخته‌ای ذخیره شده بود، به
    // جای خراب شدن صفحه، «در انتظار بررسی» در نظر گرفته می‌شود.
    status: isOrderStatus(row.status) ? row.status : "pending",
    receiptPath: row.receiptPath,
    adminNote: row.adminNote,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    items: row.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      name: i.name,
      brand: i.brand,
      sku: i.sku,
      image: i.image,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
    })),
    itemCount: row.items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

export type OrderQuery = {
  search?: string;
  status?: OrderStatus | "all" | "open";
  page?: number;
  perPage?: number;
};

export async function listOrders(query: OrderQuery = {}) {
  const { search, status = "all", page = 1, perPage = 20 } = query;

  const where = {
    ...(status === "open"
      ? { status: { in: OPEN_ORDER_STATUSES } }
      : status !== "all"
        ? { status }
        : {}),
    ...(search
      ? {
          OR: [
            { reference: { contains: search, mode: "insensitive" as const } },
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { items: true },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    items: rows.map(toAdminOrder),
    total,
    page,
    perPage,
    pageCount: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getOrderById(id: number): Promise<AdminOrder | null> {
  const row = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  return row ? toAdminOrder(row) : null;
}

/* ------------------------------- آمار ------------------------------- */

export async function getDashboardStats() {
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const prevMonth = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [
    productCount,
    draftCount,
    outOfStockCount,
    articleCount,
    orderCount,
    openOrderCount,
    unreadMessages,
    revenueAgg,
    thisMonth,
    lastMonth,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { published: false } }),
    prisma.product.count({ where: { inStock: false } }),
    prisma.article.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: OPEN_ORDER_STATUSES } } }),
    prisma.message.count({ where: { read: false } }),
    // سفارش لغوشده در درآمد حساب نمی‌شود.
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "cancelled" } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
      where: { status: { not: "cancelled" }, createdAt: { gte: monthAgo } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
      where: {
        status: { not: "cancelled" },
        createdAt: { gte: prevMonth, lt: monthAgo },
      },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { items: true },
    }),
  ]);

  const thisMonthRevenue = thisMonth._sum.total ?? 0;
  const lastMonthRevenue = lastMonth._sum.total ?? 0;

  return {
    productCount,
    draftCount,
    outOfStockCount,
    articleCount,
    orderCount,
    openOrderCount,
    unreadMessages,
    totalRevenue: revenueAgg._sum.total ?? 0,
    thisMonthRevenue,
    thisMonthOrders: thisMonth._count,
    lastMonthRevenue,
    // اگر ماه قبل درآمدی نبوده، درصد رشد بی‌معناست و null برمی‌گردد.
    revenueChange:
      lastMonthRevenue > 0
        ? Math.round(
            ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100,
          )
        : null,
    recentOrders: recentOrders.map(toAdminOrder),
  };
}

/**
 * روزِ تقویمی یک زمان، به وقت تهران.
 *
 * toISOString() تاریخ را به UTC می‌دهد و ایران +۳:۳۰ است؛ یعنی سفارشی که
 * ساعت ۲ بامداد تهران ثبت شده، در UTC هنوز «دیروز» است. اگر کلیدهای نمودار
 * را با toISOString بسازیم، ستون‌ها یک روز جابه‌جا می‌شوند و سفارش‌های امروز
 * در هیچ ستونی نمی‌نشینند.
 */
const TEHRAN_DAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tehran",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function tehranDay(date: Date): string {
  return TEHRAN_DAY.format(date);
}

/** درآمد و تعداد سفارش هر روز در بازه اخیر — برای نمودار داشبورد. */
export async function getRevenueSeries(days = 14) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const rows = await prisma.order.findMany({
    where: { status: { not: "cancelled" }, createdAt: { gte: start } },
    select: { createdAt: true, total: true },
  });

  const buckets = new Map<string, { total: number; count: number }>();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    buckets.set(tehranDay(d), { total: 0, count: 0 });
  }

  for (const row of rows) {
    const bucket = buckets.get(tehranDay(row.createdAt));
    if (bucket) {
      bucket.total += row.total;
      bucket.count += 1;
    }
  }

  return [...buckets.entries()].map(([date, v]) => ({ date, ...v }));
}
