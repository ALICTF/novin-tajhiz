"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, Info, Loader2, Save } from "lucide-react";
import {
  saveArticleAction,
  type ArticleFormState,
} from "@/app/admin/(panel)/articles/actions";
import { toPersianDigits } from "@/lib/format";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-300 focus:border-primary focus:outline-none";
const areaClass =
  "w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-800 placeholder:text-slate-300 focus:border-primary focus:outline-none";

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

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
    >
      {pending ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
      ذخیره مقاله
    </button>
  );
}

export type ArticleFormValues = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  readTime: string;
  image: string;
  tags: string[];
  isFeatured: boolean;
  published: boolean;
  blockCount: number;
};

export function ArticleForm({ article }: { article: ArticleFormValues }) {
  const [state, formAction] = useActionState<ArticleFormState, FormData>(
    saveArticleAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={article.id} />

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
        <div className="flex flex-col gap-5 lg:col-span-2">
          <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h3 className="text-sm font-bold text-slate-900">محتوا</h3>

            <Field label="عنوان">
              <input
                name="title"
                required
                defaultValue={article.title}
                className={inputClass}
              />
            </Field>

            <Field label="چکیده" hint="در کارت مقاله و نتایج جستجو دیده می‌شود.">
              <textarea
                name="excerpt"
                rows={3}
                defaultValue={article.excerpt}
                className={areaClass}
              />
            </Field>

            <Field label="تصویر شاخص" hint="مسیر فایل زیر پوشه public.">
              <input
                name="image"
                dir="ltr"
                defaultValue={article.image}
                placeholder="/images/blog/example.jpg"
                className={`${inputClass} text-left`}
              />
            </Field>
          </section>

          <p className="flex items-start gap-2.5 rounded-2xl bg-sky-50 px-4 py-3.5 text-xs leading-relaxed text-sky-800 ring-1 ring-sky-200 ring-inset">
            <Info size={15} className="mt-0.5 shrink-0" />
            <span>
              بدنه این مقاله {toPersianDigits(article.blockCount)} بلوک ساختاریافته
              دارد (پاراگراف، تیتر، لیست و نقل‌قول). ویرایشگر بدنه هنوز ساخته نشده،
              پس این بخش دست‌نخورده باقی می‌ماند و با ذخیره کردن فرم چیزی از آن
              حذف نمی‌شود.
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h3 className="text-sm font-bold text-slate-900">مشخصات</h3>

            <Field label="دسته">
              <input
                name="category"
                defaultValue={article.category}
                className={inputClass}
              />
            </Field>

            <Field label="نویسنده">
              <input
                name="author"
                defaultValue={article.author}
                className={inputClass}
              />
            </Field>

            <Field label="سمت نویسنده">
              <input
                name="authorRole"
                defaultValue={article.authorRole}
                className={inputClass}
              />
            </Field>

            <Field label="زمان مطالعه">
              <input
                name="readTime"
                defaultValue={article.readTime}
                placeholder="۵ دقیقه"
                className={inputClass}
              />
            </Field>

            <Field label="برچسب‌ها" hint="با ویرگول جدا کنید.">
              <input
                name="tags"
                defaultValue={article.tags.join("، ")}
                className={inputClass}
              />
            </Field>
          </section>

          <section className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h3 className="mb-2 text-sm font-bold text-slate-900">وضعیت</h3>

            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5">
              <input
                type="checkbox"
                name="published"
                defaultChecked={article.published}
                className="h-4 w-4 shrink-0 accent-[var(--primary)]"
              />
              <span className="text-xs font-medium text-slate-700">
                منتشر شده
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={article.isFeatured}
                className="h-4 w-4 shrink-0 accent-[var(--primary)]"
              />
              <span className="text-xs font-medium text-slate-700">
                مقاله شاخص
              </span>
            </label>
          </section>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SaveButton />
        <Link
          href="/admin/articles"
          className="rounded-xl px-5 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
        >
          انصراف
        </Link>
      </div>
    </form>
  );
}
