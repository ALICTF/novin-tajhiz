"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitForm } from "@/lib/submit";
import { cn } from "@/lib/utils";

/**
 * این فرم داخل فوتر است و فوتر در layout ریشه قرار دارد، پس هر چیزی که اینجا
 * import شود روی *همه* صفحه‌های سایت بارگذاری می‌شود. قبلاً از react-hook-form
 * و zod استفاده می‌کرد و همان دو کتابخانه ۱۰۴ کیلوبایت (gzip) به بسته مشترک
 * اضافه می‌کردند — برای فرمی که فقط یک فیلد ایمیل دارد. اعتبارسنجی با یک
 * الگوی ساده انجام می‌شود؛ فرم‌های سنگین‌تر (تسویه‌حساب، تماس، نظر) همچنان
 * zod را دارند، ولی فقط در همان مسیر خودشان.
 */

/** الگوی ایمیل — همان سخت‌گیری zod().email() برای حالت‌های رایج. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterForm({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setSubmitting] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const email = (inputRef.current?.value ?? "").trim();

    if (!email) {
      setError("ایمیل را وارد کنید");
      inputRef.current?.focus();
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError("ایمیل معتبر نیست");
      inputRef.current?.focus();
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await submitForm("newsletter", { email });
      toast.success("عضویت شما ثبت شد", {
        description: "از این پس جدیدترین مطالب برای شما ارسال می‌شود.",
      });
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setSubmitting(false);
    }
  };

  const isDark = variant === "dark";

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)} noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Input
            ref={inputRef}
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder="example@mail.com"
            aria-label="آدرس ایمیل"
            aria-invalid={!!error}
            aria-describedby={error ? "newsletter-error" : undefined}
            onChange={() => error && setError(null)}
            className={cn(
              "h-12 rounded-xl text-left",
              isDark
                ? "border-white/10 bg-white/10 text-white placeholder:text-slate-500"
                : "border-slate-200 bg-slate-50",
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 gap-2 rounded-xl bg-primary px-8 font-bold text-white hover:bg-primary/90"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          عضویت
        </Button>
      </div>

      {error && (
        <p
          id="newsletter-error"
          role="alert"
          className="mt-2 text-xs font-medium text-rose-500"
        >
          {error}
        </p>
      )}
    </form>
  );
}
