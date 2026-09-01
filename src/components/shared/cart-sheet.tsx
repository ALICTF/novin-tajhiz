"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCart } from "@/context/cart-context";
import { formatPrice, toPersianDigits } from "@/lib/format";

export function CartSheet() {
  const { isOpen, setOpen, lines, count, subtotal, quoteOnlyCount, setQuantity, remove } =
    useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        className="flex w-[90%] flex-col gap-0 p-0 sm:w-[420px] [&>button]:left-auto [&>button]:right-4"
      >
        <SheetHeader className="border-b border-slate-100 bg-slate-50/60 p-5 text-right">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag size={20} className="text-primary" />
            سبد خرید
            {count > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                {toPersianDigits(count)}
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="text-xs">
            اقلام انتخابی شما پیش از ثبت نهایی قابل ویرایش است.
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
              <ShoppingBag size={36} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-bold text-slate-700">سبد خرید شما خالی است</p>
              <p className="mt-1 text-sm text-slate-500">
                از فروشگاه، محصول مورد نظرتان را انتخاب کنید.
              </p>
            </div>
            <Button asChild className="rounded-xl" onClick={() => setOpen(false)}>
              <Link href="/products">مشاهده محصولات</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {lines.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-3"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1 mix-blend-multiply"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => setOpen(false)}
                      className="line-clamp-2 text-sm font-bold text-slate-800 hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <span className="mt-0.5 text-[11px] text-slate-400">{product.brand}</span>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50">
                        <button
                          type="button"
                          aria-label="کاهش تعداد"
                          onClick={() => setQuantity(product.id, quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-slate-500 hover:text-primary"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">
                          {toPersianDigits(quantity)}
                        </span>
                        <button
                          type="button"
                          aria-label="افزایش تعداد"
                          onClick={() => setQuantity(product.id, quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center text-slate-500 hover:text-primary"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {product.price === null
                            ? "استعلام"
                            : formatPrice(product.price * quantity, false)}
                        </span>
                        <button
                          type="button"
                          aria-label={`حذف ${product.name}`}
                          onClick={() => remove(product.id)}
                          className="text-slate-300 transition-colors hover:text-rose-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-slate-100 bg-slate-50/60 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">جمع اقلام</span>
                <span className="text-lg font-black text-slate-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {quoteOnlyCount > 0 && (
                <p className="rounded-xl bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
                  {toPersianDigits(quoteOnlyCount)} قلم از سبد شما قیمت استعلامی دارد و در
                  جمع بالا محاسبه نشده است. کارشناسان ما قیمت آن را اعلام می‌کنند.
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-xl"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/cart">مشاهده سبد</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 rounded-xl bg-slate-900 text-white hover:bg-primary"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/checkout">تسویه‌حساب</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
