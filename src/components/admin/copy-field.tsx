"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

/**
 * فیلد فقط‌خواندنی با دکمه کپی.
 *
 * تنها بخش کلاینتی صفحه ترب است. clipboard فقط در مرورگر وجود دارد، پس این
 * قطعه نمی‌تواند سرور کامپوننت باشد؛ ولی خودش کوچک نگه داشته شده تا بقیه صفحه
 * سرور بماند.
 */
export function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // مرورگرهای قدیمی یا زمینه غیرامن؛ کاربر می‌تواند دستی انتخاب کند.
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        readOnly
        value={value}
        dir="ltr"
        onFocus={(e) => e.currentTarget.select()}
        aria-label="آدرس فید ترب"
        className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-left text-xs text-slate-700 focus:border-primary focus:outline-none"
      />
      <button
        type="button"
        onClick={copy}
        className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white transition-colors hover:bg-primary"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? "کپی شد" : "کپی"}
      </button>
    </div>
  );
}
