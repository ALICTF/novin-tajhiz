"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft, ArrowRight, Check, CreditCard, Loader2,
  MapPin, ReceiptText, ShoppingBag, Info, AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { FormField } from "@/components/shared/form-field";
import { useCart } from "@/context/cart-context";
import { checkoutShippingSchema, type CheckoutFormValues } from "@/lib/validation";
import { placeOrderAction } from "@/app/(site)/checkout/actions";
import { formatPrice, toPersianDigits } from "@/lib/format";
import {
  checkoutSteps,
  FREE_SHIPPING_THRESHOLD,
  paymentMethods,
  provinces,
  shippingMethods,
} from "@/lib/data/checkout";
import { cn } from "@/lib/utils";
import { BankCard } from "./bank-card";
import { ReceiptUpload, type ReceiptFile } from "./receipt-upload";

export function CheckoutClient() {
  const router = useRouter();
  const { lines, subtotal, quoteOnlyCount, clear, hydrated } = useCart();
  const [step, setStep] = React.useState(1);
  const [receipt, setReceipt] = React.useState<ReceiptFile | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutShippingSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      province: "خراسان رضوی",
      city: "مشهد",
      address: "",
      postalCode: "",
      shippingMethod: "courier",
      paymentMethod: "transfer",
      note: "",
    },
  });

  const shippingMethodId = watch("shippingMethod");
  const paymentMethodId = watch("paymentMethod");
  const selectedShipping = shippingMethods.find((m) => m.id === shippingMethodId);
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (selectedShipping?.cost ?? 0);
  const total = subtotal + shippingCost;

  const goNext = async () => {
    if (step === 2) {
      const valid = await trigger([
        "firstName",
        "lastName",
        "phone",
        "email",
        "province",
        "city",
        "address",
        "postalCode",
        "shippingMethod",
      ]);
      if (!valid) return;
    }
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const onSubmit = async (values: CheckoutFormValues) => {
    setSubmitError(null);

    /*
      فقط شناسه و تعداد فرستاده می‌شود. مبلغ سفارش سمت سرور از روی دیتابیس
      محاسبه می‌شود، وگرنه هر کسی می‌توانست با دستکاری درخواست قیمت را عوض کند.
    */
    const result = await placeOrderAction(
      values,
      lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
    );

    if (!result.ok) {
      setSubmitError(result.error);
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    clear();
    const paid = values.paymentMethod === "transfer" ? "1" : "0";
    router.push(`/checkout/success?ref=${result.reference}&transfer=${paid}`);
  };

  /* --------------------------- حالت سبد خالی --------------------------- */

  if (hydrated && lines.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20">
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          <EmptyState
            icon={ShoppingBag}
            title="سبدی برای تسویه وجود ندارد"
            description="برای ادامه فرآیند خرید، ابتدا محصولی به سبد خود اضافه کنید."
          >
            <Button asChild className="rounded-xl">
              <Link href="/products">مشاهده محصولات</Link>
            </Button>
          </EmptyState>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <Breadcrumbs
          items={[{ label: "سبد خرید", href: "/cart" }, { label: "تسویه‌حساب" }]}
          className="mb-6"
        />

        <h1 className="mb-8 text-3xl font-black tracking-tight text-slate-900">
          تکمیل و ثبت سفارش
        </h1>

        {/* ------------------------------ مراحل ------------------------------ */}
        <ol className="mb-10 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {checkoutSteps.map((s, i) => (
            <li key={s.id} className="flex flex-1 items-center gap-3 min-w-[150px]">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all",
                  step > s.id
                    ? "bg-emerald-500 text-white"
                    : step === s.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-slate-100 text-slate-400",
                )}
              >
                {step > s.id ? <Check size={16} /> : toPersianDigits(s.id)}
              </div>
              <div className="min-w-0">
                <div
                  className={cn(
                    "truncate text-sm font-bold",
                    step >= s.id ? "text-slate-900" : "text-slate-400",
                  )}
                >
                  {s.title}
                </div>
                <div className="truncate text-[11px] text-slate-400">{s.description}</div>
              </div>
              {i < checkoutSteps.length - 1 && (
                <div className="hidden h-px flex-1 bg-slate-100 lg:block" />
              )}
            </li>
          ))}
        </ol>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {submitError && (
            <p
              role="alert"
              className="mb-6 flex items-start gap-2 rounded-2xl bg-rose-50 px-4 py-3.5 text-sm font-medium text-rose-700 ring-1 ring-rose-200 ring-inset"
            >
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              {submitError}
            </p>
          )}
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {/* ------------------------ گام ۱: بازبینی ------------------------ */}
              {step === 1 && (
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                  <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                    <ShoppingBag size={20} className="text-primary" />
                    بازبینی اقلام سفارش
                  </h2>

                  <div className="space-y-3">
                    {lines.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 rounded-2xl border border-slate-100 p-3"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1 mix-blend-multiply"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-bold text-slate-800">
                            {product.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {product.brand} • تعداد {toPersianDigits(quantity)}
                          </p>
                        </div>
                        <div className="text-left text-sm font-bold text-slate-900">
                          {product.price === null
                            ? "استعلام"
                            : formatPrice(product.price * quantity, false)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Button asChild variant="ghost" className="text-slate-500">
                      <Link href="/cart">ویرایش سبد</Link>
                    </Button>
                    <Button type="button" onClick={goNext} className="gap-2 rounded-xl px-6">
                      ادامه
                      <ArrowLeft size={16} />
                    </Button>
                  </div>
                </section>
              )}

              {/* ------------------------ گام ۲: ارسال ------------------------ */}
              {step === 2 && (
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                  <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                    <MapPin size={20} className="text-primary" />
                    اطلاعات گیرنده و ارسال
                  </h2>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <FormField id="firstName" label="نام" required error={errors.firstName?.message}>
                        <Input
                          id="firstName"
                          placeholder="علی"
                          aria-invalid={!!errors.firstName}
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                          {...register("firstName")}
                        />
                      </FormField>

                      <FormField id="lastName" label="نام خانوادگی" required error={errors.lastName?.message}>
                        <Input
                          id="lastName"
                          placeholder="محمدی"
                          aria-invalid={!!errors.lastName}
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                          {...register("lastName")}
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <FormField id="phone" label="شماره موبایل" required error={errors.phone?.message}>
                        <Input
                          id="phone"
                          type="tel"
                          inputMode="tel"
                          placeholder="09151234567"
                          aria-invalid={!!errors.phone}
                          className="dir-ltr h-12 rounded-xl border-slate-200 bg-slate-50 text-right focus:bg-white"
                          {...register("phone")}
                        />
                      </FormField>

                      <FormField
                        id="email"
                        label="ایمیل (اختیاری)"
                        error={errors.email?.message}
                        hint="برای دریافت فاکتور الکترونیکی"
                      >
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@mail.com"
                          aria-invalid={!!errors.email}
                          className="dir-ltr h-12 rounded-xl border-slate-200 bg-slate-50 text-right focus:bg-white"
                          {...register("email")}
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                      <FormField id="province" label="استان" required error={errors.province?.message}>
                        <Controller
                          name="province"
                          control={control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger id="province" aria-invalid={!!errors.province}>
                                <SelectValue placeholder="انتخاب کنید" />
                              </SelectTrigger>
                              <SelectContent>
                                {provinces.map((p) => (
                                  <SelectItem key={p} value={p}>
                                    {p}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormField>

                      <FormField id="city" label="شهر" required error={errors.city?.message}>
                        <Input
                          id="city"
                          placeholder="مشهد"
                          aria-invalid={!!errors.city}
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                          {...register("city")}
                        />
                      </FormField>

                      <FormField id="postalCode" label="کد پستی" required error={errors.postalCode?.message}>
                        <Input
                          id="postalCode"
                          inputMode="numeric"
                          placeholder="۱۰ رقم"
                          aria-invalid={!!errors.postalCode}
                          className="dir-ltr h-12 rounded-xl border-slate-200 bg-slate-50 text-right focus:bg-white"
                          {...register("postalCode")}
                        />
                      </FormField>
                    </div>

                    <FormField id="address" label="نشانی کامل" required error={errors.address?.message}>
                      <Textarea
                        id="address"
                        placeholder="خیابان، کوچه، پلاک، واحد..."
                        aria-invalid={!!errors.address}
                        className="min-h-[100px] resize-none rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                        {...register("address")}
                      />
                    </FormField>

                    {/* روش ارسال */}
                    <div className="space-y-3">
                      <Label className="mr-1">روش ارسال</Label>
                      <Controller
                        name="shippingMethod"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup value={field.value} onValueChange={field.onChange}>
                            {shippingMethods.map((m) => (
                              <label
                                key={m.id}
                                htmlFor={`ship-${m.id}`}
                                className={cn(
                                  "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all",
                                  field.value === m.id
                                    ? "border-primary bg-primary/5"
                                    : "border-slate-200 hover:border-slate-300",
                                )}
                              >
                                <RadioGroupItem value={m.id} id={`ship-${m.id}`} className="mt-0.5" />
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-sm font-bold text-slate-900">
                                      {m.title}
                                    </span>
                                    <span className="text-xs font-bold text-slate-600">
                                      {m.cost === 0 ? (
                                        <span className="text-emerald-600">رایگان</span>
                                      ) : (
                                        formatPrice(m.cost)
                                      )}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    {m.description}
                                  </p>
                                  <p className="mt-1 text-[11px] text-slate-400">
                                    زمان تحویل: {m.eta}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </RadioGroup>
                        )}
                      />
                    </div>

                    <FormField id="note" label="توضیحات سفارش (اختیاری)" error={errors.note?.message}>
                      <Textarea
                        id="note"
                        placeholder="مثلاً: نیاز به دستگاه جایگزین دارم، یا ساعت تحویل مورد نظر..."
                        className="min-h-[80px] resize-none rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                        {...register("note")}
                      />
                    </FormField>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <Button type="button" variant="ghost" onClick={goBack} className="gap-2">
                      <ArrowRight size={16} />
                      بازگشت
                    </Button>
                    <Button type="button" onClick={goNext} className="gap-2 rounded-xl px-6">
                      ادامه
                      <ArrowLeft size={16} />
                    </Button>
                  </div>
                </section>
              )}

              {/* ------------------------ گام ۳: پرداخت ------------------------ */}
              {step === 3 && (
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                  <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                    <CreditCard size={20} className="text-primary" />
                    روش پرداخت
                  </h2>

                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup value={field.value} onValueChange={field.onChange}>
                        {paymentMethods.map((m) => (
                          <label
                            key={m.id}
                            htmlFor={`pay-${m.id}`}
                            className={cn(
                              "flex items-start gap-3 rounded-2xl border p-4 transition-all",
                              m.disabled
                                ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                                : field.value === m.id
                                  ? "cursor-pointer border-primary bg-primary/5"
                                  : "cursor-pointer border-slate-200 hover:border-slate-300",
                            )}
                          >
                            <RadioGroupItem
                              value={m.id}
                              id={`pay-${m.id}`}
                              disabled={m.disabled}
                              className="mt-0.5"
                            />
                            <div>
                              <span className="text-sm font-bold text-slate-900">{m.title}</span>
                              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                {m.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </RadioGroup>
                    )}
                  />

                  <div className="mt-6 flex items-start gap-2 rounded-xl bg-blue-50 p-4 text-xs leading-relaxed text-blue-800">
                    <Info size={16} className="mt-0.5 shrink-0" />
                    <span>
                      درگاه پرداخت اینترنتی هنوز فعال نشده است. روش پیشنهادی،
                      «کارت به کارت» است: در گام بعد شماره کارت مجموعه و فاکتور
                      نهایی را می‌بینید و پس از واریز، تصویر فیش را بارگذاری می‌کنید.
                    </span>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <Button type="button" variant="ghost" onClick={goBack} className="gap-2">
                      <ArrowRight size={16} />
                      بازگشت
                    </Button>
                    <Button type="button" onClick={goNext} className="gap-2 rounded-xl px-6">
                      بازبینی نهایی
                      <ArrowLeft size={16} />
                    </Button>
                  </div>
                </section>
              )}

              {/* -------------- گام ۴: فاکتور، واریز و ارسال فیش -------------- */}
              {step === 4 && (
                <section className="space-y-6">
                  {/* ---------------------- فاکتور ---------------------- */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                      <ReceiptText size={20} className="text-primary" />
                      فاکتور سفارش
                    </h2>

                    <ul className="divide-y divide-slate-100">
                      {lines.map((l) => (
                        <li key={l.product.id} className="flex items-start gap-3 py-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 tabular-nums">
                            {toPersianDigits(l.quantity)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-snug font-bold text-slate-900">
                              {l.product.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400">
                              {l.product.brand}
                            </p>
                          </div>
                          <span className="shrink-0 text-sm font-bold text-slate-900 tabular-nums">
                            {l.product.price === null
                              ? "استعلامی"
                              : formatPrice(l.product.price * l.quantity, false)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-slate-500">جمع اقلام</dt>
                        <dd className="font-bold text-slate-900 tabular-nums">
                          {formatPrice(subtotal, false)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">هزینه ارسال</dt>
                        <dd className="font-bold text-slate-900 tabular-nums">
                          {shippingCost === 0 ? "رایگان" : formatPrice(shippingCost, false)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-3">
                        <dt className="font-bold text-slate-900">مبلغ قابل پرداخت</dt>
                        <dd className="text-xl font-black text-primary tabular-nums">
                          {formatPrice(total)}
                        </dd>
                      </div>
                    </dl>

                    {quoteOnlyCount > 0 && (
                      <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
                        <Info size={14} className="mt-0.5 shrink-0" />
                        <span>
                          {toPersianDigits(quoteOnlyCount)} قلم از سفارش شما «استعلامی»
                          است و قیمتش در مبلغ بالا محاسبه نشده. کارشناسان ما قیمت
                          نهایی آن را جداگانه اعلام می‌کنند.
                        </span>
                      </p>
                    )}
                  </div>

                  {/* ------------- واریز کارت‌به‌کارت و فیش ------------- */}
                  {paymentMethodId === "transfer" && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                      <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-slate-900">
                        <CreditCard size={20} className="text-primary" />
                        واریز وجه
                      </h2>
                      <p className="mb-6 text-sm leading-relaxed text-slate-500">
                        مبلغ{" "}
                        <span className="font-bold text-slate-900">
                          {formatPrice(total)}
                        </span>{" "}
                        را به کارت زیر واریز کنید، سپس تصویر فیش را بارگذاری نمایید.
                      </p>

                      <BankCard />

                      <div className="mt-8">
                        <h3 className="mb-3 text-sm font-bold text-slate-900">
                          بارگذاری فیش واریزی
                        </h3>
                        <ReceiptUpload onChange={setReceipt} />
                      </div>
                    </div>
                  )}

                  {/* ---------------- خلاصه اطلاعات ارسال ---------------- */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                      <Check size={20} className="text-primary" />
                      تأیید اطلاعات
                    </h2>

                    <dl className="space-y-3 rounded-2xl bg-slate-50 p-5 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">گیرنده</dt>
                      <dd className="font-bold text-slate-900">
                        {watch("firstName")} {watch("lastName")}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">شماره تماس</dt>
                      <dd className="dir-ltr font-bold text-slate-900">{watch("phone")}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="shrink-0 text-slate-500">نشانی</dt>
                      <dd className="text-left leading-relaxed font-medium text-slate-900">
                        {watch("province")}، {watch("city")}، {watch("address")}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">روش ارسال</dt>
                      <dd className="font-bold text-slate-900">{selectedShipping?.title}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">روش پرداخت</dt>
                      <dd className="font-bold text-slate-900">
                        {paymentMethods.find((m) => m.id === watch("paymentMethod"))?.title}
                      </dd>
                    </div>
                    </dl>
                  </div>

                  {/* ---------------------- ثبت نهایی ---------------------- */}
                  <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button type="button" variant="ghost" onClick={goBack} className="gap-2">
                      <ArrowRight size={16} />
                      بازگشت
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 gap-2 rounded-xl bg-slate-900 px-8 font-bold text-white hover:bg-primary"
                    >
                      {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                      {paymentMethodId === "transfer"
                        ? "ثبت سفارش و ارسال فیش"
                        : "ثبت نهایی سفارش"}
                    </Button>
                  </div>

                  {paymentMethodId === "transfer" && !receipt && (
                    <p className="text-center text-xs text-slate-400 sm:text-right">
                      اگر فیش را الان در دسترس ندارید، می‌توانید سفارش را ثبت کنید و
                      تصویر فیش را بعداً برای ما بفرستید.
                    </p>
                  )}
                </section>
              )}
            </div>

            {/* --------------------------- خلاصه فاکتور --------------------------- */}
            <aside className="sticky top-32 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">خلاصه سفارش</h2>

              <div className="max-h-64 space-y-3 overflow-y-auto border-t border-slate-100 pt-4">
                {lines.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3 text-xs">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                      <Image
                        src={product.images[0]}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-contain p-1 mix-blend-multiply"
                      />
                    </div>
                    <span className="line-clamp-2 flex-1 text-slate-600">{product.name}</span>
                    <span className="shrink-0 text-slate-400">
                      ×{toPersianDigits(quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">جمع اقلام</span>
                  <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">هزینه ارسال</span>
                  <span className="font-bold text-slate-900">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600">رایگان</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
              </div>

              {quoteOnlyCount > 0 && (
                <p className="rounded-xl bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
                  {toPersianDigits(quoteOnlyCount)} قلم قیمت استعلامی دارد و در مبلغ زیر
                  محاسبه نشده است.
                </p>
              )}

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="font-bold text-slate-700">مبلغ قابل پرداخت</span>
                <span className="text-xl font-black text-slate-900">{formatPrice(total)}</span>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
