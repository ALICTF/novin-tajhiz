import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Package,
  PackageX,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { getDashboardStats, getRevenueSeries } from "@/lib/db/queries";
import { formatNumber, toPersianDigits } from "@/lib/format";
import {
  EmptyState,
  OrderStatusBadge,
  PageHeader,
  StatCard,
  TableShell,
  Td,
  Th,
} from "@/components/admin/ui";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { formatOrderDate } from "@/lib/admin/format";

export default async function AdminOverviewPage() {
  const [stats, series] = await Promise.all([
    getDashboardStats(),
    getRevenueSeries(14),
  ]);

  return (
    <>
      <PageHeader
        title="نمای کلی"
        description="وضعیت فروشگاه در یک نگاه"
      />

      {/* ------------------------------ آمار ------------------------------ */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="درآمد ۳۰ روز اخیر"
          value={`${formatNumber(stats.thisMonthRevenue)} تومان`}
          hint={`${toPersianDigits(stats.thisMonthOrders)} سفارش`}
          icon={Wallet}
          change={stats.revenueChange}
        />
        <StatCard
          label="سفارش‌های باز"
          value={toPersianDigits(stats.openOrderCount)}
          hint={`از ${toPersianDigits(stats.orderCount)} سفارش کل`}
          icon={ShoppingCart}
          href="/admin/orders?status=open"
        />
        <StatCard
          label="محصولات"
          value={toPersianDigits(stats.productCount)}
          hint={
            stats.draftCount > 0
              ? `${toPersianDigits(stats.draftCount)} پیش‌نویس`
              : "همه منتشر شده"
          }
          icon={Package}
          href="/admin/products"
        />
        <StatCard
          label="ناموجود"
          value={toPersianDigits(stats.outOfStockCount)}
          hint="نیاز به تأمین"
          icon={PackageX}
          href="/admin/products?status=out-of-stock"
        />
      </div>

      {/* ----------------------------- نمودار ----------------------------- */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="mb-5 flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">
            درآمد ۱۴ روز گذشته
          </h3>
          <span className="text-xs text-slate-400">
            جمع: {formatNumber(series.reduce((s, d) => s + d.total, 0))} تومان
          </span>
        </div>
        <RevenueChart data={series} />
      </section>

      {/* -------------------------- سفارش‌های اخیر -------------------------- */}
      <section className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">سفارش‌های اخیر</h3>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            همه سفارش‌ها
            <ArrowLeft size={14} />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="هنوز سفارشی ثبت نشده"
            description="به‌محض اینکه مشتری از سایت خرید کند، سفارش اینجا نمایش داده می‌شود."
          />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>کد پیگیری</Th>
                <Th>مشتری</Th>
                <Th>اقلام</Th>
                <Th>مبلغ</Th>
                <Th>وضعیت</Th>
                <Th>تاریخ</Th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-slate-50">
                  <Td>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-bold text-primary hover:underline"
                    >
                      <span className="dir-ltr inline-block tabular-nums">
                        {order.reference}
                      </span>
                    </Link>
                  </Td>
                  <Td className="whitespace-nowrap text-slate-700">
                    {order.customerName}
                  </Td>
                  <Td className="tabular-nums text-slate-500">
                    {toPersianDigits(order.itemCount)}
                  </Td>
                  <Td className="whitespace-nowrap font-medium text-slate-800 tabular-nums">
                    {formatNumber(order.total)}
                  </Td>
                  <Td>
                    <OrderStatusBadge status={order.status} />
                  </Td>
                  <Td className="whitespace-nowrap text-xs text-slate-400">
                    {formatOrderDate(order.createdAt)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </section>

      {/* ---------------------------- میان‌برها ---------------------------- */}
      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-primary/40"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Package size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">افزودن محصول</p>
            <p className="text-xs text-slate-500">ثبت کالای جدید در کاتالوگ</p>
          </div>
        </Link>

        <Link
          href="/admin/articles"
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-primary/40"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">
              مقالات ({toPersianDigits(stats.articleCount)})
            </p>
            <p className="text-xs text-slate-500">مدیریت محتوای وبلاگ</p>
          </div>
        </Link>
      </section>
    </>
  );
}
