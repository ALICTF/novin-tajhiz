"use client";

import { useSearchParams } from "next/navigation";
import { Hash } from "lucide-react";

export function OrderReference() {
  const reference = useSearchParams().get("ref");
  if (!reference) return null;

  return (
    <div className="mb-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
      <p className="mb-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <Hash size={14} />
        کد پیگیری سفارش
      </p>
      <p className="dir-ltr font-mono text-2xl font-black tracking-widest text-slate-900">
        {reference}
      </p>
    </div>
  );
}
