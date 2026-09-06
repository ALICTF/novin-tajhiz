"use server";

import { prisma } from "@/lib/db/client";
import { reviewSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

/**
 * ثبت دیدگاه کاربر.
 *
 * نظر با published: false ذخیره می‌شود. برای تجهیزات پزشکی، نمایش خودکار
 * نظر بدون بازبینی ریسک دارد؛ ادمین باید از پنل تأییدش کند.
 */
export async function submitReviewAction(
  productId: number,
  values: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = reviewSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "اطلاعات فرم معتبر نیست." };

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) return { ok: false, error: "محصول پیدا نشد." };

  await prisma.review.create({
    data: {
      productId: product.id,
      user: parsed.data.name,
      rating: parsed.data.rating,
      text: parsed.data.text,
      published: false,
    },
  });

  revalidatePath("/admin");
  return { ok: true };
}
