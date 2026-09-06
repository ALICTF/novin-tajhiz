"use client";

import * as React from "react";
import { Check, Copy, Phone, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bankAccount } from "@/lib/data/checkout";
import { primaryPhone } from "@/lib/data/site";
import { toPersianDigits } from "@/lib/format";

/** ۱۶ رقم پیوسته را به چهار گروه چهارتایی می‌شکند. */
function groupCardNumber(raw: string): string[] {
  return raw.replace(/\D/g, "").match(/.{1,4}/g) ?? [];
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // برخی مرورگرها بدون HTTPS اجازه دسترسی به clipboard نمی‌دهند؛
      // در آن حالت کاربر می‌تواند عدد را دستی از روی کارت بخواند.
    }
  };

  return (
    <Button
      type="button"
      onClick={copy}
      variant="outline"
      className="h-10 gap-2 rounded-xl border-slate-200 text-xs font-bold"
    >
      {copied ? (
        <>
          <Check size={14} className="text-emerald-600" />
          کپی شد
        </>
      ) : (
        <>
          <Copy size={14} />
          {label}
        </>
      )}
    </Button>
  );
}

export function BankCard() {
  /*
    اگر حساب هنوز پیکربندی نشده، عمداً هیچ عددی نشان داده نمی‌شود.
    نمایش شماره ساختگی یعنی احتمال واریز مشتری به حساب اشتباه.
  */
  if (!bankAccount.configured || bankAccount.cardNumber.length < 16) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
          <TriangleAlert size={18} className="shrink-0" />
          دریافت شماره کارت
        </div>
        <p className="mb-4 text-xs leading-relaxed text-amber-800">
          برای دریافت شماره کارت و نهایی کردن پرداخت، لطفاً با ما تماس بگیرید.
          سفارش شما ثبت می‌شود و کارشناسان ما بلافاصله با شما هماهنگ می‌کنند.
        </p>
        <Button
          asChild
          className="h-11 gap-2 rounded-xl bg-amber-600 px-5 font-bold text-white hover:bg-amber-700"
        >
          <a href={`tel:${primaryPhone.tel}`}>
            <Phone size={16} />
            <span className="dir-ltr tabular-nums tracking-wide">
              {primaryPhone.number}
            </span>
          </a>
        </Button>
      </div>
    );
  }

  const groups = groupCardNumber(bankAccount.cardNumber);

  return (
    <div className="space-y-3">
      {/* کارت بانکی */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#B91C3C] via-[#9F1239] to-[#7F1D3A] p-5 text-white shadow-lg sm:p-6">
        {/* بافت تزئینی */}
        <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-black/10 blur-2xl" />

        <div className="relative z-10">
          <div className="mb-6 flex items-start justify-between">
            <span className="text-sm font-bold">{bankAccount.bank}</span>
            {/* تراشه */}
            <div className="h-7 w-9 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 ring-1 ring-amber-100/40" />
          </div>

          <div
            dir="ltr"
            className="mb-5 flex items-center justify-between gap-2 font-black tabular-nums"
          >
            {groups.map((g, i) => (
              <span key={i} className="text-lg tracking-[0.15em] sm:text-2xl">
                {toPersianDigits(g)}
              </span>
            ))}
          </div>

          <div>
            <div className="mb-0.5 text-[10px] tracking-wider text-white/60 uppercase">
              صاحب حساب
            </div>
            <div className="text-sm font-bold">{bankAccount.holder}</div>
          </div>
        </div>
      </div>

      {/* کپی */}
      <div className="flex flex-wrap gap-2">
        <CopyButton value={bankAccount.cardNumber} label="کپی شماره کارت" />
        {bankAccount.sheba && (
          <CopyButton value={`IR${bankAccount.sheba}`} label="کپی شبا" />
        )}
      </div>
    </div>
  );
}
