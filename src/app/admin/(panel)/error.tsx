"use client";

import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * خطای اجرا داخل پنل.
 *
 * محتمل‌ترین علتش قطع شدن دیتابیس است: صفحه‌های سایت عمومی کوئری ناموفق را
 * تحمل می‌کنند و خالی برمی‌گردانند، ولی پنل باید داده واقعی نشان بدهد و
 * نمی‌تواند وانمود کند همه‌چیز درست است.
 *
 * پیام عمداً متن خطای فنی را نشان نمی‌دهد؛ فقط کد پیگیری، که برای دنبال کردن
 * در لاگ سرور کافی است.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-rose-200 bg-rose-50/40 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
        <AlertTriangle size={22} />
      </span>

      <div>
        <p className="text-sm font-bold text-slate-900">بارگذاری این بخش ناموفق بود</p>
        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">
          معمولاً یعنی ارتباط با دیتابیس قطع شده است. اگر با تلاش دوباره درست
          نشد، وضعیت سرویس دیتابیس را بررسی کنید.
        </p>
      </div>

      {error.digest && (
        <p
          dir="ltr"
          className="rounded-lg bg-white px-3 py-1.5 font-mono text-[11px] text-slate-400 ring-1 ring-slate-200 ring-inset"
        >
          {error.digest}
        </p>
      )}

      <button
        type="button"
        onClick={reset}
        className="mt-1 flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary"
      >
        <RotateCcw size={15} />
        تلاش دوباره
      </button>
    </div>
  );
}
