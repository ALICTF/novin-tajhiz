import "server-only";

import { prisma } from "@/lib/db/client";
import { ORDER_STATUSES, type OrderStatus, isOrderStatus } from "@/lib/db/types";

/**
 * گزارش‌های فروشگاه.
 *
 * چند تصمیم که در همه توابع این فایل رعایت شده:
 *
 *  • سفارش لغوشده هرگز در درآمد حساب نمی‌شود. اگر می‌شد، هر لغو یک درآمد
 *    ساختگی به گزارش اضافه می‌کرد.
 *  • اقلام «تماس بگیرید» قیمت ندارند و صفر در نظر گرفته می‌شوند، نه اینکه
 *    کل سفارش کنار گذاشته شود — بقیه اقلام همان سفارش درآمد واقعی‌اند.
 *  • جمع‌بندی اقلام در حافظه انجام می‌شود نه با groupBy، چون فیلتر روی
 *    وضعیت و تاریخِ *سفارش* است نه خود قلم، و برای فروشگاهی در این اندازه
 *    ارزان‌تر از کوئری خام و قابل حمل‌تر است.
 */

const NOT_CANCELLED = { status: { not: "cancelled" } } as const;

/* --------------------------- تاریخ شمسی --------------------------- */

const JALALI_PARTS = new Intl.DateTimeFormat("en-CA-u-ca-persian", {
  timeZone: "Asia/Tehran",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * اول ماه شمسی جاری.
 *
 * برای فروشنده ایرانی «این ماه» یعنی ماه شمسی، نه ۳۰ روز گذشته. روز جاری ماه
 * از تقویم شمسی خوانده و همان تعداد روز عقب می‌رویم — بدون افزودن کتابخانه
 * تاریخ به پروژه.
 */
export function jalaliMonthStart(now = new Date()): Date {
  const parts = JALALI_PARTS.formatToParts(now);
  const day = Number(parts.find((p) => p.type === "day")?.value ?? "1");

  const start = new Date(now);
  start.setDate(start.getDate() - (day - 1));
  start.setHours(0, 0, 0, 0);
  return start;
}

/** نام ماه شمسی جاری، برای عنوان کارت‌ها. */
export function jalaliMonthName(now = new Date()): string {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    timeZone: "Asia/Tehran",
    month: "long",
    year: "numeric",
  }).format(now);
}

/* ---------------------------- خلاصه کلی ---------------------------- */

export type PeriodSummary = {
  revenue: number;
  orders: number;
  averageOrder: number;
};

async function summarize(from: Date, to?: Date): Promise<PeriodSummary> {
  const agg = await prisma.order.aggregate({
    where: { ...NOT_CANCELLED, createdAt: to ? { gte: from, lt: to } : { gte: from } },
    _sum: { total: true },
    _count: true,
  });

  const revenue = agg._sum.total ?? 0;
  const orders = agg._count;

  return {
    revenue,
    orders,
    averageOrder: orders > 0 ? Math.round(revenue / orders) : 0,
  };
}

/** درصد تغییر نسبت به دوره قبل؛ اگر دوره قبل صفر بوده باشد بی‌معناست. */
function change(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

export async function getMonthOverview(now = new Date()) {
  const monthStart = jalaliMonthStart(now);

  // طول ماه قبل دقیقاً برابر همین ماه نیست، ولی برای مقایسه‌ای که ادمین
  // می‌خواهد کافی است و از پیچیده کردن تقویم بهتر است.
  const previousStart = new Date(monthStart);
  previousStart.setMonth(previousStart.getMonth() - 1);

  const [thisMonth, lastMonth] = await Promise.all([
    summarize(monthStart),
    summarize(previousStart, monthStart),
  ]);

  return {
    monthName: jalaliMonthName(now),
    thisMonth,
    lastMonth,
    revenueChange: change(thisMonth.revenue, lastMonth.revenue),
    ordersChange: change(thisMonth.orders, lastMonth.orders),
  };
}

/* -------------------------- سری زمانی درآمد -------------------------- */

const TEHRAN_DAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tehran",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function tehranDay(date: Date): string {
  return TEHRAN_DAY.format(date);
}

