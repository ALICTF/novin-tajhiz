"use client";

import * as React from "react";
import { DirectionProvider } from "@radix-ui/react-direction";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { CompareProvider } from "@/context/compare-context";

/**
 * تأمین‌کننده‌های سراسری.
 *
 * DirectionProvider جهت را به همه کامپوننت‌های Radix می‌دهد.
 *
 * چرا لازم است با اینکه <html dir="rtl"> داریم؟ کامپوننت‌های Radix جهت را
 * از DOM نمی‌خوانند؛ هوک داخلی‌شان اگر این Provider نباشد به "ltr" برمی‌گردد
 * و همان را روی عنصر ریشه خودشان می‌نویسند. نتیجه‌اش این بود که کل محتوای
 * تب‌های صفحه محصول — از جمله پاراگراف‌های توضیحات — چپ‌چین می‌شد، چون
 * text-justify و text-align: start داخل یک زیردرخت ltr از چپ تراز می‌شوند.
 *
 * این یک نقطه، هر هشت کامپوننت Radix سایت را درست می‌کند: تب، آکاردئون،
 * منوی ناوبری، سلکت، دراپ‌دان، شیت، تولتیپ و رادیو.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DirectionProvider dir="rtl">
      <CartProvider>
        <WishlistProvider>
          <CompareProvider>
            {children}
            <Toaster />
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </DirectionProvider>
  );
}
