"use client";

import * as React from "react";
import { toast } from "sonner";
import { toSummary, type ProductSummary } from "@/lib/data/catalog-meta";
import { useLocalStorage } from "@/hooks/use-local-storage";

/** بیش از چهار ستون در جدول مقایسه روی موبایل قابل خواندن نیست. */
export const MAX_COMPARE = 4;

type CompareContextValue = {
  ids: number[];
  items: ProductSummary[];
  count: number;
  hydrated: boolean;
  has: (productId: number) => boolean;
  toggle: (product: ProductSummary) => void;
  remove: (productId: number) => void;
  clear: () => void;
  isFull: boolean;
};

const CompareContext = React.createContext<CompareContextValue | null>(null);
const STORAGE_KEY = "novin-tajhiz:compare:v2";

export function CompareProvider({ children }: { children: React.ReactNode }) {
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
          return prev.filter((p) => p?.id !== summary.id);
        }
        if (prev.length >= MAX_COMPARE) {
          toast.warning(`حداکثر ${MAX_COMPARE} محصول قابل مقایسه است`, {
            description: "ابتدا یکی از محصولات فهرست مقایسه را حذف کنید.",
          });
          return prev;
        }
        toast.success("به فهرست مقایسه اضافه شد", { description: summary.name });
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

  const value = React.useMemo<CompareContextValue>(() => {
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
      isFull: items.length >= MAX_COMPARE,
    };
  }, [items, hydrated, toggle, remove, clear]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = React.useContext(CompareContext);
  if (!ctx) throw new Error("useCompare باید داخل CompareProvider استفاده شود.");
  return ctx;
}
