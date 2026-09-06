"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, Loader2, Save, Trash2, Upload } from "lucide-react";
import {
  saveProductAction,
  deleteProductAction,
  type ProductFormState,
} from "@/app/admin/(panel)/products/actions";
import type { AdminProduct } from "@/lib/db/types";

/**
 * فرم ساخت و ویرایش محصول.
 *
 * عمداً uncontrolled است: مقادیر با defaultValue ست می‌شوند و خواندنشان بر
 * عهده Server Action است. نه state ای هست که با هر کلید تایپ رندر دوباره
 * بسازد، نه کتابخانه فرمی وارد باندل می‌شود.
 */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-slate-700">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-300 focus:border-primary focus:outline-none";
const areaClass =
  "w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-800 placeholder:text-slate-300 focus:border-primary focus:outline-none";

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 shrink-0 accent-[var(--primary)]"
      />
      <span className="text-xs font-medium text-slate-700">{label}</span>
    </label>
  );
}

/**
 * فیلد تصاویر با آپلود.
 *
 * مسیرها همچنان قابل ویرایش دستی‌اند (برای تصاویری که از قبل در public
 * هستند)، ولی دکمه آپلود فایل را به سرور می‌فرستد و مسیر برگشتی را به
 * انتهای همان textarea اضافه می‌کند. عمداً state سنگین ندارد.
 */
function ImagesField({ defaultValue }: { defaultValue: string[] }) {
  const areaRef = React.useRef<HTMLTextAreaElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const onPick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);

        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const data = (await response.json()) as { url?: string; error?: string };

        if (!response.ok || !data.url) {
          setUploadError(data.error ?? "آپلود انجام نشد");
          break;
        }

        const area = areaRef.current;
        if (area) {
          const current = area.value.trim();
          area.value = current ? current + "\n" + data.url : data.url;
        }
      }
    } finally {
      setUploading(false);
      // ورودی خالی می‌شود تا انتخاب دوباره همان فایل هم رویداد بدهد.
      event.target.value = "";
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900">تصاویر</h3>

        <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-200">
          {uploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Upload size={14} />
          )}
          {uploading ? "در حال آپلود..." : "آپلود تصویر"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            hidden
            disabled={uploading}
            onChange={onPick}
          />
        </label>
      </div>

      {uploadError && (
        <p role="alert" className="text-[11px] font-medium text-rose-600">
          {uploadError}
        </p>
      )}

      <Field
        label="مسیر تصاویر"
        hint="هر خط یک مسیر. با دکمه بالا آپلود کنید یا مسیر فایل موجود را دستی بنویسید."
      >
        <textarea
          ref={areaRef}
          name="images"
          rows={3}
          dir="ltr"
          defaultValue={defaultValue.join("\n")}
          placeholder="/images/products/example.jpg"
          className={`${areaClass} text-left`}
        />
      </Field>
    </section>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
    >
      {pending ? (
        <Loader2 size={17} className="animate-spin" />
      ) : (
        <Save size={17} />
      )}
      ذخیره محصول
    </button>
  );
}

