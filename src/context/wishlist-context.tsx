"use client";

import * as React from "react";
import { toast } from "sonner";
import { getProduct, type Product } from "@/lib/data/products";
import { useLocalStorage } from "@/hooks/use-local-storage";

type WishlistContextValue = {
  ids: number[];
  items: Product[];
  count: number;
  hydrated: boolean;
  has: (productId: number) => boolean;
  toggle: (productId: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const WishlistContext = React.createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "novin-tajhiz:wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { value: ids, setValue: setIds, hydrated } = useLocalStorage<number[]>(
    STORAGE_KEY,
    [],
  );

  const toggle = React.useCallback(
    (productId: number) => {
      const product = getProduct(productId);
      setIds((prev) => {
        if (prev.includes(productId)) {
          toast.info("از علاقه‌مندی‌ها حذف شد", { description: product?.name });
          return prev.filter((id) => id !== productId);
        }
        toast.success("به علاقه‌مندی‌ها اضافه شد", { description: product?.name });
        return [...prev, productId];
      });
    },
    [setIds],
  );

  const remove = React.useCallback(
    (productId: number) => setIds((prev) => prev.filter((id) => id !== productId)),
    [setIds],
  );

  const clear = React.useCallback(() => setIds([]), [setIds]);

  const value = React.useMemo<WishlistContextValue>(() => {
    const items = ids.flatMap((id) => {
      const p = getProduct(id);
      return p ? [p] : [];
    });
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
  }, [ids, hydrated, toggle, remove, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = React.useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist باید داخل WishlistProvider استفاده شود.");
  return ctx;
}
