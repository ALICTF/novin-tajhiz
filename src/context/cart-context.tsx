"use client";

import * as React from "react";
import { toast } from "sonner";
import { toSummary, type ProductSummary } from "@/lib/data/catalog-meta";
import { useLocalStorage } from "@/hooks/use-local-storage";

/**
 * سبد خرید، به‌جای نگه‌داشتن فقط `productId` و جست‌وجوی آن در کاتالوگ، خودِ
 * خلاصه محصول را ذخیره می‌کند. دلیلش عملکرد است: این کانتکست در layout ریشه
 * قرار دارد، پس هر ماژولی که import کند روی همه صفحه‌ها بارگذاری می‌شود؛ با
 * جست‌وجو در کاتالوگ، آرایه ۹۵ محصولی هم به همه صفحه‌ها می‌رفت.
 */

export type CartLine = {
  productId: number;
  quantity: number;
  product: ProductSummary;
};

/** برای سازگاری با کدی که قبلاً این نام را import می‌کرد. */
export type CartLineWithProduct = CartLine;

type CartContextValue = {
  lines: CartLine[];
  /** تعداد کل اقلام (مجموع quantity ها) */
  count: number;
  /** جمع مبلغ اقلامی که قیمت مشخص دارند */
  subtotal: number;
  /** تعداد اقلامی که قیمتشان «تماس بگیرید» است */
  quoteOnlyCount: number;
  hydrated: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (
    product: ProductSummary,
    quantity?: number,
    options?: { silent?: boolean },
  ) => void;
  remove: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  getQuantity: (productId: number) => number;
};

const CartContext = React.createContext<CartContextValue | null>(null);

/* شکل ذخیره‌شده عوض شده است؛ کلید هم نسخه گرفت تا داده قدیمی نیمه‌خوانده نشود. */
const STORAGE_KEY = "novin-tajhiz:cart:v2";
const MAX_QTY = 20;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { value: lines, setValue: setLines, hydrated } = useLocalStorage<CartLine[]>(
    STORAGE_KEY,
    [],
  );
  const [isOpen, setOpen] = React.useState(false);

  const add = React.useCallback(
    (product: ProductSummary, quantity = 1, options?: { silent?: boolean }) => {
      const summary = toSummary(product);

      setLines((prev) => {
        const existing = prev.find((l) => l.productId === summary.id);
        if (existing) {
          return prev.map((l) =>
            l.productId === summary.id
              ? {
                  ...l,
                  quantity: Math.min(MAX_QTY, l.quantity + quantity),
                  // قیمت و موجودی ممکن است از آخرین بازدید تغییر کرده باشد.
                  product: summary,
                }
              : l,
          );
        }
        return [
          ...prev,
          { productId: summary.id, quantity: Math.min(MAX_QTY, quantity), product: summary },
        ];
      });

      if (!options?.silent) {
        toast.success("به سبد خرید اضافه شد", { description: summary.name });
      }
    },
    [setLines],
  );

  const remove = React.useCallback(
    (productId: number) => {
      setLines((prev) => prev.filter((l) => l.productId !== productId));
      toast.info("محصول از سبد خرید حذف شد");
    },
    [setLines],
  );

  const setQuantity = React.useCallback(
    (productId: number, quantity: number) => {
      const next = Math.max(0, Math.min(MAX_QTY, quantity));
      setLines((prev) =>
        next === 0
          ? prev.filter((l) => l.productId !== productId)
          : prev.map((l) => (l.productId === productId ? { ...l, quantity: next } : l)),
      );
    },
    [setLines],
  );

  const clear = React.useCallback(() => setLines([]), [setLines]);

  // خطوطی که ساختارشان ناقص است (داده قدیمی یا دستکاری‌شده) کنار گذاشته می‌شوند.
  const validLines = React.useMemo(
    () => lines.filter((l): l is CartLine => !!l?.product && typeof l.product.id === "number"),
    [lines],
  );

  const value = React.useMemo<CartContextValue>(() => {
    const count = validLines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = validLines.reduce(
      (sum, l) => sum + (l.product.price ?? 0) * l.quantity,
      0,
    );
    const quoteOnlyCount = validLines.filter((l) => l.product.price === null).length;

    return {
      lines: validLines,
      count,
      subtotal,
      quoteOnlyCount,
      hydrated,
      isOpen,
      setOpen,
      add,
      remove,
      setQuantity,
      clear,
      getQuantity: (productId: number) =>
        validLines.find((l) => l.productId === productId)?.quantity ?? 0,
    };
  }, [validLines, hydrated, isOpen, add, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart باید داخل CartProvider استفاده شود.");
  return ctx;
}
