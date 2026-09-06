import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { getCustomerPhone } from "@/lib/customer/session";
import { TrackForm } from "./track-form";
import { primaryPhone } from "@/lib/data/site";
import { breadcrumbJsonLd, JsonLd, pageJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "پیگیری سفارش",
  description:
    "پیگیری آنلاین سفارش نوین تجهیز: با کد پیگیری و شماره موبایل، وضعیت سفارش خود را از ثبت تا تحویل ببینید و جزئیات اقلام و مبلغ را بررسی کنید.",
  alternates: { canonical: "/track" },
};

export const dynamic = "force-dynamic";

export default async function TrackPage() {
  if (await getCustomerPhone()) redirect("/orders");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-32 pb-20">
      <JsonLd
        data={pageJsonLd({
          type: "WebPage",
          name: "پیگیری سفارش",
          description:
            "پیگیری آنلاین سفارش نوین تجهیز با کد پیگیری و شماره موبایل.",
          path: "/track",
        })}
      />
      <JsonLd data={breadcrumbJsonLd([{ label: "پیگیری سفارش" }], "/track")} />

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

        {/*
          راهنمای کوتاه.

          قبلاً این صفحه فقط یک فرم و دو جمله داشت و برای موتور جستجو محتوای
          بسیار کمی محسوب می‌شد. متن زیر هم پرسش واقعی کاربر را جواب می‌دهد
          («کد پیگیری کجاست؟»، «چند وضعیت داریم؟») و هم صفحه را از حالت
          محتوای نازک درمی‌آورد.
        */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-loose text-slate-600">
          <h2 className="mb-3 text-sm font-bold text-slate-900">
            کد پیگیری را از کجا بیاورم؟
          </h2>
          <p className="mb-5">
            بلافاصله بعد از ثبت سفارش، کد پیگیری در همان صفحه نمایش داده
            می‌شود و برای شما پیامک هم می‌شود. اگر آن را گم کرده‌اید، با شماره
            پشتیبانی تماس بگیرید تا با نام و شماره موبایلتان پیدایش کنیم.
          </p>

          <h2 className="mb-3 text-sm font-bold text-slate-900">
            وضعیت سفارش یعنی چه؟
          </h2>
          <ul className="mb-5 flex flex-col gap-2">
            <li>
              <strong className="text-slate-800">در انتظار بررسی</strong> — سفارش
              ثبت شده و کارشناس ما هنوز آن را تأیید نکرده است.
            </li>
            <li>
              <strong className="text-slate-800">تأیید شده</strong> — موجودی و
              مبلغ بررسی و سفارش قطعی شده است.
            </li>
            <li>
              <strong className="text-slate-800">در حال آماده‌سازی</strong> —
              اقلام در حال بسته‌بندی‌اند.
            </li>
            <li>
              <strong className="text-slate-800">ارسال شده</strong> — بسته تحویل
              شرکت حمل شده و در راه است.
            </li>
            <li>
              <strong className="text-slate-800">تحویل شده</strong> — سفارش به
              دست شما رسیده است.
            </li>
          </ul>

          <p className="text-xs leading-relaxed text-slate-500">
            برای هر پرسشی درباره سفارش، قطعات سازگار یا زمان ارسال، با شماره{" "}
            <a
              href={`tel:${primaryPhone.tel}`}
              className="font-bold text-primary hover:underline"
            >
              <span className="dir-ltr tabular-nums">{primaryPhone.number}</span>
            </a>{" "}
            تماس بگیرید.
          </p>
        </div>
      </div>
    </div>
  );
}
