import "server-only";

import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS } from "@/lib/db/public";

/**
 * باطل کردن کش سایت عمومی بعد از ویرایش در پنل.
 *
 * صفحه‌های سایت داده‌شان را از unstable_cache می‌گیرند و تا برچسبشان باطل
 * نشود، کوئری دوباره اجرا نمی‌شود. هر اکشنی که چیزی می‌نویسد باید تابع
 * متناظر را صدا بزند، وگرنه ادمین تغییر را در پنل می‌بیند ولی سایت همچنان
 * نسخه قدیمی را نشان می‌دهد.
 */

export function revalidateProducts(): void {
  revalidateTag(CACHE_TAGS.products);
  // صفحه اصلی و فهرست‌ها هم محصولات را نشان می‌دهند.
  revalidatePath("/");
  revalidatePath("/products");
}

export function revalidateArticles(): void {
  revalidateTag(CACHE_TAGS.articles);
  revalidatePath("/");
  revalidatePath("/blog");
}

export function revalidateCategories(): void {
  revalidateTag(CACHE_TAGS.categories);
  revalidatePath("/");
}

export function revalidateReviews(): void {
  revalidateTag(CACHE_TAGS.reviews);
}
