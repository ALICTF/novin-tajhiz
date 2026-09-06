"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Repeat2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { StarRating } from "@/components/shared/star-rating";
import { AddToCartButton } from "@/components/shared/product-actions";
import { useCompare } from "@/context/compare-context";
import { getCategoryName } from "@/lib/data/catalog-meta";
import { warrantyStatement } from "@/lib/data/site";
import { formatPrice } from "@/lib/format";

export function CompareClient() {
  const { items, hydrated, remove, clear } = useCompare();


  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-32">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <Breadcrumbs items={[{ label: "مقایسه محصولات" }]} className="mb-6" />

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-900">
              مقایسه محصولات
            </h1>
            <p className="text-sm text-slate-500">
              مشخصات فنی محصولات انتخابی را کنار هم ببینید و آگاهانه تصمیم بگیرید.
            </p>
          </div>

          {hydrated && items.length > 0 && (
            <Button
              variant="ghost"
              onClick={clear}
              className="text-slate-400 hover:text-rose-500"
            >
              پاک کردن فهرست
            </Button>
          )}
        </div>

        {!hydrated ? (
          <div className="h-96 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Repeat2}
            title="فهرست مقایسه خالی است"
            description="از صفحه فروشگاه یا کارت محصولات، حداقل دو محصول را برای مقایسه انتخاب کنید."
          >
            <Button asChild className="rounded-xl">
              <Link href="/products">مشاهده محصولات</Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <caption className="sr-only">جدول مقایسه مشخصات فنی محصولات</caption>

              {/* سربرگ: کارت محصولات */}
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky right-0 z-10 w-40 border-l border-slate-100 bg-slate-50 p-4 text-right align-bottom text-xs font-bold text-slate-400"
                  >
                    مشخصات
                  </th>
                  {items.map((product) => (
                    <th key={product.id} scope="col" className="min-w-[220px] p-4 align-top">
                      <div className="relative flex flex-col items-center gap-3 text-center">
                        <button
                          type="button"
                          aria-label={`حذف ${product.name} از مقایسه`}
                          onClick={() => remove(product.id)}
                          className="absolute top-0 left-0 text-slate-300 transition-colors hover:text-rose-500"
                        >
                          <X size={16} />
                        </button>

                        <Link
                          href={`/products/${product.slug}`}
                          className="relative h-28 w-28 overflow-hidden rounded-2xl bg-slate-50"
                        >
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="112px"
                            className="object-contain p-2 mix-blend-multiply"
                          />
                        </Link>

                        <Link
                          href={`/products/${product.slug}`}
                          className="line-clamp-2 text-sm font-bold text-slate-900 hover:text-primary"
                        >
                          {product.name}
                        </Link>

                        <AddToCartButton
                          product={product}
                          disabled={!product.inStock}
                          size="sm"
                          className="w-full rounded-xl bg-slate-900 text-white hover:bg-primary"
                        />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <CompareRow label="برند">
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-center font-bold text-slate-800">
                      {p.brand}
                    </td>
                  ))}
                </CompareRow>

                <CompareRow label="دسته‌بندی">
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-center text-slate-600">
                      {getCategoryName(p.categoryId)}
                    </td>
                  ))}
                </CompareRow>

                <CompareRow label="قیمت">
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-center">
                      <span className="font-black text-slate-900">
                        {formatPrice(p.price)}
                      </span>
                    </td>
                  ))}
                </CompareRow>

                <CompareRow label="امتیاز کاربران">
                  {items.map((p) => (
                    <td key={p.id} className="p-4">
                      <StarRating
                        value={p.rating}
                        size={14}
                        showValue
                        className="justify-center"
                      />
                    </td>
                  ))}
                </CompareRow>

                <CompareRow label="موجودی">
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-center">
                      {p.inStock ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                          <Check size={13} /> موجود
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600">
                          <X size={13} /> ناموجود
                        </span>
                      )}
                    </td>
                  ))}
                </CompareRow>

                <CompareRow label="کد کالا">
                  {items.map((p) => (
                    <td key={p.id} className="dir-ltr p-4 text-center font-mono text-xs text-slate-500">
                      {p.sku}
                    </td>
                  ))}
                </CompareRow>

                <CompareRow label="معرفی کوتاه">
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-center text-xs leading-relaxed text-slate-600">
                      {p.shortDescription}
                    </td>
                  ))}
                </CompareRow>

                <CompareRow label="برچسب‌ها">
                  {items.map((p) => (
                    <td key={p.id} className="p-4">
                      {p.tags.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-1">
                          {p.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <Minus size={14} className="mx-auto text-slate-300" />
                      )}
                    </td>
                  ))}
                </CompareRow>

                <CompareRow label="ضمانت">
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-center text-slate-600">
                      {warrantyStatement}
                    </td>
                  ))}
                </CompareRow>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CompareRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr className="border-t border-slate-100 transition-colors even:bg-slate-50/40 hover:bg-slate-50">
      <th
        scope="row"
        className="sticky right-0 z-10 border-l border-slate-100 bg-inherit p-4 text-right text-xs font-medium text-slate-500"
      >
        {label}
      </th>
      {children}
    </tr>
  );
}
