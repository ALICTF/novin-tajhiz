"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/client";
import { contactSchema } from "@/lib/validation";
import { generateReference } from "@/lib/submit";
import { checkRateLimit, LIMITS } from "@/lib/rate-limit";

/**
 * ثبت پیام فرم تماس در دیتابیس تا در پنل مدیریت دیده شود.
 * پیش از این فقط شبیه‌سازی می‌شد و پیام هیچ‌جا نمی‌رفت.
 */
export async function submitContactAction(
  values: unknown,
): Promise<{ ok: boolean; error?: string; reference: string }> {
  const gate = await checkRateLimit("message", LIMITS.message.limit, LIMITS.message.windowMs);
  if (!gate.ok) {
    return { ok: false, error: "تعداد پیام‌ها زیاد است. کمی بعد دوباره تلاش کنید.", reference: "" };
  }

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "اطلاعات فرم معتبر نیست.", reference: "" };
  }
  const v = parsed.data;

  // کد پیگیری به مشتری نشان داده می‌شود، پس در موضوع پیام هم ذخیره می‌شود تا
  // اگر بعداً تماس گرفت، بشود پیامش را پیدا کرد.
  const reference = generateReference();

  await prisma.message.create({
    data: {
      kind: "contact",
      name: v.name,
      phone: v.phone,
      email: v.email ?? "",
      subject: `${v.subject} · ${reference}`,
      body: v.message,
    },
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin");

  return { ok: true, reference };
}
