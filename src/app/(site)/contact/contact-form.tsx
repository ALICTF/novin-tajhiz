"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/form-field";
import { contactSchema, type ContactFormValues } from "@/lib/validation";
import { submitContactAction } from "@/app/(site)/contact/actions";

export function ContactForm() {
  const [reference, setReference] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", phone: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    const result = await submitContactAction(values);
    setReference(result.reference);
    toast.success("پیام شما ارسال شد", {
      description: `کد پیگیری: ${result.reference}`,
    });
    reset();
  };

  if (reference) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50/50 px-6 py-16 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-900">پیام شما ثبت شد</h3>
        <p className="mb-4 max-w-sm text-sm leading-relaxed text-slate-600">
          کارشناسان ما در اسرع وقت با شما تماس می‌گیرند. کد پیگیری پیام خود را
          نگه دارید.
        </p>
        <p className="dir-ltr mb-6 rounded-xl border border-dashed border-emerald-300 bg-white px-5 py-2 font-mono text-lg font-black text-slate-900">
          {reference}
        </p>
        <Button variant="outline" onClick={() => setReference(null)} className="rounded-xl">
          ارسال پیام جدید
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField id="contact-name" label="نام و نام خانوادگی" required error={errors.name?.message}>
          <Input
            id="contact-name"
            placeholder="مثلاً: علی محمدی"
            aria-invalid={!!errors.name}
            className="h-12 rounded-xl border-slate-200 bg-slate-50 transition-all focus:bg-white"
            {...register("name")}
          />
        </FormField>

        <FormField id="contact-phone" label="شماره تماس" required error={errors.phone?.message}>
          <Input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            placeholder="09151234567"
            aria-invalid={!!errors.phone}
            className="dir-ltr h-12 rounded-xl border-slate-200 bg-slate-50 text-right transition-all focus:bg-white"
            {...register("phone")}
          />
        </FormField>
      </div>

      <FormField
        id="contact-email"
        label="ایمیل (اختیاری)"
        error={errors.email?.message}
        hint="اگر ترجیح می‌دهید پاسخ را ایمیلی دریافت کنید"
      >
        <Input
          id="contact-email"
          type="email"
          placeholder="example@mail.com"
          aria-invalid={!!errors.email}
          className="dir-ltr h-12 rounded-xl border-slate-200 bg-slate-50 text-right transition-all focus:bg-white"
          {...register("email")}
        />
      </FormField>

      <FormField id="contact-subject" label="موضوع پیام" required error={errors.subject?.message}>
        <Input
          id="contact-subject"
          placeholder="مثلاً: درخواست همکاری"
          aria-invalid={!!errors.subject}
          className="h-12 rounded-xl border-slate-200 bg-slate-50 transition-all focus:bg-white"
          {...register("subject")}
        />
      </FormField>

      <FormField id="contact-message" label="متن پیام" required error={errors.message?.message}>
        <Textarea
          id="contact-message"
          placeholder="پیام خود را بنویسید..."
          aria-invalid={!!errors.message}
          className="min-h-[140px] resize-none rounded-xl border-slate-200 bg-slate-50 transition-all focus:bg-white"
          {...register("message")}
        />
      </FormField>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-14 w-full gap-2 rounded-xl bg-slate-900 text-lg font-bold shadow-lg shadow-slate-900/10 hover:bg-primary"
      >
        {isSubmitting ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Send size={20} />
        )}
        {isSubmitting ? "در حال ارسال..." : "ثبت و ارسال پیام"}
      </Button>
    </form>
  );
}
