import type { IconName } from "@/lib/icon-map";

/* -------------------------------------------------------------------------- */
/*  فراداده کاتالوگ — بدون خودِ آرایه محصولات.                                  */
/*                                                                            */
/*  این فایل عمداً از `products.ts` جدا شده است. هدر، کارت محصول و کانتکست‌های  */
/*  سبد/علاقه‌مندی/مقایسه کامپوننت کلاینت‌اند و در layout ریشه قرار دارند؛ اگر  */
/*  آن‌ها مستقیم از `products.ts` چیزی import کنند، کل کاتالوگ ۹۵ محصولی وارد   */
/*  بسته جاوااسکریپت *همه* صفحه‌ها می‌شود — حتی «درباره ما» و «قوانین».         */
/*  هر چیزی که سمت کلاینت لازم است و به آرایه محصولات وابسته نیست، اینجاست.     */
/* -------------------------------------------------------------------------- */

export type CategoryId =
  | "polysomnography"
  | "consumables"
  | "eeg"
  | "pap"
  | "health-care";

export type Category = {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  icon: IconName;
};

/**
 * هر چیزی از یک محصول که برای *نمایش* لازم است: کارت، سبد خرید، مقایسه،
 * علاقه‌مندی. متن بلند توضیحات اینجا نیست، چون فقط صفحه محصول به آن نیاز دارد.
 */
export type ProductSummary = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  categoryId: CategoryId;
  /** `null` یعنی «تماس بگیرید». */
  price: number | null;
  oldPrice?: number;
  /** مسیرهای محلی زیر public — هیچ تصویری از دامنه بیرونی بارگذاری نمی‌شود. */
  images: string[];
  shortDescription: string;
  tags: string[];
  rating: number;
  reviewsCount: number;
  sku: string;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  /** ترتیب نمایش در سایت مرجع؛ مبنای مرتب‌سازی «جدیدترین». */
  sortIndex: number;
};

/** محصول کامل — همان خلاصه، به‌علاوه پاراگراف‌های توضیح صفحه محصول. */
export type Product = ProductSummary & {
  description: string[];
};

/** پاراگراف‌های توضیح را کنار می‌گذارد؛ برای ذخیره در localStorage. */
export function toSummary(product: ProductSummary): ProductSummary {
  const {
    id, slug, name, brand, categoryId, price, oldPrice, images,
    shortDescription, tags, rating, reviewsCount, sku, inStock,
    isNew, isFeatured, sortIndex,
  } = product;
  return {
    id, slug, name, brand, categoryId, price, oldPrice, images,
    shortDescription, tags, rating, reviewsCount, sku, inStock,
    isNew, isFeatured, sortIndex,
  };
}

export const categories: Category[] = [
  {
    id: "polysomnography",
    name: "محصولات پلی‌سومنوگرافی",
    shortName: "پلی‌سومنوگرافی",
    description: "سنسورها، پراب‌ها و قطعات یدکی دستگاه‌های تست خواب برندهای فیلیپس آلیس، ونتمد و رزمد.",
    icon: "waves",
  },
  {
    id: "consumables",
    name: "محصولات مصرفی کلینیک‌های خواب",
    shortName: "مصرفی کلینیک خواب",
    description: "اقلام مصرفی روزانه آزمایشگاه خواب: الکترود، کانولا، ژل، چست‌لید و لوازم یک‌بار مصرف.",
    icon: "clipboardCheck",
  },
  {
    id: "eeg",
    name: "اکسسوری نوار مغز و نوروفیدبک",
    shortName: "نوار مغز و نوروفیدبک",
    description: "الکترود، کلاه، ژل و اکسسوری ثبت EEG و تجهیزات نوروفیدبک با کیفیت آزمایشگاهی.",
    icon: "brain",
  },
  {
    id: "pap",
    name: "محصولات دستگاه‌های تنفسی",
    shortName: "دستگاه‌های تنفسی",
    description: "قطعات یدکی و مصرفی دستگاه‌های CPAP و BiPAP: موتور، برد، مخزن آب، فیلتر و لوله خرطومی.",
    icon: "wind",
  },
  {
    id: "health-care",
    name: "مراقبت سلامت",
    shortName: "مراقبت سلامت",
    description: "اقلام مراقبت سلامت و پایش بیمار برای استفاده خانگی و درمانگاهی.",
    icon: "heartPulse",
  },
];

export const brands = [
  "Dormo",
  "Dräger",
  "Grass",
  "Löwenstein",
  "Nonin",
  "Philips",
  "Protec",
  "ResMed",
  "Skintact",
  "Ventmed",
  "Weaver",
  "نوین تجهیز",
] as const;

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryName(id: string): string {
  return getCategory(id)?.shortName ?? id;
}

export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name"
  | "available";

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "جدیدترین" },
  { value: "available", label: "موجودها" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "name", label: "بر اساس نام" },
];
