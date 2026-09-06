"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Sidebar, type SidebarCounts } from "@/components/admin/sidebar";
import { signOutAction } from "@/app/admin/actions";

/**
 * پوسته پنل: ساید‌بار ثابت + هدر چسبان + ناحیه محتوا.
 *
 * تنها بخش کلاینتی پوسته همین است و کارش فقط باز و بسته کردن کشوی موبایل و
 * نمایش عنوان صفحه است. همه صفحه‌های داخل پنل سرور کامپوننت می‌مانند و داده را
 * مستقیم از دیتابیس می‌گیرند، پس هیچ کاتالوگی وارد باندل مرورگر نمی‌شود.
 */

const TITLES: { prefix: string; title: string; exact?: boolean }[] = [
  { prefix: "/admin", title: "نمای کلی", exact: true },
  { prefix: "/admin/orders", title: "سفارش‌ها" },
  { prefix: "/admin/products", title: "محصولات" },
  { prefix: "/admin/articles", title: "مقالات" },
  { prefix: "/admin/reviews", title: "دیدگاه‌ها" },
  { prefix: "/admin/messages", title: "پیام‌ها" },
  { prefix: "/admin/torob", title: "ترب" },
];

export function AdminShell({
  counts,
  children,
}: {
  counts: SidebarCounts;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const title =
    TITLES.find((t) => (t.exact ? pathname === t.prefix : pathname.startsWith(t.prefix)))
      ?.title ?? "پنل مدیریت";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar counts={counts} open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ساید‌بار روی دسکتاپ ۱۸rem عرض دارد و fixed است، پس محتوا باید کنار برود. */}
      <div className="flex min-h-screen flex-col lg:mr-72">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="باز کردن منو"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <h1 className="flex-1 truncate text-base font-bold text-slate-900 sm:text-lg">
            {title}
          </h1>

          <form action={signOutAction}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut size={17} />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </form>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
