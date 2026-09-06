import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Home, PackageSearch, Phone, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { primaryPhone } from "@/lib/data/site";
import { OrderReference } from "./order-reference";
import { OrderStatus } from "./order-status";

export const metadata: Metadata = {
  title: "نتیجه ثبت سفارش",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-32 pb-20">
      <div className="w-full max-w-2xl rounded-[2.5rem] border border-slate-200 bg-white p-8 text-center shadow-xl md:p-14">
        <Suspense
          fallback={<div className="mb-8 h-64 animate-pulse rounded-2xl bg-slate-50" />}
        >
          <OrderStatus />
        </Suspense>

        <Suspense
          fallback={<div className="mb-8 h-20 animate-pulse rounded-2xl bg-slate-50" />}
        >
          <OrderReference />
        </Suspense>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="h-12 gap-2 rounded-xl px-6">
            <Link href="/track">
              <PackageSearch size={18} />
              پیگیری سفارش
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-12 gap-2 rounded-xl px-6">
            <Link href="/products">
              <Home size={18} />
              ادامه خرید
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-12 gap-2 rounded-xl px-6">
            <a href={`tel:${primaryPhone.tel}`}>
              <Phone size={18} />
              <span className="dir-ltr tabular-nums tracking-wide">{primaryPhone.number}</span>
            </a>
          </Button>
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Printer size={14} />
          این صفحه را برای پیگیری سفارش خود ذخیره یا چاپ کنید.
        </p>
      </div>
    </div>
  );
}
