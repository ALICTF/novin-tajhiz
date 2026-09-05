"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";

/**
 * پیام صفحه پس از ثبت سفارش.
 * پارامتر `transfer=1` یعنی مشتری کارت‌به‌کارت را انتخاب کرده و سفارش تا
 * تأیید واریزی «در انتظار» است — نه «تکمیل‌شده».
 */
export function OrderStatus() {
  const isTransfer = useSearchParams().get("transfer") === "1";

  const steps = isTransfer
    ? [
        { step: "۱", title: "بررسی فیش", desc: "تأیید واریزی توسط حسابداری" },
        { step: "۲", title: "تماس تأیید", desc: "هماهنگی نهایی سفارش" },
        { step: "۳", title: "ارسال", desc: "بسته‌بندی و تحویل به شما" },
      ]
    : [
        { step: "۱", title: "تماس تأیید", desc: "بررسی موجودی و تأیید سفارش" },
        { step: "۲", title: "پرداخت", desc: "هماهنگی روش پرداخت" },
        { step: "۳", title: "ارسال", desc: "بسته‌بندی و تحویل به شما" },
      ];

  return (
    <>
      <div
        className={
          isTransfer
            ? "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500"
            : "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"
        }
      >
        {isTransfer ? <Clock size={44} /> : <CheckCircle2 size={44} />}
      </div>

      <h1 className="mb-3 text-2xl font-black text-slate-900 sm:text-3xl">
        {isTransfer ? "سفارش شما در انتظار تأیید واریزی است" : "سفارش شما با موفقیت ثبت شد"}
      </h1>

      <p className="mx-auto mb-8 max-w-lg leading-relaxed text-slate-500">
        {isTransfer
          ? "سفارش شما ثبت شد. پس از بررسی فیش واریزی، کارشناسان ما برای تأیید نهایی و هماهنگی زمان ارسال با شما تماس می‌گیرند."
          : "از اعتماد شما سپاسگزاریم. کارشناسان ما ظرف حداکثر چند ساعت کاری برای تأیید نهایی، هماهنگی پرداخت و زمان ارسال با شما تماس می‌گیرند."}
      </p>

      <div className="mb-8 grid grid-cols-1 gap-3 text-right sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.step} className="rounded-2xl bg-slate-50 p-4">
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {s.step}
            </div>
            <div className="text-sm font-bold text-slate-800">{s.title}</div>
            <div className="mt-1 text-[11px] leading-relaxed text-slate-500">{s.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
}