export async function getRevenueSeries(days: number) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const rows = await prisma.order.findMany({
    where: { ...NOT_CANCELLED, createdAt: { gte: start } },
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

/* ------------------------- توزیع وضعیت سفارش ------------------------- */

export async function getStatusBreakdown(from: Date) {
  const rows = await prisma.order.groupBy({
    by: ["status"],
    where: { createdAt: { gte: from } },
    _count: { _all: true },
    _sum: { total: true },
  });

  const map = new Map(rows.map((r) => [r.status, r]));

  return ORDER_STATUSES.map((status) => {
    const row = map.get(status);
    return {
      status: status as OrderStatus,
      count: row?._count._all ?? 0,
      total: row?._sum.total ?? 0,
    };
  });
}

/* ---------------------------- اقلام فروخته ---------------------------- */

type ItemRow = {
  productId: number | null;
  name: string;
  brand: string;
  unitPrice: number | null;
  quantity: number;
  product: { categoryId: string; category: { shortName: string } } | null;
};

async function loadSoldItems(from: Date): Promise<ItemRow[]> {
  return prisma.orderItem.findMany({
    where: { order: { ...NOT_CANCELLED, createdAt: { gte: from } } },
    select: {
      productId: true,
      name: true,
      brand: true,
      unitPrice: true,
      quantity: true,
      product: {
        select: { categoryId: true, category: { select: { shortName: true } } },
      },
    },
  });
}

export type TopProduct = {
  key: string;
  productId: number | null;
  name: string;
  brand: string;
  quantity: number;
  revenue: number;
};

export async function getTopProducts(from: Date, limit = 8): Promise<TopProduct[]> {
  const items = await loadSoldItems(from);

  const map = new Map<string, TopProduct>();
  for (const item of items) {
    // محصول حذف‌شده productId ندارد؛ نامش کلید می‌شود تا از گزارش نیفتد.
    const key = item.productId ? `p${item.productId}` : `n:${item.name}`;
    const existing = map.get(key);
    const revenue = (item.unitPrice ?? 0) * item.quantity;

    if (existing) {
      existing.quantity += item.quantity;
      existing.revenue += revenue;
    } else {
      map.set(key, {
        key,
        productId: item.productId,
        name: item.name,
        brand: item.brand,
        quantity: item.quantity,
        revenue,
      });
    }
  }

  return [...map.values()]
    .sort((a, b) => b.revenue - a.revenue || b.quantity - a.quantity)
    .slice(0, limit);
}

export type CategorySlice = { name: string; revenue: number; quantity: number };

export async function getCategoryBreakdown(from: Date): Promise<CategorySlice[]> {
  const items = await loadSoldItems(from);

  const map = new Map<string, CategorySlice>();
  for (const item of items) {
    const name = item.product?.category.shortName ?? "نامشخص";
    const entry = map.get(name) ?? { name, revenue: 0, quantity: 0 };
    entry.revenue += (item.unitPrice ?? 0) * item.quantity;
    entry.quantity += item.quantity;
    map.set(name, entry);
  }

  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

/* ------------------------------ مشتری‌ها ------------------------------ */

export async function getCustomerInsights(from: Date) {
  const orders = await prisma.order.findMany({
    where: { ...NOT_CANCELLED, createdAt: { gte: from } },
    select: { phone: true, city: true, total: true },
  });

  const byPhone = new Map<string, number>();
  const byCity = new Map<string, { orders: number; revenue: number }>();

  for (const order of orders) {
    byPhone.set(order.phone, (byPhone.get(order.phone) ?? 0) + 1);

    const city = order.city.trim() || "نامشخص";
    const entry = byCity.get(city) ?? { orders: 0, revenue: 0 };
    entry.orders += 1;
    entry.revenue += order.total;
    byCity.set(city, entry);
  }

  const repeat = [...byPhone.values()].filter((n) => n > 1).length;

  return {
    uniqueCustomers: byPhone.size,
    repeatCustomers: repeat,
    // نسبت مشتریانی که بیش از یک بار خرید کرده‌اند.
    repeatRate: byPhone.size > 0 ? Math.round((repeat / byPhone.size) * 100) : 0,
    topCities: [...byCity.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6),
  };
}

/* ------------------------------ موجودی ------------------------------ */

export async function getInventorySnapshot() {
  const [total, published, outOfStock, noPrice, reviewsPending] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { published: true } }),
    prisma.product.count({ where: { inStock: false } }),
    prisma.product.count({ where: { published: true, price: null } }),
    prisma.review.count({ where: { published: false } }),
  ]);

  return { total, published, outOfStock, noPrice, reviewsPending };
}

/** بازه‌های قابل انتخاب در صفحه گزارش‌ها. */
export const RANGES = [
  { value: "7", label: "۷ روز", days: 7 },
  { value: "30", label: "۳۰ روز", days: 30 },
  { value: "90", label: "۹۰ روز", days: 90 },
] as const;

export type RangeValue = (typeof RANGES)[number]["value"];

export function resolveRange(raw: string | undefined) {
  return RANGES.find((r) => r.value === raw) ?? RANGES[1];
}

export { isOrderStatus };
