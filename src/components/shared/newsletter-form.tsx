"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterSchema, type NewsletterFormValues } from "@/lib/validation";
import { submitForm } from "@/lib/submit";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: NewsletterFormValues) => {
    await submitForm("newsletter", values);
    toast.success("عضویت شما ثبت شد", {
      description: "از این پس جدیدترین مطالب برای شما ارسال می‌شود.",
    });
    reset();
  };

  const isDark = variant === "dark";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("w-full", className)} noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Input
            type="email"
            dir="ltr"
            placeholder="example@mail.com"
            aria-label="آدرس ایمیل"
            aria-invalid={!!errors.email}
            className={cn(
              "h-12 rounded-xl text-left",
              isDark
                ? "border-white/10 bg-white/10 text-white placeholder:text-slate-500"
                : "border-slate-200 bg-slate-50",
            )}
            {...register("email")}
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

      {errors.email && (
        <p role="alert" className="mt-2 text-xs font-medium text-rose-500">
          {errors.email.message}
        </p>
      )}
    </form>
  );
}
