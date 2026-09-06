import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { getProductById, listBrands, listCategories } from "@/lib/db/queries";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);

  const product = await getProductById(Number(id));
  if (!product) notFound();

  const [categories, brands] = await Promise.all([listCategories(), listBrands()]);

  return (
    <>
      <Link
        href="/admin/products"
        className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowRight size={15} />
        بازگشت به محصولات
      </Link>

      {saved && (
        <p className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 ring-inset">
          <CheckCircle2 size={15} />
          تغییرات ذخیره شد
        </p>
      )}

      <PageHeader
        title={product.name}
        description={`کد ${product.sku}`}
        action={
          product.published ? (
            <a
              href={`/products/${product.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 ring-inset transition-colors hover:bg-slate-100"
            >
              <ExternalLink size={15} />
              مشاهده در سایت
            </a>
          ) : null
        }
      />

      <ProductForm product={product} categories={categories} brands={brands} />
    </>
  );
}
