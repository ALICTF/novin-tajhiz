"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/shared/product-card";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { toPersianDigits } from "@/lib/format";

export function WishlistClient() {
  const { items, hydrated, clear } = useWishlist();
  const { add } = useCart();

  const addAllInStock = () => {
    items.filter((p) => p.inStock).forEach((p) => add(p.id, 1, { silent: true }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <Breadcrumbs items={[{ label: "علاقه‌مندی‌ها" }]} className="mb-6" />

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-900">
              علاقه‌مندی‌های من
            </h1>
            <p className="text-sm text-slate-500">
              {hydrated && items.length > 0
                ? `${toPersianDigits(items.length)} محصول ذخیره شده است.`
                : "محصولاتی که برای بررسی بعدی ذخیره کرده‌اید."}
            </p>
          </div>

          {hydrated && items.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <Button onClick={addAllInStock} className="gap-2 rounded-xl">
                <ShoppingCart size={16} />
                افزودن همه به سبد
              </Button>
              <Button
                variant="ghost"
                onClick={clear}
                className="text-slate-400 hover:text-rose-500"
              >
                پاک کردن فهرست
              </Button>
            </div>
          )}
        </div>

        {!hydrated ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="هنوز محصولی ذخیره نکرده‌اید"
            description="با کلیک روی آیکون قلب در کارت هر محصول، می‌توانید آن را برای بررسی بعدی اینجا ذخیره کنید."
          >
            <Button asChild className="rounded-xl">
              <Link href="/products">مشاهده محصولات</Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
