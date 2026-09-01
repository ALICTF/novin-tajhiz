export type Review = {
  id: number;
  productId: number;
  user: string;
  date: string;
  rating: number;
  text: string;
  helpful: number;
  verified: boolean;
};

/**
 * دیدگاه‌های ثبت‌شده محصولات.
 *
 * فعلاً خالی است: در سایت مرجع هیچ دیدگاه منتشرشده‌ای وجود ندارد و درج نظر
 * ساختگی برای تجهیزات پزشکی درست نیست. فرم ثبت دیدگاه در صفحه محصول فعال است
 * و به‌محض راه‌اندازی بک‌اند، نظرات واقعی از همان‌جا وارد این فهرست می‌شوند.
 */
export const reviews: Review[] = [];

export function getProductReviews(productId: number): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

/** توزیع امتیازها برای نمودار میله‌ای صفحه محصول. */
export function getRatingBreakdown(productId: number): Record<number, number> {
  const list = getProductReviews(productId);
  const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  list.forEach((r) => {
    breakdown[r.rating] = (breakdown[r.rating] ?? 0) + 1;
  });
  return breakdown;
}
