"use client";

import Image from "next/image";
import Link from "next/link";
import { Repeat2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare, MAX_COMPARE } from "@/context/compare-context";
import { toPersianDigits } from "@/lib/format";

/** نوار شناور پایین صفحه که محصولات انتخاب‌شده برای مقایسه را نشان می‌دهد. */
export function CompareBar() {
  const { items, hydrated, remove, clear } = useCompare();

  if (!hydrated || items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 pr-1 text-sm font-bold text-slate-700">
          <Repeat2 size={18} className="text-primary" />
          <span className="hidden sm:inline">مقایسه</span>
          <span className="text-xs text-slate-400">
            {toPersianDigits(items.length)} از {toPersianDigits(MAX_COMPARE)}
          </span>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-2">
          {items.map((product) => (
            <div
              key={product.id}
              className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              title={product.name}
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="56px"
                className="object-contain p-1 mix-blend-multiply"
              />
              <button
                type="button"
                aria-label={`حذف ${product.name} از مقایسه`}
                onClick={() => remove(product.id)}
                className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-bl-lg bg-slate-900/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-slate-400 hover:text-rose-500"
          >
            پاک کردن
          </Button>
          <Button
            asChild
            size="sm"
            disabled={items.length < 2}
            className="rounded-xl bg-slate-900 px-5 text-white hover:bg-primary"
          >
            <Link href="/compare">
              {items.length < 2 ? "حداقل ۲ محصول" : "مقایسه کن"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
