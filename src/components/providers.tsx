"use client";

import * as React from "react";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { CompareProvider } from "@/context/compare-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <CompareProvider>
          {children}
          <Toaster />
        </CompareProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
