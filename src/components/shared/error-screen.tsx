import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * قالب مشترک صفحه‌های خطا.
 *
 * همه حالت‌ها — ۴۰۴، خطای اجرا، قطعی دیتابیس — یک ساختار دارند: یک نشان، یک
 * عنوان، یک توضیح از دید کاربر (نه پیام فنی)، و راه ادامه دادن. داشتن یک
 * قالب مشترک باعث می‌شود همه‌شان مثل هم به‌نظر برسند و اضافه کردن حالت جدید
 * فقط چند خط باشد.
 *
 * سرور کامپوننت است و هیچ جاوااسکریپتی به مرورگر نمی‌فرستد.
 */

export type ErrorScreenTone = "slate" | "rose" | "amber";

const TONES: Record<ErrorScreenTone, { badge: string; code: string }> = {
  slate: { badge: "bg-slate-100 text-slate-400", code: "text-slate-200" },
  rose: { badge: "bg-rose-50 text-rose-500", code: "text-rose-100" },
  amber: { badge: "bg-amber-50 text-amber-600", code: "text-amber-100" },
};

export function ErrorScreen({
  code,
  icon: Icon,
  title,
  description,
  tone = "slate",
  reference,
  children,
}: {
  /** عدد بزرگ پس‌زمینه، مثل ۴۰۴. اختیاری. */
  code?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: ErrorScreenTone;
  /** کد پیگیری خطا، برای وقتی کاربر با پشتیبانی تماس می‌گیرد. */
  reference?: string;
  /** دکمه‌ها و میان‌برها. */
  children?: React.ReactNode;
}) {
  const palette = TONES[tone];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-24">
      <div className="w-full max-w-lg text-center">
        {/* نشان — اگر کد داشته باشیم، عدد پشت آیکون می‌نشیند */}
        <div className={cn("relative mb-7", code && "mb-4")}>
          {code && (
            <span
              aria-hidden="true"
              className={cn(
                "block text-[110px] leading-none font-black select-none md:text-[150px]",
                palette.code,
              )}
            >
              {code}
            </span>
          )}
          <div
            className={cn(
              "flex items-center justify-center",
              code && "absolute inset-0",
            )}
          >
            <span
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ring-1 ring-slate-200/60",
                code ? "bg-white text-primary" : palette.badge,
              )}
            >
              <Icon size={30} strokeWidth={1.5} />
            </span>
          </div>
        </div>

        <h1 className="mb-3 text-2xl font-black text-slate-900 md:text-3xl">
          {title}
        </h1>
        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-slate-500 md:text-base">
          {description}
        </p>

        {reference && (
          <p
            dir="ltr"
            className="mx-auto mb-8 w-fit rounded-xl bg-white px-4 py-2 font-mono text-[11px] text-slate-400 ring-1 ring-slate-200 ring-inset"
          >
            {reference}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}

/** ردیف میان‌برهای زیر متن خطا. */
export function ErrorLinks({
  items,
}: {
  items: { href: string; icon: LucideIcon; title: string; desc: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group rounded-2xl border border-slate-200 bg-white p-4 text-center transition-colors hover:border-primary/40"
        >
          <span className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-primary group-hover:text-white">
            <item.icon size={18} />
          </span>
          <span className="block text-sm font-bold text-slate-800">
            {item.title}
          </span>
          <span className="mt-0.5 block text-[11px] text-slate-400">
            {item.desc}
          </span>
        </Link>
      ))}
    </div>
  );
}
