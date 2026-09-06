"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * فرم دیدگاه از react-hook-form و zod استفاده می‌کند (~۱۱۰ کیلوبایت gzip) ولی
 * داخل تبی است که به‌صورت پیش‌فرض باز نیست. با بارگذاری تنبل، صفحه محصول —
 * پربازدیدترین مسیر سایت — این حجم را در لود اولیه پرداخت نمی‌کند.
 */
const ReviewForm = dynamic(
  () => import("./review-form").then((m) => m.ReviewForm),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-4" aria-hidden="true">
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-40 rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-12 w-36 rounded-xl" />
      </div>
    ),
  },
);

export function ReviewFormLazy({ productName }: { productName: string }) {
  return <ReviewForm productName={productName} />;
}
