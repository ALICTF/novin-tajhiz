"use server";

import { prisma } from "@/lib/db/client";
import { revalidatePath } from "next/cache";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** عضویت در خبرنامه — به‌عنوان یک پیام از نوع newsletter ذخیره می‌شود. */
export async function subscribeNewsletterAction(
  email: string,
): Promise<{ ok: boolean; error?: string }> {
  const value = email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(value)) {
    return { ok: false, error: "ایمیل معتبر نیست" };
  }

  // ثبت دوباره همان ایمیل نباید خطا بدهد؛ فقط تکراری ساخته نمی‌شود.
  const existing = await prisma.message.findFirst({
    where: { kind: "newsletter", email: value },
    select: { id: true },
  });

  if (!existing) {
    await prisma.message.create({
      data: { kind: "newsletter", email: value, subject: "عضویت در خبرنامه" },
    });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
  }

  return { ok: true };
}
