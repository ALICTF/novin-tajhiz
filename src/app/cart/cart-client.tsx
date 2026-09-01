"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Minus, Plus, ShieldCheck, ShoppingBag,
  Trash2, Truck, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { useCart } from "@/context/cart-context";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { SHIPPING_FLAT_RATE, FREE_SHIPPING_THRESHOLD } from "@/lib/data/checkout";
import { warrantyStatement } from "@/lib/data/site";

export function CartClient() {
  const { lines, count, subtotal, quoteOnlyCount, setQuantity, remove, clear, hydrated } =
    useCart();

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <Breadcrumbs items={[{ label: "سبد خرید" }]} className="mb-6" />

        <h1 className="mb-8 text-3xl font-black tracking-tight text-slate-900">
          سبد خرید شما
          {hydrated && count > 0 && (
            <span className="mr-3 text-base font-medium text-slate-400">
              ({toPersianDigits(count)} قلم)
            </span>
          )}
        </h1>

        {!hydrated ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-white"
                />
              ))}
            </div>
            <div className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white" />
          </div>
        ) : lines.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="سبد خرید شما خالی است"
            description="هنوز محصولی انتخاب نکرده‌اید. از فروشگاه ما دیدن کنید و تجهیزات مورد نیازتان را پیدا کنید."
          >
            <Button asChild className="rounded-xl">
              <Link href="/products">مشاهده محصولات</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/contact">مشاوره خرید</Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            {/* ------------------------- فهرست اقلام ------------------------- */}
            <div className="space-y-4 lg:col-span-2">
              {lines.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-50 sm:h-28 sm:w-28"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="112px"
                      className="object-contain p-2 mix-blend-multiply"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-bold text-slate-900 transition-colors hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span>{product.brand}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="font-mono">{product.sku}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-emerald-600">{warrantyStatement}</span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50">
                        <button
                          type="button"
                          aria-label="کاهش تعداد"
                          onClick={() => setQuantity(product.id, quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center text-slate-500 hover:text-primary"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-900">
                          {toPersianDigits(quantity)}
                        </span>
                        <button
                          type="button"
                          aria-label="افزایش تعداد"
                          onClick={() => setQuantity(product.id, quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center text-slate-500 hover:text-primary"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          {product.price === null ? (
                            <span className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                              استعلام قیمت
                            </span>
                          ) : (
                            <>
                              <div className="font-black text-slate-900">
                                {formatPrice(product.price * quantity)}
                              </div>
                              {quantity > 1 && (
                                <div className="text-[11px] text-slate-400">
                                  واحدی {formatPrice(product.price, false)}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <button
                          type="button"
                          aria-label={`حذف ${product.name}`}
                          onClick={() => remove(product.id)}
                          className="text-slate-300 transition-colors hover:text-rose-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Button asChild variant="outline" className="gap-2 rounded-xl">
                  <Link href="/products">
                    <ArrowLeft size={16} />
                    ادامه خرید
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={clear}
                  className="text-slate-400 hover:text-rose-500"
                >
                  خالی کردن سبد
                </Button>
              </div>
            </div>

            {/* -------------------------- خلاصه فاکتور -------------------------- */}
            <aside className="sticky top-32 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">خلاصه سفارش</h2>

              <div className="space-y-3 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">جمع اقلام</span>
                  <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">هزینه ارسال</span>
                  <span className="font-bold text-slate-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">رایگان</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
              </div>

              {remainingForFreeShipping > 0 && subtotal > 0 && (
                <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-[11px] leading-relaxed text-blue-800">
                  <Truck size={16} className="mt-0.5 shrink-0" />
                  <span>
                    با {formatPrice(remainingForFreeShipping)} خرید بیشتر، ارسال شما رایگان
                    می‌شود.
                  </span>
                </div>
              )}

              {quoteOnlyCount > 0 && (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
                  <Info size={16} className="mt-0.5 shrink-0" />
                  <span>
                    {toPersianDigits(quoteOnlyCount)} قلم قیمت استعلامی دارد و در جمع کل
                    محاسبه نشده است.
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="font-bold text-slate-700">مبلغ قابل پرداخت</span>
                <span className="text-xl font-black text-slate-900">{formatPrice(total)}</span>
              </div>

              <Button
                asChild
                className="h-13 h-12 w-full rounded-xl bg-slate-900 text-base font-bold text-white hover:bg-primary"
              >
                <Link href="/checkout">ادامه فرآیند خرید</Link>
              </Button>

              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500">
                <ShieldCheck size={16} className="shrink-0 text-emerald-500" />
                <span>ضمانت اصالت کالا و بازگشت تا ۷ روز</span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
