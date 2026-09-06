"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/client";
import { requireAdmin } from "@/lib/admin/guard";
import { toLatinDigits } from "@/lib/format";

/**
 * اکشن‌های نوشتن محصول.
 *
 * هر کدام مستقلاً requireAdmin() را صدا می‌زنند: Server Action ها نقطه ورود
 * جداگانه‌ای به سرورند و صرفِ محافظت شدنِ صفحه، آن‌ها را امن نمی‌کند.
 */

export type ProductFormState = { error?: string; ok?: boolean };

/** «۱۲,۵۰۰» یا «۱۲۵۰۰» → 12500 ؛ رشته خالی → null («تماس بگیرید»). */
function parsePrice(raw: FormDataEntryValue | null): number | null {
  const text = toLatinDigits(String(raw ?? "")).replace(/[,\s]/g, "").trim();
  if (!text) return null;
  const value = Number(text);
  return Number.isFinite(value) && value >= 0 ? Math.round(value) : null;
}

/** هر خط یک مقدار؛ خطوط خالی حذف می‌شوند. */
function parseLines(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseCsv(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(/[,،]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** اسلاگ فارسی‌پسند: فاصله‌ها به خط تیره، نویسه‌های خطرناک حذف. */
function slugify(input: string): string {
  return input
    .trim()
    .replace(/[/\\?#%&=+.]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

async function readForm(formData: FormData, currentId?: number) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "نام محصول را وارد کنید" } as const;

  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return { error: "دسته‌بندی معتبر نیست" } as const;

  const slug = slugify(String(formData.get("slug") ?? "") || name);
  const clash = await prisma.product.findUnique({ where: { slug } });
  if (clash && clash.id !== currentId) {
    return { error: "این نشانی (slug) قبلاً برای محصول دیگری استفاده شده است" } as const;
  }

  const price = parsePrice(formData.get("price"));
  const oldPrice = parsePrice(formData.get("oldPrice"));
  if (oldPrice !== null && price !== null && oldPrice <= price) {
    return { error: "قیمت قبلی باید از قیمت فعلی بیشتر باشد" } as const;
  }

  return {
    data: {
      name,
      slug,
      brand: String(formData.get("brand") ?? "").trim() || "نوین تجهیز",
      categoryId,
      price,
      oldPrice,
      shortDescription: String(formData.get("shortDescription") ?? "").trim(),
      description: JSON.stringify(parseLines(formData.get("description"))),
      images: JSON.stringify(parseLines(formData.get("images"))),
      tags: JSON.stringify(parseCsv(formData.get("tags"))),
      sku: String(formData.get("sku") ?? "").trim(),
      inStock: formData.get("inStock") === "on",
      isNew: formData.get("isNew") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      published: formData.get("published") === "on",
    },
  } as const;
}

export async function saveProductAction(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const rawId = formData.get("id");
  const id = rawId ? Number(rawId) : undefined;

  const parsed = await readForm(formData, id);
  if ("error" in parsed) return { error: parsed.error };

  let productId: number;

  if (id) {
    await prisma.product.update({ where: { id }, data: parsed.data });
    productId = id;
  } else {
    // sortIndex مبنای مرتب‌سازی «جدیدترین» است، پس محصول تازه باید بالاتر از
    // همه بنشیند.
    const max = await prisma.product.aggregate({ _max: { sortIndex: true } });
    const created = await prisma.product.create({
      data: {
        ...parsed.data,
        sortIndex: (max._max.sortIndex ?? 0) + 1,
        sku: parsed.data.sku || `NT-${Date.now().toString().slice(-6)}`,
      },
    });
    productId = created.id;
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  redirect(`/admin/products/${productId}?saved=1`);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  // اقلام سفارش با onDelete: SetNull به null می‌روند، پس فاکتورهای قدیمی
  // نام و قیمت کپی‌شده خودشان را نگه می‌دارند و سفارش خراب نمی‌شود.
  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  redirect("/admin/products");
}

/** روشن/خاموش کردن سریع انتشار از داخل جدول. */
export async function toggleProductPublishedAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const current = await prisma.product.findUnique({
    where: { id },
    select: { published: true },
  });
  if (!current) return;

  await prisma.product.update({
    where: { id },
    data: { published: !current.published },
  });

  revalidatePath("/admin/products");
}
