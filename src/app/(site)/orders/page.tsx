import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowLeft, LogOut, PackageSearch } from "lucide-react";
import { getCustomerPhone } from "@/lib/customer/session";
import { listCustomerOrders } from "@/lib/customer/orders";
import { customerSignOutAction } from "../track/actions";
import { ORDER_STATUS_META } from "@/lib/db/types";
import { formatNumber, toPersianDigits } from "@/lib/format";
import { formatOrderDate } from "@/lib/admin/format";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "سفارش‌های من",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const phone = await getCustomerPhone();
  if (!phone) redirect("/track");

  const orders = await listCustomerOrders(phone);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        {/* ----------------------------- سربرگ ----------------------------- */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
              سفارش‌های من
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              <span className="dir-ltr inline-block tabular-nums">
                {toPersianDigits(phone)}
              </span>
              {" · "}
              {toPersianDigits(orders.length)} سفارش
            </p>
          </div>

          <form action={customerSignOutAction}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:bg-white hover:text-slate-900"
            >
              <LogOut size={15} />
              خروج
            </button>
          </form>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="سفارشی پیدا نشد"
            description="با این شماره موبایل سفارشی ثبت نشده است."
          >
            <Button asChild className="rounded-xl">
              <Link href="/products">مشاهده محصولات</Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Link
                key={order.reference}
                href={`/orders/${order.reference}`}
                className="group rounded-3xl border border-slate-200 bg-white p-5 transition-colors hover:border-primary/40 sm:p-6"
              >
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="dir-ltr block text-sm font-black text-slate-900 tabular-nums">
                      {order.reference}
                    </span>
                    <span className="mt-1 block text-xs text-slate-400">
                      {formatOrderDate(order.createdAt)} ·{" "}
                      {toPersianDigits(order.itemCount)} قلم
                    </span>
                  </div>

                  <div className="text-left">
                    <span className="block text-sm font-black text-slate-900 tabular-nums">
                      {formatNumber(order.total)} تومان
                    </span>
                    <span className="mt-1 block text-xs font-bold text-primary">
                      {ORDER_STATUS_META[order.status].label}
                    </span>
                  </div>
                </div>

                {/* تصاویر اقلام */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {order.items.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                        title={item.name}
                      >
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <span className="text-xs font-medium text-slate-400">
                        +{toPersianDigits(order.items.length - 4)}
                      </span>
                    )}
                  </div>

                  <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-primary">
                    جزئیات
                    <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
