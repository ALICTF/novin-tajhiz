import Link from "next/link";
import {
  MapPin,
  Package,
  Repeat,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  getCategoryBreakdown,
  getCustomerInsights,
  getInventorySnapshot,
  getMonthOverview,
  getRevenueSeries,
  getStatusBreakdown,
  getTopProducts,
  RANGES,
  resolveRange,
} from "@/lib/db/analytics";
import { ORDER_STATUS_META } from "@/lib/db/types";
import { formatNumber, toPersianDigits } from "@/lib/format";
import { PageHeader, StatCard, TableShell, Td, Th } from "@/components/admin/ui";
import {
  RankedBarChart,
  RevenueAreaChart,
  StatusDonut,
} from "@/components/admin/charts";
import { cn } from "@/lib/utils";

/**
 * رنگ هر وضعیت — هم‌خوان با نشان‌های جدول سفارش‌ها.
 * مقدار خام رنگ است نه کلاس Tailwind، چون Recharts آن را مستقیم روی SVG
 * می‌گذارد و کلاس CSS به آنجا نمی‌رسد.
 */
const STATUS_COLORS: Record<string, string> = {
  pending: "#fbbf24",
  confirmed: "#38bdf8",
  processing: "#a78bfa",
  shipped: "#2dd4bf",
  delivered: "#10b981",
  cancelled: "#fb7185",
};

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rawRange } = await searchParams;
  const range = resolveRange(rawRange);

  const from = new Date();
  from.setHours(0, 0, 0, 0);
  from.setDate(from.getDate() - (range.days - 1));

  const [month, series, statuses, topProducts, categories, customers, inventory] =
    await Promise.all([
      getMonthOverview(),
      getRevenueSeries(range.days),
      getStatusBreakdown(from),
      getTopProducts(from),
      getCategoryBreakdown(from),
      getCustomerInsights(from),
      getInventorySnapshot(),
    ]);

  const rangeTotal = series.reduce((sum, d) => sum + d.total, 0);
  const rangeOrders = series.reduce((sum, d) => sum + d.count, 0);

  return (
    <>
      <PageHeader
        title="گزارش‌ها"
        description="نگاه دقیق‌تر به فروش، محصولات و مشتری‌ها"
        action={
          <div className="flex flex-wrap gap-1.5">
            {RANGES.map((r) => (
              <Link
                key={r.value}
                href={r.value === "30" ? "/admin/analytics" : `/admin/analytics?range=${r.value}`}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                  range.value === r.value
                    ? "bg-primary text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 ring-inset hover:bg-slate-100",
                )}
              >
                {r.label}
              </Link>
            ))}
          </div>
        }
      />

      {/* ------------------------- ماه شمسی جاری ------------------------- */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label={`درآمد ${month.monthName}`}
          value={`${formatNumber(month.thisMonth.revenue)} تومان`}
          hint={`ماه قبل: ${formatNumber(month.lastMonth.revenue)}`}
          icon={Wallet}
          change={month.revenueChange}
        />
        <StatCard
          label={`سفارش ${month.monthName}`}
          value={toPersianDigits(month.thisMonth.orders)}
          hint={`ماه قبل: ${toPersianDigits(month.lastMonth.orders)}`}
          icon={ShoppingCart}
          change={month.ordersChange}
        />
        <StatCard
          label="میانگین ارزش سفارش"
          value={`${formatNumber(month.thisMonth.averageOrder)} تومان`}
          hint="در ماه جاری"
          icon={TrendingUp}
        />
        <StatCard
          label="مشتری تکراری"
          value={`${toPersianDigits(customers.repeatRate)}٪`}
          hint={`${toPersianDigits(customers.repeatCustomers)} از ${toPersianDigits(customers.uniqueCustomers)} مشتری`}
          icon={Repeat}
        />
      </div>

      {/* --------------------------- نمودار درآمد --------------------------- */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">
            روند درآمد — {range.label} گذشته
          </h3>
          <span className="text-xs text-slate-400">
            جمع {formatNumber(rangeTotal)} تومان از{" "}
            {toPersianDigits(rangeOrders)} سفارش
          </span>
        </div>
        <RevenueAreaChart data={series} />
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* ------------------------ وضعیت سفارش‌ها ------------------------ */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <h3 className="mb-5 text-sm font-bold text-slate-900">
            وضعیت سفارش‌های {range.label} اخیر
          </h3>
          <StatusDonut
            data={statuses.map((s) => ({
              label: ORDER_STATUS_META[s.status].label,
              value: s.count,
              color: STATUS_COLORS[s.status] ?? "#cbd5e1",
            }))}
          />
        </section>

        {/* ------------------------ فروش هر دسته ------------------------ */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <h3 className="mb-5 text-sm font-bold text-slate-900">
            فروش بر اساس دسته‌بندی
          </h3>
          <RankedBarChart
            data={categories.map((c) => ({
              label: c.name,
              value: c.revenue,
              hint: `${toPersianDigits(c.quantity)} عدد فروخته شده`,
            }))}
            emptyText="در این بازه فروشی ثبت نشده است"
          />
        </section>
      </div>

      {/* -------------------------- پرفروش‌ترین‌ها -------------------------- */}
      <section className="mt-6">
        <h3 className="mb-4 text-sm font-bold text-slate-900">
          پرفروش‌ترین محصولات — {range.label} گذشته
        </h3>

        {topProducts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-xs text-slate-400">
            در این بازه محصولی فروخته نشده است
          </p>
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th className="w-10">#</Th>
                <Th>محصول</Th>
                <Th>تعداد</Th>
                <Th>درآمد</Th>
                <Th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={p.key} className="transition-colors hover:bg-slate-50">
                  <Td className="text-xs font-bold text-slate-400 tabular-nums">
                    {toPersianDigits(i + 1)}
                  </Td>
                  <Td>
                    <span className="text-slate-800">{p.name}</span>
                    <span className="block text-[11px] text-slate-400">
                      {p.brand}
                    </span>
                  </Td>
                  <Td className="tabular-nums text-slate-600">
                    {toPersianDigits(p.quantity)}
                  </Td>
                  <Td className="whitespace-nowrap font-bold tabular-nums text-slate-900">
                    {formatNumber(p.revenue)}
                  </Td>
                  <Td>
                    {p.productId ? (
                      <Link
                        href={`/admin/products/${p.productId}`}
                        className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/5"
                      >
                        ویرایش
                      </Link>
                    ) : (
                      <span className="text-[11px] text-slate-300">حذف شده</span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* --------------------------- شهرها --------------------------- */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-900">
            <MapPin size={15} className="text-slate-400" />
            شهرهای برتر
          </h3>
          <RankedBarChart
            data={customers.topCities.map((c) => ({
              label: c.name,
              value: c.revenue,
              hint: `${toPersianDigits(c.orders)} سفارش`,
            }))}
            emptyText="در این بازه سفارشی ثبت نشده است"
          />
        </section>

        {/* -------------------------- وضعیت انبار -------------------------- */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-900">
            <Package size={15} className="text-slate-400" />
            وضعیت کاتالوگ
          </h3>

          <dl className="flex flex-col gap-3.5 text-xs">
            {[
              { label: "کل محصولات", value: inventory.total, href: "/admin/products" },
              { label: "منتشر شده", value: inventory.published, href: "/admin/products?status=published" },
              { label: "ناموجود", value: inventory.outOfStock, href: "/admin/products?status=out-of-stock", warn: inventory.outOfStock > 0 },
              { label: "بدون قیمت (به ترب نمی‌رود)", value: inventory.noPrice, href: "/admin/torob", warn: inventory.noPrice > 0 },
              { label: "دیدگاه در انتظار تأیید", value: inventory.reviewsPending, href: "/admin/reviews", warn: inventory.reviewsPending > 0 },
            ].map((row) => (
              <Link
                key={row.label}
                href={row.href}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
              >
                <dt className="text-slate-600">{row.label}</dt>
                <dd
                  className={cn(
                    "shrink-0 text-sm font-bold tabular-nums",
                    row.warn ? "text-amber-600" : "text-slate-900",
                  )}
                >
                  {toPersianDigits(row.value)}
                </dd>
              </Link>
            ))}
          </dl>
        </section>
      </div>

      <p className="mt-6 flex items-center gap-2 text-[11px] leading-relaxed text-slate-400">
        <Users size={13} className="shrink-0" />
        سفارش‌های لغوشده در هیچ‌کدام از مبالغ بالا حساب نمی‌شوند. اقلام «تماس
        بگیرید» چون قیمت ندارند، صفر در نظر گرفته می‌شوند.
      </p>
    </>
  );
}
