import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, MapPin, Receipt } from "lucide-react";
import { getCustomerPhone } from "@/lib/customer/session";
import { getCustomerOrder } from "@/lib/customer/orders";
import { OrderTimeline } from "@/components/shared/order-timeline";
import { formatNumber, toPersianDigits } from "@/lib/format";
import { formatOrderDateTime } from "@/lib/admin/format";
import { shippingMethods, paymentMethods } from "@/lib/data/checkout";
import { decodeParam } from "@/lib/utils";

export const metadata: Metadata = {
  title: "جزئیات سفارش",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function methodLabel(list: { id: string; title: string }[], id: string) {
  return list.find((m) => m.id === id)?.title ?? id;
}

export default async function CustomerOrderPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const phone = await getCustomerPhone();
  if (!phone) redirect("/track");

  const { reference: raw } = await params;
  const order = await getCustomerOrder(phone, decodeParam(raw).toUpperCase());
  if (!order) notFound();

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <Link
          href="/orders"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-primary"
        >
          <ArrowRight size={15} />
          بازگشت به سفارش‌ها
        </Link>

        <div className="mb-6">
          <h1 className="dir-ltr text-xl font-black text-slate-900 tabular-nums sm:text-2xl">
            {order.reference}
          </h1>
          <p className="mt-1.5 text-xs text-slate-500">
            ثبت شده در {formatOrderDateTime(order.createdAt)}
          </p>
        </div>

        {/* --------------------------- خط زمانی --------------------------- */}
        <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="mb-6 text-sm font-bold text-slate-900">وضعیت سفارش</h2>
          <OrderTimeline status={order.status} />
        </section>

        {/* ----------------------------- اقلام ----------------------------- */}
        <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="mb-4 text-sm font-bold text-slate-900">
            اقلام ({toPersianDigits(order.itemCount)})
          </h2>

          <ul className="flex flex-col divide-y divide-slate-100">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {item.brand} · {toPersianDigits(item.quantity)} عدد
                  </p>
                </div>

                <span className="shrink-0 text-sm font-bold text-slate-900 tabular-nums">
                  {item.unitPrice === null
                    ? "استعلامی"
                    : `${formatNumber(item.unitPrice * item.quantity)}`}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm">
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

        {/* --------------------------- ارسال و پرداخت --------------------------- */}
        <div className="grid gap-5 sm:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
              <MapPin size={15} className="text-slate-400" />
              ارسال
            </h2>
            <dl className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">روش</dt>
                <dd className="text-left text-slate-800">
                  {methodLabel(shippingMethods, order.shippingMethod)}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-slate-400">نشانی</dt>
                <dd className="leading-relaxed text-slate-700">
                  {order.province} — {order.city}
                  <br />
                  {order.address}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
              <Receipt size={15} className="text-slate-400" />
              پرداخت
            </h2>
            <dl className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">روش</dt>
                <dd className="text-left text-slate-800">
                  {methodLabel(paymentMethods, order.paymentMethod)}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
