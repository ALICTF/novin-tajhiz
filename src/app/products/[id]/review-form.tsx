"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FormField } from "@/components/shared/form-field";
import { reviewSchema, type ReviewFormValues } from "@/lib/validation";
import { submitForm } from "@/lib/submit";
import { cn } from "@/lib/utils";

export function ReviewForm({ productName }: { productName: string }) {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { name: "", rating: 0, text: "" },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    await submitForm("product-review", { productName, ...values });
    toast.success("دیدگاه شما ثبت شد", {
      description: "پس از بررسی توسط کارشناسان ما منتشر خواهد شد.",
    });
    reset();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="mt-8 w-full rounded-xl bg-slate-900 text-white hover:bg-primary">
          ثبت دیدگاه جدید
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[90%] overflow-y-auto p-6 sm:w-[440px] [&>button]:right-4 [&>button]:left-auto"
      >
        <SheetHeader className="mb-6 p-0 text-right">
          <SheetTitle>ثبت دیدگاه</SheetTitle>
          <SheetDescription className="line-clamp-2 text-xs">
            نظر شما درباره «{productName}»
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <FormField id="review-name" label="نام شما" required error={errors.name?.message}>
            <Input
              id="review-name"
              placeholder="مثلاً: علی محمدی"
              aria-invalid={!!errors.name}
              className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              {...register("name")}
            />
          </FormField>

          <FormField id="review-rating" label="امتیاز شما" required error={errors.rating?.message}>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-1.5" id="review-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`${star} ستاره`}
                      onClick={() => field.onChange(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={cn(
                          star <= field.value ? "text-amber-400" : "text-slate-200",
                        )}
                        fill={star <= field.value ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              )}
            />
          </FormField>

          <FormField id="review-text" label="متن دیدگاه" required error={errors.text?.message}>
            <Textarea
              id="review-text"
              placeholder="تجربه خود از استفاده این محصول را بنویسید..."
              aria-invalid={!!errors.text}
              className="min-h-[140px] resize-none rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              {...register("text")}
            />
          </FormField>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full gap-2 rounded-xl bg-slate-900 font-bold text-white hover:bg-primary"
          >
            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
            ثبت دیدگاه
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
