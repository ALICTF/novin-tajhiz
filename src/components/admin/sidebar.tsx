"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  FileText,
  ChartColumn,
  LayoutDashboard,
  MessageSquare,
  MessageSquareQuote,
  Package,
  Store,
  ShoppingCart,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/format";

/**
 * ناوبری کناری پنل.
 *
 * روی دسکتاپ همیشه ثابت است؛ روی موبایل به‌صورت کشو از راست باز می‌شود. کشو با
 * CSS جابه‌جا می‌شود (translate) نه با unmount کردن، تا باز و بسته شدنش روی
 * لایه کامپوزیت بماند و باعث layout دوباره نشود.
 */

export type SidebarCounts = {
  openOrders: number;
  pendingReviews: number;
  unreadMessages: number;
};

const links = [
  { href: "/admin", label: "نمای کلی", icon: LayoutDashboard, exact: true },
  { href: "/admin/analytics", label: "گزارش‌ها", icon: ChartColumn },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart, badge: "openOrders" },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/articles", label: "مقالات", icon: FileText },
  {
    href: "/admin/reviews",
    label: "دیدگاه‌ها",
    icon: MessageSquareQuote,
    badge: "pendingReviews",
  },
  { href: "/admin/messages", label: "پیام‌ها", icon: MessageSquare, badge: "unreadMessages" },
  { href: "/admin/torob", label: "ترب", icon: Store },
] as const;

export function Sidebar({
  counts,
  open,
  onClose,
}: {
  counts: SidebarCounts;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* پرده موبایل */}
      <div
        onClick={onClose}
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/50 transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-slate-200 bg-white transition-transform duration-300 ease-out",
          "lg:translate-x-0",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* ------------------------------ برند ------------------------------ */}
        <div className="flex h-20 shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="نوین تجهیز"
              width={44}
              height={44}
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">نوین تجهیز</span>
              <span className="text-[11px] font-medium text-slate-400">
                پنل مدیریت
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن منو"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* ----------------------------- لینک‌ها ----------------------------- */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {links.map((link) => {
            const active =
              "exact" in link && link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);

            const count =
              "badge" in link
                ? counts[link.badge as keyof SidebarCounts]
                : 0;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <link.icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-white" : "text-slate-400 group-hover:text-slate-600",
                  )}
                />
                <span className="flex-1">{link.label}</span>

                {count > 0 && (
                  <span
                    className={cn(
                      "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular-nums",
                      active ? "bg-white/25 text-white" : "bg-primary/10 text-primary",
                    )}
                  >
                    {toPersianDigits(count)}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ------------------------------ پایین ------------------------------ */}
        <div className="shrink-0 border-t border-slate-100 p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <ExternalLink size={18} className="shrink-0 text-slate-400" />
            مشاهده سایت
          </a>
        </div>
      </aside>
    </>
  );
}
