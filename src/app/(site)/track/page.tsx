import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { getCustomerPhone } from "@/lib/customer/session";
import { TrackForm } from "./track-form";

export const metadata: Metadata = {
  title: "پیگیری سفارش",
  description: "وضعیت سفارش خود را با کد پیگیری و شماره موبایل ببینید.",
  alternates: { canonical: "/track" },
};

export const dynamic = "force-dynamic";

export default async function TrackPage() {
  if (await getCustomerPhone()) redirect("/orders");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-32 pb-20">
      <div className="w-full max-w-md">
        <div className="mb-7 flex flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PackageSearch size={26} />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
              پیگیری سفارش
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
              کد پیگیری‌ای که هنگام ثبت سفارش گرفتید را به‌همراه شماره موبایل
              وارد کنید.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <TrackForm />
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">
          کد پیگیری را گم کرده‌اید؟ با شماره پشتیبانی تماس بگیرید.
        </p>
      </div>
    </div>
  );
}
