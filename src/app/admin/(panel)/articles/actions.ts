"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/client";
import { requireAdmin } from "@/lib/admin/guard";

export type ArticleFormState = { error?: string };

export async function toggleArticlePublishedAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const current = await prisma.article.findUnique({
    where: { id },
    select: { published: true },
  });
  if (!current) return;

  await prisma.article.update({
    where: { id },
    data: { published: !current.published },
  });

  revalidatePath("/admin/articles");
}

/**
 * ذخیره مقاله.
 *
 * بدنه مقاله ساختار بلوکی دارد (پاراگراف، تیتر، لیست...) و ساختن یک ویرایشگر
 * کامل برایش کار جداگانه‌ای است. فعلاً فیلدهای متنی مقاله ویرایش می‌شوند و
 * بدنه دست‌نخورده می‌ماند — پس هیچ محتوایی از دست نمی‌رود.
 */
export async function saveArticleAction(
  _prev: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "شناسه مقاله معتبر نیست" };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "عنوان مقاله را وارد کنید" };

  await prisma.article.update({
    where: { id },
    data: {
      title,
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim(),
      author: String(formData.get("author") ?? "").trim(),
      authorRole: String(formData.get("authorRole") ?? "").trim(),
      readTime: String(formData.get("readTime") ?? "").trim(),
      image: String(formData.get("image") ?? "").trim(),
      tags: JSON.stringify(
        String(formData.get("tags") ?? "")
          .split(/[,،]/)
          .map((t) => t.trim())
          .filter(Boolean),
      ),
      isFeatured: formData.get("isFeatured") === "on",
      published: formData.get("published") === "on",
    },
  });

  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${id}?saved=1`);
}
