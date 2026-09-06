"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/client";
import { requireAdmin } from "@/lib/admin/guard";
import { revalidateProducts, revalidateReviews } from "@/lib/db/tags";

/**
 * اکشن‌های مدیریت دیدگاه.
 *
 * هر تغییری در وضعیت انتشار یک نظر، امتیاز و تعداد نظرات خودِ محصول را هم
 * عوض می‌کند — چون کارت محصول و صفحه محصول همان دو عدد را نشان می‌دهند.
 * پس بعد از هر عملیات، مقدارها از روی نظرهای منتشرشده دوباره حساب می‌شوند.
 */

/**
 * بازمحاسبه امتیاز و تعداد نظرات یک محصول.
 *
 * عمداً از روی خودِ رکوردها حساب می‌شود، نه با کم و زیاد کردن شمارنده: اگر
 * جایی یک به‌روزرسانی از دست برود، شمارنده تدریجی برای همیشه غلط می‌ماند،
 * ولی این روش هر بار مقدار درست را می‌سازد.
 */
async function syncProductRating(productId: number): Promise<void> {
  const agg = await prisma.review.aggregate({
    where: { productId, published: true },
    _avg: { rating: true },
    _count: { _all: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      // یک رقم اعشار کافی است؛ ستاره‌ها با همین دقت نمایش داده می‌شوند.
      rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      reviewsCount: agg._count._all,
    },
  });
}

function refreshViews(): void {
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
  revalidateReviews();
  // امتیاز محصول عوض شده، پس کارت‌ها و صفحه محصول هم باید تازه شوند.
  revalidateProducts();
}

export async function toggleReviewPublishedAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const current = await prisma.review.findUnique({
    where: { id },
    select: { published: true, productId: true },
  });
  if (!current) return;

  await prisma.review.update({
    where: { id },
    data: { published: !current.published },
  });

  await syncProductRating(current.productId);
  refreshViews();
}

/** نشان «خریدار تأییدشده» کنار نظر. */
export async function toggleReviewVerifiedAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const current = await prisma.review.findUnique({
    where: { id },
    select: { verified: true },
  });
  if (!current) return;

  await prisma.review.update({
    where: { id },
    data: { verified: !current.verified },
  });

  refreshViews();
}

export async function deleteReviewAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const review = await prisma.review.findUnique({
    where: { id },
    select: { productId: true },
  });
  if (!review) return;

  await prisma.review.delete({ where: { id } });

  await syncProductRating(review.productId);
  refreshViews();
}
