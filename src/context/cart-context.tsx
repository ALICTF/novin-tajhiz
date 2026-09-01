"use client";

import * as React from "react";
import { toast } from "sonner";
import { getProduct, type Product } from "@/lib/data/products";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type CartLine = {
  productId: number;
  quantity: number;
};

export type CartLineWithProduct = CartLine & { product: Product };

type CartContextValue = {
  lines: CartLineWithProduct[];
  /** تعداد کل اقلام (مجموع quantity ها) */
  count: number;
  /** جمع مبلغ اقلامی که قیمت مشخص دارند */
  subtotal: number;
  /** تعداد اقلامی که قیمتشان «تماس بگیرید» است */
  quoteOnlyCount: number;
  hydrated: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (productId: number, quantity?: number, options?: { silent?: boolean }) => void;
  remove: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  getQuantity: (productId: number) => number;
};

const CartContext = React.createContext<CartContextValue | null>(null);

const STORAGE_KEY = "novin-tajhiz:cart";
const MAX_QTY = 20;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { value: lines, setValue: setLines, hydrated } = useLocalStorage<CartLine[]>(
    STORAGE_KEY,
    [],
  );
  const [isOpen, setOpen] = React.useState(false);

  const add = React.useCallback(
    (productId: number, quantity = 1, options?: { silent?: boolean }) => {
      const product = getProduct(productId);
      if (!product) return;

      setLines((prev) => {
        const existing = prev.find((l) => l.productId === productId);
        if (existing) {
          return prev.map((l) =>
            l.productId === productId
              ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + quantity) }
              : l,
          );
        }
        return [...prev, { productId, quantity: Math.min(MAX_QTY, quantity) }];
      });

      if (!options?.silent) {
        toast.success("به سبد خرید اضافه شد", { description: product.name });
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

  // خطوطی که محصولشان دیگر در کاتالوگ نیست، کنار گذاشته می‌شوند.
  const linesWithProduct = React.useMemo<CartLineWithProduct[]>(
    () =>
      lines.flatMap((line) => {
        const product = getProduct(line.productId);
        return product ? [{ ...line, product }] : [];
      }),
    [lines],
  );

  const value = React.useMemo<CartContextValue>(() => {
    const count = linesWithProduct.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = linesWithProduct.reduce(
      (sum, l) => sum + (l.product.price ?? 0) * l.quantity,
      0,
    );
    const quoteOnlyCount = linesWithProduct.filter((l) => l.product.price === null).length;

    return {
      lines: linesWithProduct,
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
        linesWithProduct.find((l) => l.productId === productId)?.quantity ?? 0,
    };
  }, [linesWithProduct, hydrated, isOpen, add, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart باید داخل CartProvider استفاده شود.");
  return ctx;
}
