import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Home, Phone, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { primaryPhone } from "@/lib/data/site";
import { OrderReference } from "./order-reference";

export const metadata: Metadata = {
  title: "سفارش ثبت شد",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-32 pb-20">
      <div className="w-full max-w-2xl rounded-[2.5rem] border border-slate-200 bg-white p-8 text-center shadow-xl md:p-14">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <CheckCircle2 size={44} />
        </div>

        <h1 className="mb-3 text-3xl font-black text-slate-900">
          سفارش شما با موفقیت ثبت شد
        </h1>
        <p className="mx-auto mb-8 max-w-lg leading-relaxed text-slate-500">
          از اعتماد شما سپاسگزاریم. کارشناسان ما ظرف حداکثر چند ساعت کاری برای تأیید
          نهایی، هماهنگی پرداخت و زمان ارسال با شما تماس می‌گیرند.
        </p>

        <Suspense
          fallback={<div className="mb-8 h-20 animate-pulse rounded-2xl bg-slate-50" />}
        >
          <OrderReference />
        </Suspense>

        <div className="mb-8 grid grid-cols-1 gap-3 text-right sm:grid-cols-3">
          {[
            { step: "۱", title: "تماس تأیید", desc: "بررسی موجودی و تأیید سفارش" },
            { step: "۲", title: "پرداخت", desc: "هماهنگی روش پرداخت" },
            { step: "۳", title: "ارسال", desc: "بسته‌بندی و تحویل به شما" },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {s.step}
              </div>
              <div className="text-sm font-bold text-slate-800">{s.title}</div>
              <div className="mt-1 text-[11px] leading-relaxed text-slate-500">{s.desc}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="h-12 gap-2 rounded-xl px-6">
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
