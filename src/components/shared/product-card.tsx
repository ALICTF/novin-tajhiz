"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import {
  AddToCartButton,
  CompareButton,
  WishlistButton,
} from "@/components/shared/product-actions";
import { getCategoryName, type ProductSummary } from "@/lib/data/catalog-meta";
import { discountPercent, formatPrice, toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ProductCardView = "grid" | "list";

export function ProductCard({
  product,
  view = "grid",
}: {
  product: ProductSummary;
  view?: ProductCardView;
}) {
  const href = `/products/${product.slug}`;
  const off = discountPercent(product.price, product.oldPrice);
  const isList = view === "list";

  return (
    <article
      className={cn(
        "group relative rounded-3xl border border-slate-200 bg-white transition-all duration-500 hover:border-primary/30 hover:shadow-xl",
        isList ? "flex flex-col gap-6 p-4 sm:flex-row sm:items-center" : "flex flex-col overflow-hidden",
      )}
    >
      {/* ------------------------------ تصویر ------------------------------ */}
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-white",
          isList
            ? "h-48 w-full rounded-2xl border border-slate-100 sm:w-48"
            : "aspect-square w-full border-b border-slate-100",
        )}
      >
        {/*
          پدینگ روی همین لینک اعمال می‌شود، نه روی ظرف بیرونی: عنصر absolute
          نسبت به padding box جای‌گیری می‌کند و پدینگِ والد را نادیده می‌گیرد.
          div داخلی relative است تا Image با fill دقیقاً داخل همین ناحیه بنشیند.
        */}
        <Link
          href={href}
          aria-label={product.name}
          className={cn("absolute inset-0 z-0 block", isList ? "p-4" : "p-4 sm:p-7")}
        >
          <div className="relative h-full w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes={isList ? "192px" : "(max-width: 640px) 45vw, (max-width: 1024px) 50vw, 33vw"}
              className={cn(
                "object-contain object-center transition-transform duration-700 ease-out group-hover:scale-105",
                !product.inStock && "opacity-60 grayscale",
              )}
            />
          </div>
        </Link>

        {/* نشان‌ها */}
        <div className="pointer-events-none absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
          {product.isNew && (
            <Badge className="border-none bg-blue-500 shadow-sm hover:bg-blue-600">جدید</Badge>
          )}
          {off && (
            <Badge className="border-none bg-rose-500 shadow-sm hover:bg-rose-600">
              {toPersianDigits(off)}٪ تخفیف
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="border-none bg-slate-700 text-white">
              ناموجود
            </Badge>
          )}
        </div>

        {/* اکشن‌های شناور — فقط حالت شبکه‌ای */}
        {!isList && (
          <>
            {/*
              روی موبایل هاور وجود ندارد، پس این نوار همیشه دیده می‌شود؛
              از عرض sm به بالا به حالت «ظاهر شدن با هاور» برمی‌گردد.
            */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-white via-white/85 to-transparent transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100" />

            <div className="absolute inset-x-3 bottom-3 z-20 flex gap-2 transition-all duration-300 sm:inset-x-4 sm:bottom-4 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
              <AddToCartButton
                product={product}
                disabled={!product.inStock}
                className="h-10 flex-1 rounded-xl bg-slate-900 text-xs text-white shadow-lg hover:bg-primary"
              >
                افزودن
              </AddToCartButton>
              <Button
                asChild
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-xl bg-white text-slate-700 shadow-lg"
              >
                <Link href={href} aria-label={`مشاهده ${product.name}`}>
                  <Eye size={16} />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>

      {/* ------------------------------ محتوا ------------------------------ */}
      <div
        className={cn(
          "flex flex-col",
          isList
            ? "flex-1 items-start py-2 text-right"
            : "items-center p-3.5 text-center sm:p-5",
        )}
      >
        {/* در حالت دوستونهٔ موبایل فقط برند جا می‌شود؛ نام دسته از sm به بعد می‌آید. */}
        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          <span className="truncate">{product.brand}</span>
          <span className="hidden h-1 w-1 shrink-0 rounded-full bg-slate-300 sm:block" />
          <span className="hidden normal-case sm:block">
            {getCategoryName(product.categoryId)}
          </span>
        </div>

        <h3
          className={cn(
            "font-bold text-slate-900 transition-colors group-hover:text-primary",
            isList
              ? "mb-2 text-lg sm:text-xl"
              : "mb-2 line-clamp-2 min-h-[2.5rem] text-sm sm:mb-3 sm:min-h-[3rem] sm:text-base",
          )}
        >
          <Link href={href}>{product.name}</Link>
        </h3>

        <StarRating
          value={product.rating}
          size={14}
          reviewsCount={product.reviewsCount}
          className={cn("mb-3", !isList && "justify-center")}
        />

        {isList && (
          <p className="mb-6 line-clamp-2 max-w-lg text-sm leading-relaxed text-slate-500">
            {product.shortDescription}
          </p>
        )}

        <div
          className={cn(
            "mt-auto",
            isList
              ? "flex w-full flex-wrap items-center gap-4"
              : "w-full border-t border-slate-100 pt-3 sm:pt-4",
          )}
        >
          <div className="flex flex-col items-start gap-0.5">
            {product.oldPrice && product.price && (
              <span className="text-[11px] text-slate-400 line-through decoration-rose-400 sm:text-xs">
                {formatPrice(product.oldPrice, false)}
              </span>
            )}
            <div
              className={cn(
                "rounded-lg font-bold",
                product.price === null
                  ? "bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500 sm:px-3 sm:text-xs"
                  : "text-base text-slate-900 sm:text-lg",
              )}
            >
              {formatPrice(product.price)}
            </div>
          </div>

          {isList && (
            <div className="mr-auto flex w-full items-center gap-2 sm:w-auto sm:gap-3">
              <WishlistButton product={product} />
              <CompareButton product={product} />
              <Button
                asChild
                size="icon"
                variant="outline"
                className="hidden rounded-xl sm:inline-flex"
              >
                <Link href={href} aria-label={`مشاهده ${product.name}`}>
                  <Eye size={18} />
                </Link>
              </Button>
              <AddToCartButton
                product={product}
                disabled={!product.inStock}
                className="flex-1 rounded-xl bg-slate-900 px-4 text-white hover:bg-primary sm:flex-none sm:px-6"
              >
                افزودن به سبد
              </AddToCartButton>
            </div>
          )}
        </div>

        {!isList && (
          <div className="mt-3 flex w-full items-center justify-center gap-5 border-t border-slate-50 pt-3 sm:mt-4">
            <WishlistButton product={product} size={16} />
            <CompareButton product={product} size={16} />
          </div>
        )}
      </div>
    </article>
  );
}
