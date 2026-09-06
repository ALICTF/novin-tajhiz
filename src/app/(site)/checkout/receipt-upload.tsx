"use client";

import * as React from "react";
import Image from "next/image";
import { FileText, Info, Loader2, Send, TriangleAlert, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactInfo, socialLinks } from "@/lib/data/site";
import { toPersianDigits } from "@/lib/format";

const MAX_BYTES = 5 * 1024 * 1024; // ۵ مگابایت
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export type ReceiptFile = {
  name: string;
  size: number;
  type: string;
  /** مسیر فایل روی سرور بعد از آپلود موفق. */
  url: string;
};

/** اندازه بایت را به متن فارسی خوانا تبدیل می‌کند. */
function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${toPersianDigits(mb.toFixed(1))} مگابایت`;
  return `${toPersianDigits(Math.round(bytes / 1024))} کیلوبایت`;
}

export function ReceiptUpload({
  onChange,
}: {
  /** بعد از آپلود موفق، مشخصات فایل به‌همراه مسیرش به فرم والد داده می‌شود. */
  onChange: (file: ReceiptFile | null) => void;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // آدرس پیش‌نمایش یک blob URL است و باید هنگام تعویض یا unmount آزاد شود،
  // وگرنه تا بسته‌شدن تب در حافظه می‌ماند.
  React.useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const accept = async (picked: File | undefined) => {
    if (!picked) return;

    if (!ACCEPTED.includes(picked.type)) {
      setError("فقط تصویر (JPG، PNG، WebP) یا فایل PDF پذیرفته می‌شود.");
      return;
    }
    if (picked.size > MAX_BYTES) {
      setError(`حجم فایل نباید بیشتر از ${toPersianDigits(5)} مگابایت باشد.`);
      return;
    }

    setError(null);
    setFile(picked);
    setUploading(true);

    /*
      فایل همین‌جا آپلود می‌شود، نه هنگام ثبت سفارش. اگر تا لحظه آخر صبر
      می‌کردیم، مشتری بعد از پر کردن کل فرم تازه می‌فهمید آپلود شکست خورده.
    */
    try {
      const body = new FormData();
      body.append("file", picked);

      const response = await fetch("/api/receipt", { method: "POST", body });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setError(data.error ?? "آپلود فیش انجام نشد. دوباره تلاش کنید.");
        setFile(null);
        onChange(null);
        return;
      }

      onChange({
        name: picked.name,
        size: picked.size,
        type: picked.type,
        url: data.url,
      });
    } catch {
      setError("ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
      setFile(null);
      onChange(null);
    } finally {
      setUploading(false);
    }
  };

  const remove = () => {
    setFile(null);
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const telegram = socialLinks.find((s) => s.name.includes("تلگرام"));

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        id="receipt-input"
        onChange={(e) => accept(e.target.files?.[0])}
      />

      {uploading ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-8 text-center">
          <Loader2 size={26} className="animate-spin text-primary" />
          <span className="text-sm font-bold text-slate-700">
            در حال آپلود فیش...
          </span>
        </div>
      ) : !file ? (
        <label
          htmlFor="receipt-input"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition-colors hover:border-primary hover:bg-primary/5"
        >
          <Upload size={26} className="text-slate-400" />
          <span className="text-sm font-bold text-slate-700">
            تصویر فیش واریزی را انتخاب کنید
          </span>
          <span className="text-[11px] text-slate-400">
            JPG، PNG، WebP یا PDF — حداکثر {toPersianDigits(5)} مگابایت
          </span>
        </label>
      ) : (
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          {previewUrl ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-emerald-200">
              <Image
                src={previewUrl}
                alt="پیش‌نمایش فیش واریزی"
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-emerald-200">
              <FileText size={26} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-slate-900">{file.name}</div>
            <div className="mt-0.5 text-xs text-slate-500">{formatSize(file.size)}</div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="حذف فایل"
            onClick={remove}
            className="shrink-0 rounded-xl text-slate-400 hover:bg-white hover:text-rose-500"
          >
            <X size={18} />
          </Button>
        </div>
      )}

      {error && (
        <p role="alert" className="flex items-center gap-2 text-xs font-medium text-rose-600">
          <TriangleAlert size={14} className="shrink-0" />
          {error}
        </p>
      )}

      {/*
        تا وقتی بک‌اند آپلود آماده نشده، فایل فقط در مرورگر کاربر می‌ماند و
        جایی ارسال نمی‌شود. این کادر یک مسیر مطمئن جایگزین به او می‌دهد تا
        فیش گم نشود.
      */}
      <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-4 text-xs leading-relaxed text-blue-900">
        <Info size={16} className="mt-0.5 shrink-0" />
        <div>
          <p className="mb-2 font-bold">لطفاً تصویر فیش را برای ما هم بفرستید</p>
          <p className="mb-3">
            برای اینکه سفارش شما سریع‌تر تأیید شود، تصویر فیش را از یکی از راه‌های
            زیر هم ارسال کنید:
          </p>
          <div className="flex flex-wrap gap-2">
            {telegram && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-9 gap-1.5 rounded-lg border-blue-200 bg-white text-[11px] font-bold text-blue-800 hover:bg-blue-100"
              >
                <a href={telegram.href} target="_blank" rel="noreferrer">
                  <Send size={13} />
                  تلگرام
                </a>
              </Button>
            )}
            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-9 gap-1.5 rounded-lg border-blue-200 bg-white text-[11px] font-bold text-blue-800 hover:bg-blue-100"
            >
              <a href={`mailto:${contactInfo.email}`}>ایمیل</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
