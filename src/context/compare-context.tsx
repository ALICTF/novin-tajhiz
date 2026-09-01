"use client";

import * as React from "react";
import { toast } from "sonner";
import { getProduct, type Product } from "@/lib/data/products";
import { useLocalStorage } from "@/hooks/use-local-storage";

/** بیش از چهار ستون در جدول مقایسه روی موبایل قابل خواندن نیست. */
export const MAX_COMPARE = 4;

type CompareContextValue = {
  ids: number[];
  items: Product[];
  count: number;
  hydrated: boolean;
  has: (productId: number) => boolean;
  toggle: (productId: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  isFull: boolean;
};

const CompareContext = React.createContext<CompareContextValue | null>(null);
const STORAGE_KEY = "novin-tajhiz:compare";

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const { value: ids, setValue: setIds, hydrated } = useLocalStorage<number[]>(
    STORAGE_KEY,
    [],
  );

  const toggle = React.useCallback(
    (productId: number) => {
      const product = getProduct(productId);
      setIds((prev) => {
        if (prev.includes(productId)) {
          return prev.filter((id) => id !== productId);
        }
        if (prev.length >= MAX_COMPARE) {
          toast.warning(`حداکثر ${MAX_COMPARE} محصول قابل مقایسه است`, {
            description: "ابتدا یکی از محصولات فهرست مقایسه را حذف کنید.",
          });
          return prev;
        }
        toast.success("به فهرست مقایسه اضافه شد", { description: product?.name });
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

  const value = React.useMemo<CompareContextValue>(() => {
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
      isFull: items.length >= MAX_COMPARE,
    };
  }, [ids, hydrated, toggle, remove, clear]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = React.useContext(CompareContext);
  if (!ctx) throw new Error("useCompare باید داخل CompareProvider استفاده شود.");
  return ctx;
}