export function ProductForm({
  product,
  categories,
  brands,
}: {
  product?: AdminProduct;
  categories: { id: string; shortName: string }[];
  brands: string[];
}) {
  const [state, formAction] = useActionState<ProductFormState, FormData>(
    saveProductAction,
    {},
  );

  return (
    <div className="flex flex-col gap-5">
      <form action={formAction} className="flex flex-col gap-5">
        {product && <input type="hidden" name="id" value={product.id} />}

        {state.error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 ring-1 ring-rose-200 ring-inset"
          >
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {state.error}
          </p>
        )}

        <div className="grid gap-5 lg:grid-cols-3">
          {/* ------------------------ ستون اصلی ------------------------ */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <h3 className="text-sm font-bold text-slate-900">اطلاعات اصلی</h3>

              <Field label="نام محصول">
                <input
                  name="name"
                  required
                  defaultValue={product?.name}
                  placeholder="مثلاً: نازال کانولا تست خواب بلند"
                  className={inputClass}
                />
              </Field>

              <Field
                label="نشانی صفحه (slug)"
                hint="اگر خالی بگذارید از روی نام ساخته می‌شود."
              >
                <input
                  name="slug"
                  defaultValue={product?.slug}
                  placeholder="نازال-کانولا-تست-خواب-بلند"
                  className={inputClass}
                />
              </Field>

              <Field label="توضیح کوتاه" hint="در کارت محصول و نتایج جستجو دیده می‌شود.">
                <textarea
                  name="shortDescription"
                  rows={2}
                  defaultValue={product?.shortDescription}
                  className={areaClass}
                />
              </Field>

              <Field
                label="توضیحات کامل"
                hint="هر خط یک پاراگراف در صفحه محصول می‌شود."
              >
                <textarea
                  name="description"
                  rows={6}
                  defaultValue={product?.description.join("\n")}
                  className={areaClass}
                />
              </Field>
            </section>

            <ImagesField defaultValue={product?.images ?? []} />
          </div>

          {/* ------------------------ ستون کناری ------------------------ */}
          <div className="flex flex-col gap-5">
            <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <h3 className="text-sm font-bold text-slate-900">دسته و برند</h3>

              <Field label="دسته‌بندی">
                <select
                  name="categoryId"
                  defaultValue={product?.categoryId ?? categories[0]?.id}
                  className={inputClass}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.shortName}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="برند">
                <input
                  name="brand"
                  list="brand-options"
                  defaultValue={product?.brand}
                  placeholder="نوین تجهیز"
                  className={inputClass}
                />
                <datalist id="brand-options">
                  {brands.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </Field>

              <Field label="کد کالا (SKU)">
                <input
                  name="sku"
                  dir="ltr"
                  defaultValue={product?.sku}
                  placeholder="NT-1341"
                  className={`${inputClass} text-left`}
                />
              </Field>
            </section>

            <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <h3 className="text-sm font-bold text-slate-900">قیمت</h3>

              <Field
                label="قیمت (تومان)"
                hint="خالی بگذارید تا روی سایت «تماس بگیرید» نمایش داده شود."
              >
                <input
                  name="price"
                  inputMode="numeric"
                  defaultValue={product?.price ?? ""}
                  placeholder="۴۰۰۰۰۰۰۰"
                  className={inputClass}
                />
              </Field>

              <Field label="قیمت قبلی" hint="برای نمایش تخفیف. اختیاری.">
                <input
                  name="oldPrice"
                  inputMode="numeric"
                  defaultValue={product?.oldPrice ?? ""}
                  className={inputClass}
                />
              </Field>
            </section>

            <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <h3 className="text-sm font-bold text-slate-900">وضعیت</h3>
              <div className="flex flex-col gap-2">
                <Toggle
                  name="published"
                  label="منتشر شده (روی سایت دیده شود)"
                  defaultChecked={product?.published ?? true}
                />
                <Toggle
                  name="inStock"
                  label="موجود در انبار"
                  defaultChecked={product?.inStock ?? true}
                />
                <Toggle
                  name="isNew"
                  label="نشان «جدید»"
                  defaultChecked={product?.isNew ?? false}
                />
                <Toggle
                  name="isFeatured"
                  label="نمایش در صفحه اصلی"
                  defaultChecked={product?.isFeatured ?? false}
                />
              </div>

              <Field label="برچسب‌ها" hint="با ویرگول جدا کنید.">
                <input
                  name="tags"
                  defaultValue={product?.tags.join("، ")}
                  placeholder="کانولا، تست خواب، مصرفی"
                  className={inputClass}
                />
              </Field>
            </section>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SaveButton />
          <Link
            href="/admin/products"
            className="rounded-xl px-5 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
          >
            انصراف
          </Link>
        </div>
      </form>

      {/* حذف در فرم جدا است تا دکمه‌اش زیر submit فرم اصلی نیفتد. */}
      {product && (
        <form
          action={deleteProductAction}
          className="flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50/50 p-4"
        >
          <div>
            <p className="text-xs font-bold text-rose-800">حذف محصول</p>
            <p className="mt-0.5 text-[11px] text-rose-600">
              سفارش‌های قبلی خراب نمی‌شوند؛ نام و قیمت در فاکتور آن‌ها کپی شده است.
            </p>
          </div>
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-rose-700"
          >
            <Trash2 size={15} />
            حذف
          </button>
        </form>
      )}
    </div>
  );
}
