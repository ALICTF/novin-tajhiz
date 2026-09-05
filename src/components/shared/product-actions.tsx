"use client";

import * as React from "react";
import { Heart, Repeat2, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductSummary } from "@/lib/data/catalog-meta";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useCompare } from "@/context/compare-context";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  size,
  children,
  disabled,
}: {
  product: ProductSummary;
  quantity?: number;
  className?: string;
  size?: React.ComponentProps<typeof Button>["size"];
  children?: React.ReactNode;
  disabled?: boolean;
}) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = React.useState(false);

  // پس از دو ثانیه دکمه به حالت عادی برمی‌گردد.
  React.useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(t);
  }, [justAdded]);

  return (
    <Button
      size={size}
      disabled={disabled}
      className={cn("gap-2", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(product, quantity);
        setJustAdded(true);
      }}
    >
      {justAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
      {children ?? (justAdded ? "اضافه شد" : "افزودن به سبد")}
    </Button>
  );
}

/* -------------------------------------------------------------------------- */

export function WishlistButton({
  product,
  className,
  withLabel = false,
  size = 18,
}: {
  product: ProductSummary;
  className?: string;
  withLabel?: boolean;
  size?: number;
}) {
  const { has, toggle, hydrated } = useWishlist();
  const active = hydrated && has(product.id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      title={active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
      className={cn(
        "flex cursor-pointer items-center gap-2 text-slate-400 transition-colors hover:text-rose-500",
        active && "text-rose-500",
        className,
      )}
    >
      <Heart size={size} className={cn(active && "fill-current")} />
      {withLabel && (
        <span className="text-sm">
          {active ? "در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی"}
        </span>
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */

export function CompareButton({
  product,
  className,
  withLabel = false,
  size = 18,
}: {
  product: ProductSummary;
  className?: string;
  withLabel?: boolean;
  size?: number;
}) {
  const { has, toggle, hydrated } = useCompare();
  const active = hydrated && has(product.id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "حذف از مقایسه" : "افزودن به مقایسه"}
      title={active ? "حذف از فهرست مقایسه" : "افزودن به فهرست مقایسه"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
      className={cn(
        "flex cursor-pointer items-center gap-2 text-slate-400 transition-colors hover:text-primary",
        active && "text-primary",
        className,
      )}
    >
      <Repeat2 size={size} />
      {withLabel && (
        <span className="text-sm">{active ? "در فهرست مقایسه" : "مقایسه"}</span>
      )}
    </button>
  );
}
