"use client";

import * as React from "react";
import Link from "next/link";
import { Minus, Phone, Plus, RotateCcw, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistButton, CompareButton } from "@/components/shared/product-actions";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/data/catalog-meta";
import { discountPercent, formatPrice, toPersianDigits } from "@/lib/format";
import { primaryPhone, warrantyStatement } from "@/lib/data/site";

export function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = React.useState(1);
  const { add, setOpen } = useCart();
  const off = discountPercent(product.price, product.oldPrice);

  const handleAdd = () => {
    add(product, quantity);
    setOpen(true);
  };

  return (
    <div className="relative space-y-6 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-blue-400 to-primary" />

      {/* قیمت */}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          {product.oldPrice && product.price && (
            <span className="text-sm text-slate-400 line-through decoration-rose-500">
              {formatPrice(product.oldPrice, false)}
            </span>
          )}
          {product.price === null ? (
            <div className="text-2xl font-black text-slate-700">تماس بگیرید</div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-3xl font-black text-slate-900">
                {formatPrice(product.price, false)}
              </span>
              <span className="mb-1 text-sm text-slate-500">تومان</span>
            </div>
          )}
        </div>

        {off && (
          <div className="rounded-xl bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-600">
            {toPersianDigits(off)}٪ تخفیف
          </div>
        )}
      </div>

      {/* افزودن به سبد یا استعلام */}
      {product.price === null ? (
        <div className="space-y-3">
          <p className="rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
            قیمت این محصول به نرخ روز ارز و موجودی وابسته است. برای استعلام قیمت با
            کارشناسان ما تماس بگیرید.
          </p>
          <Button
            asChild
            className="h-12 w-full gap-2 rounded-xl bg-slate-900 text-lg font-bold text-white hover:bg-primary"
          >
            <a href={`tel:${primaryPhone.tel}`}>
              <Phone size={20} />
              <span className="dir-ltr tabular-nums tracking-wide">{primaryPhone.number}</span>
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={handleAdd}
            className="h-11 w-full gap-2 rounded-xl"
          >
            <ShoppingCart size={18} />
            افزودن به سبد جهت استعلام
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-2">
            <button
              type="button"
              aria-label="کاهش تعداد"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-full w-8 items-center justify-center text-slate-500 transition-colors hover:text-primary"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-bold text-slate-900">
              {toPersianDigits(quantity)}
            </span>
            <button
              type="button"
              aria-label="افزایش تعداد"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              className="flex h-full w-8 items-center justify-center text-slate-500 transition-colors hover:text-primary"
            >
              <Plus size={16} />
            </button>
          </div>

          <Button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="h-12 flex-1 gap-2 rounded-xl bg-slate-900 text-lg font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-primary"
          >
            <ShoppingCart size={20} />
            {product.inStock ? "افزودن به سبد خرید" : "ناموجود"}
          </Button>
        </div>
      )}

      {/* نشان‌های اعتماد */}
      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <Truck size={20} className="text-slate-400" />
          <span className="text-[10px] text-slate-500">ارسال رایگان در مشهد</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-r border-slate-100 text-center">
          <ShieldCheck size={20} className="text-slate-400" />
          <span className="text-[10px] text-slate-500">{warrantyStatement}</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-r border-slate-100 text-center">
          <RotateCcw size={20} className="text-slate-400" />
          <span className="text-[10px] text-slate-500">۷ روز ضمانت بازگشت</span>
        </div>
      </div>

      {/* اکشن‌های ثانویه */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
        <WishlistButton product={product} withLabel />
        <CompareButton product={product} withLabel />
        <Link
          href="/cart"
          className="text-sm font-bold text-primary transition-colors hover:text-primary/80"
        >
          مشاهده سبد
        </Link>
      </div>
    </div>
  );
}
