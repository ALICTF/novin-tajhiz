import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Phone, Receipt, User } from "lucide-react";
import { getOrderById } from "@/lib/db/queries";
import { ORDER_STATUSES, ORDER_STATUS_META } from "@/lib/db/types";
import { formatNumber, toPersianDigits } from "@/lib/format";
import { formatOrderDateTime } from "@/lib/admin/format";
import { OrderStatusBadge, TableShell, Td, Th } from "@/components/admin/ui";
import {
  updateOrderNoteAction,
  updateOrderStatusAction,
} from "@/app/admin/actions";
import { shippingMethods, paymentMethods } from "@/lib/data/checkout";

function methodLabel(list: { id: string; title: string }[], id: string) {
  return list.find((m) => m.id === id)?.title ?? id;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(Number(id));
  if (!order) notFound();

  return (
    <>
      <Link
        href="/admin/orders"
        className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowRight size={15} />
        بازگشت به سفارش‌ها
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="dir-ltr text-lg font-black text-slate-900 tabular-nums sm:text-xl">
              {order.reference}
            </h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            ثبت شده در {formatOrderDateTime(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* ------------------------- ستون اصلی ------------------------- */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          {/* اقلام */}
          <section>
            <h3 className="mb-3 text-sm font-bold text-slate-900">
              اقلام سفارش ({toPersianDigits(order.itemCount)})
            </h3>
            <TableShell>
              <thead>
                <tr>
                  <Th className="w-16" />
                  <Th>محصول</Th>
                  <Th>قیمت واحد</Th>
                  <Th>تعداد</Th>
                  <Th>جمع</Th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <Td>
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
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
                    </Td>
                    <Td>
                      <span className="text-slate-800">{item.name}</span>
                      <span className="block text-[11px] text-slate-400">
                        {item.brand} · {item.sku}
                      </span>
                    </Td>
                    <Td className="whitespace-nowrap tabular-nums text-slate-600">
                      {item.unitPrice === null
                        ? "استعلامی"
                        : formatNumber(item.unitPrice)}
                    </Td>
                    <Td className="tabular-nums text-slate-600">
                      {toPersianDigits(item.quantity)}
                    </Td>
                    <Td className="whitespace-nowrap font-bold tabular-nums text-slate-900">
                      {item.unitPrice === null
                        ? "—"
                        : formatNumber(item.unitPrice * item.quantity)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>

            {/* جمع مبالغ */}
            <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>جمع اقلام</span>
                <span className="tabular-nums">{formatNumber(order.subtotal)} تومان</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>هزینه ارسال</span>
                <span className="tabular-nums">
                  {order.shippingCost === 0
                    ? "رایگان"
                    : `${formatNumber(order.shippingCost)} تومان`}
                </span>
              </div>
              <div className="mt-1 flex justify-between border-t border-slate-100 pt-3 text-base font-black text-slate-900">
                <span>مبلغ کل</span>
                <span className="tabular-nums">{formatNumber(order.total)} تومان</span>
              </div>
            </div>
          </section>

          {/* یادداشت ادمین */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h3 className="mb-3 text-sm font-bold text-slate-900">یادداشت داخلی</h3>
            <form action={updateOrderNoteAction} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={order.id} />
              <textarea
                name="adminNote"
                defaultValue={order.adminNote}
                rows={3}
                placeholder="یادداشتی که فقط شما می‌بینید — مثلاً «با مشتری تماس گرفته شد»."
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="self-start rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary"
              >
                ذخیره یادداشت
              </button>
            </form>
          </section>
        </div>

        {/* ------------------------- ستون کناری ------------------------- */}
        <div className="flex flex-col gap-5">
          {/* تغییر وضعیت */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h3 className="mb-3 text-sm font-bold text-slate-900">وضعیت سفارش</h3>
            <div className="flex flex-col gap-2">
              {ORDER_STATUSES.map((s) => (
                <form key={s} action={updateOrderStatusAction}>
                  <input type="hidden" name="id" value={order.id} />
                  <input type="hidden" name="status" value={s} />
                  <button
                    type="submit"
                    disabled={s === order.status}
                    className={
                      s === order.status
                        ? "w-full cursor-default rounded-xl bg-primary px-3 py-2.5 text-right text-xs font-bold text-white"
                        : "w-full rounded-xl px-3 py-2.5 text-right text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
                    }
                  >
                    {ORDER_STATUS_META[s].label}
                  </button>
                </form>
              ))}
            </div>
          </section>

          {/* مشتری */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
              <User size={15} className="text-slate-400" />
              مشتری
            </h3>
            <dl className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">نام</dt>
                <dd className="text-left font-medium text-slate-800">
                  {order.customerName}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">تلفن</dt>
                <dd>
                  <a
                    href={`tel:${order.phone}`}
                    className="dir-ltr inline-flex items-center gap-1 font-medium tabular-nums text-primary"
                  >
                    <Phone size={12} />
                    {toPersianDigits(order.phone)}
                  </a>
                </dd>
              </div>
              {order.email && (
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">ایمیل</dt>
                  <dd className="dir-ltr text-left text-slate-700">{order.email}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* ارسال */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
              <MapPin size={15} className="text-slate-400" />
              نشانی و ارسال
            </h3>
            <dl className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">استان و شهر</dt>
                <dd className="text-left text-slate-800">
                  {order.province} — {order.city}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-slate-400">نشانی</dt>
                <dd className="leading-relaxed text-slate-700">{order.address}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">کد پستی</dt>
                <dd className="dir-ltr text-left tabular-nums text-slate-700">
                  {toPersianDigits(order.postalCode)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">روش ارسال</dt>
                <dd className="text-left text-slate-800">
                  {methodLabel(shippingMethods, order.shippingMethod)}
                </dd>
              </div>
              {order.note && (
                <div className="flex flex-col gap-1 border-t border-slate-100 pt-2.5">
                  <dt className="text-slate-400">یادداشت مشتری</dt>
                  <dd className="leading-relaxed text-slate-700">{order.note}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* پرداخت */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
              <Receipt size={15} className="text-slate-400" />
              پرداخت
            </h3>
            <dl className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">روش</dt>
                <dd className="text-left text-slate-800">
                  {methodLabel(paymentMethods, order.paymentMethod)}
                </dd>
              </div>
            </dl>

            {order.receiptPath ? (
              <a
                href={order.receiptPath}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block rounded-xl bg-slate-100 px-3 py-2.5 text-center text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
              >
                مشاهده رسید پرداخت
              </a>
            ) : (
              <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-center text-[11px] text-slate-400">
                رسیدی آپلود نشده است
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
