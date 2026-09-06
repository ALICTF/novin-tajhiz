import type { ProductSummary, SortOption } from "@/lib/data/catalog-meta";

/**
 * منطق فیلتر، مرتب‌سازی و جستجوی کاتالوگ.
 *
 * این توابع عمداً هیچ داده‌ای import نمی‌کنند و فهرست را به‌عنوان ورودی
 * می‌گیرند. دو فایده دارد: سمت سرور روی نتیجه کوئری دیتابیس اجرا می‌شوند، و
 * کامپوننت‌های کلاینت می‌توانند بدون کشیدن کل کاتالوگ به باندل مرورگر از
 * همان‌ها استفاده کنند.
 *
 * منطق دقیقاً همان چیزی است که قبلاً در products.ts بود، تا رفتار فیلترها
 * ذره‌ای تغییر نکند.
 */

export type ProductFilters = {
  query?: string;
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: SortOption;
};

export function filterProducts<T extends ProductSummary>(
  products: T[],
  filters: ProductFilters,
): T[] {
  const {
    query,
    categories: cats,
    brands: brs,
    minPrice,
    maxPrice,
    inStockOnly,
    sort = "newest",
  } = filters;

  let result = products;

  if (query) {
    const q = query.trim().toLowerCase();
    result = result.filter((p) =>
      [p.name, p.brand, p.shortDescription, ...p.tags]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }

  if (cats?.length) result = result.filter((p) => cats.includes(p.categoryId));
  if (brs?.length) result = result.filter((p) => brs.includes(p.brand));
  if (inStockOnly) result = result.filter((p) => p.inStock);

  if (minPrice != null || maxPrice != null) {
    result = result.filter((p) => {
      // محصولات «تماس بگیرید» از فیلتر قیمت مستثنا هستند.
      if (p.price === null) return true;
      if (minPrice != null && p.price < minPrice) return false;
      if (maxPrice != null && p.price > maxPrice) return false;
      return true;
    });
  }

  return [...result].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return a.price - b.price;
      case "price-desc":
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name, "fa");
      case "available":
        return Number(b.inStock) - Number(a.inStock) || b.sortIndex - a.sortIndex;
      case "newest":
      default:
        return b.sortIndex - a.sortIndex;
    }
  });
}

export function getFeaturedProducts<T extends ProductSummary>(
  products: T[],
  limit = 8,
): T[] {
  const featured = products.filter((p) => p.isFeatured && p.inStock);
  return (featured.length >= limit ? featured : products.filter((p) => p.inStock)).slice(
    0,
    limit,
  );
}

export function getNewProducts<T extends ProductSummary>(
  products: T[],
  limit = 4,
): T[] {
  return [...products].sort((a, b) => b.sortIndex - a.sortIndex).slice(0, limit);
}

/** محصولات مرتبط: هم‌دسته، و در صورت کمبود، هم‌برند. */
export function getRelatedProducts<T extends ProductSummary>(
  products: T[],
  product: ProductSummary,
  limit = 4,
): T[] {
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.categoryId === product.categoryId,
  );
  const sameBrand = products.filter(
    (p) =>
      p.id !== product.id &&
      p.brand === product.brand &&
      p.categoryId !== product.categoryId,
  );
  return [...sameCategory, ...sameBrand].slice(0, limit);
}
