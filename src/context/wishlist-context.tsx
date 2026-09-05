"use client";

import * as React from "react";
import { toast } from "sonner";
import { toSummary, type ProductSummary } from "@/lib/data/catalog-meta";
import { useLocalStorage } from "@/hooks/use-local-storage";

/** مثل سبد خرید، خلاصه محصول ذخیره می‌شود تا کاتالوگ وارد بسته مشترک نشود. */

type WishlistContextValue = {
  ids: number[];
  items: ProductSummary[];
  count: number;
  hydrated: boolean;
  has: (productId: number) => boolean;
  toggle: (product: ProductSummary) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const WishlistContext = React.createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "novin-tajhiz:wishlist:v2";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { value: stored, setValue: setStored, hydrated } = useLocalStorage<
    ProductSummary[]
  >(STORAGE_KEY, []);

  const items = React.useMemo(
    () => stored.filter((p): p is ProductSummary => typeof p?.id === "number"),
    [stored],
  );

  const toggle = React.useCallback(
    (product: ProductSummary) => {
      const summary = toSummary(product);
      setStored((prev) => {
        if (prev.some((p) => p?.id === summary.id)) {
          toast.info("از علاقه‌مندی‌ها حذف شد", { description: summary.name });
          return prev.filter((p) => p?.id !== summary.id);
        }
        toast.success("به علاقه‌مندی‌ها اضافه شد", { description: summary.name });
        return [...prev, summary];
      });
    },
    [setStored],
  );

  const remove = React.useCallback(
    (productId: number) => setStored((prev) => prev.filter((p) => p?.id !== productId)),
    [setStored],
  );

  const clear = React.useCallback(() => setStored([]), [setStored]);

  const value = React.useMemo<WishlistContextValue>(() => {
    const ids = items.map((p) => p.id);
    return {
      ids,
      items,
      count: items.length,
      hydrated,
      has: (productId: number) => ids.includes(productId),
      toggle,
      remove,
      clear,
    };
  }, [items, hydrated, toggle, remove, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = React.useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist باید داخل WishlistProvider استفاده شود.");
  return ctx;
}
