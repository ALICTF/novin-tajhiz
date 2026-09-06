import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { listOrders } from "@/lib/db/queries";
import { ORDER_STATUSES, ORDER_STATUS_META, isOrderStatus } from "@/lib/db/types";
import { formatNumber, toPersianDigits } from "@/lib/format";
import { formatRelative } from "@/lib/admin/format";
import {
  EmptyState,
  OrderStatusBadge,
  PageHeader,
  TableShell,
  Td,
  Th,
} from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type Search = { q?: string; status?: string; page?: string };

/** فیلترهای بالای جدول — لینک ساده‌اند، پس هیچ JS کلاینتی لازم ندارند. */
const FILTERS = [
  { value: "all", label: "همه" },
  { value: "open", label: "باز" },
  ...ORDER_STATUSES.map((s) => ({ value: s, label: ORDER_STATUS_META[s].label })),
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const rawStatus = params.status ?? "all";
  const status =
    rawStatus === "all" || rawStatus === "open" || isOrderStatus(rawStatus)
      ? rawStatus
      : "all";
  const page = Math.max(1, Number(params.page) || 1);

  const { items, total, pageCount } = await listOrders({ search: q, status, page });

  const buildHref = (next: Partial<Search>) => {
    const sp = new URLSearchParams();
    const merged = { q, status, page: String(page), ...next };
    if (merged.q) sp.set("q", merged.q);
    if (merged.status && merged.status !== "all") sp.set("status", merged.status);
    if (merged.page && merged.page !== "1") sp.set("page", merged.page);
    const qs = sp.toString();
    return `/admin/orders${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="سفارش‌ها"
        description={`${toPersianDigits(total)} سفارش`}
      />

      {/* ----------------------------- فیلترها ----------------------------- */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={buildHref({ status: f.value, page: "1" })}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                status === f.value
                  ? "bg-primary text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 ring-inset hover:bg-slate-100",
              )}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <form action="/admin/orders" className="relative shrink-0">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <Search
            size={15}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
          />
          <input
            name="q"
            defaultValue={q}
            placeholder="کد پیگیری، نام یا شماره..."
            aria-label="جستجوی سفارش"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pr-9 pl-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none sm:w-64"
          />
        </form>
      </div>

      {/* ------------------------------ جدول ------------------------------ */}
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title={q ? "سفارشی پیدا نشد" : "هنوز سفارشی ثبت نشده"}
          description={
            q
              ? "عبارت دیگری را امتحان کنید یا فیلتر وضعیت را بردارید."
              : "به‌محض اینکه مشتری از سایت خرید کند، سفارش اینجا نمایش داده می‌شود."
          }
        />
      ) : (
        <>
          <TableShell>
            <thead>
              <tr>
                <Th>کد پیگیری</Th>
                <Th>مشتری</Th>
                <Th>تماس</Th>
                <Th>اقلام</Th>
                <Th>مبلغ</Th>
                <Th>وضعیت</Th>
                <Th>ثبت</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((order) => (
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
                    <span className="block text-[11px] text-slate-400">
                      {order.city}
                    </span>
                  </Td>
                  <Td>
                    <a
                      href={`tel:${order.phone}`}
                      className="dir-ltr inline-block text-xs tabular-nums text-slate-500 hover:text-primary"
                    >
                      {toPersianDigits(order.phone)}
                    </a>
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
                    {formatRelative(order.createdAt)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>

          {pageCount > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildHref({ page: String(p) })}
                  className={cn(
                    "flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-bold tabular-nums transition-colors",
                    p === page
                      ? "bg-primary text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 ring-inset hover:bg-slate-100",
                  )}
                >
                  {toPersianDigits(p)}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
