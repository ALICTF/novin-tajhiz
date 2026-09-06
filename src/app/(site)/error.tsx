"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // در محیط واقعی اینجا خطا به سرویس پایش ارسال می‌شود.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-32 pb-20">
      <div className="w-full max-w-lg rounded-[2.5rem] border border-slate-200 bg-white p-8 text-center shadow-xl md:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <AlertTriangle size={32} />
        </div>

        <h1 className="mb-3 text-2xl font-black text-slate-900">
          مشکلی پیش آمد
        </h1>
        <p className="mb-8 leading-relaxed text-slate-500">
          در نمایش این بخش خطایی رخ داد. لطفاً دوباره تلاش کنید؛ اگر مشکل ادامه داشت با
          پشتیبانی تماس بگیرید.
        </p>

        {error.digest && (
          <p className="dir-ltr mb-8 rounded-xl bg-slate-50 px-4 py-2 font-mono text-xs text-slate-400">
            {error.digest}
          </p>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset} className="h-12 gap-2 rounded-xl px-6">
            <RotateCcw size={18} />
            تلاش دوباره
          </Button>
          <Button asChild variant="outline" className="h-12 gap-2 rounded-xl px-6">
            <Link href="/">
              <Home size={18} />
              صفحه اصلی
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
