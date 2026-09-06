import Link from "next/link";
import Image from "next/image";
import { MessageSquareQuote, Star, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db/client";
import { toPersianDigits } from "@/lib/format";
import { formatRelative } from "@/lib/admin/format";
import { Badge, EmptyState, PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import {
  deleteReviewAction,
  toggleReviewPublishedAction,
  toggleReviewVerifiedAction,
} from "./actions";

type Search = { status?: string };

const FILTERS = [
  { value: "pending", label: "در انتظار تأیید" },
  { value: "published", label: "منتشرشده" },
  { value: "all", label: "همه" },
] as const;

/** JSON.parse امن — رکورد خراب نباید کل صفحه را بیندازد. */
function firstImage(raw: string): string {
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? (list[0] ?? "") : "";
  } catch {
    return "";
  }
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const status =
    FILTERS.find((f) => f.value === params.status)?.value ?? "pending";

  const where =
    status === "pending"
      ? { published: false }
      : status === "published"
        ? { published: true }
        : {};

  const [reviews, pendingCount] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: [{ published: "asc" }, { createdAt: "desc" }],
      take: 100,
      include: {
        product: { select: { id: true, name: true, slug: true, images: true } },
      },
    }),
    prisma.review.count({ where: { published: false } }),
  ]);

  return (
    <>
      <PageHeader
        title="دیدگاه‌ها"
        description={
          pendingCount > 0
            ? `${toPersianDigits(pendingCount)} دیدگاه در انتظار تأیید`
            : "دیدگاه تأییدنشده‌ای وجود ندارد"
        }
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={
              f.value === "pending" ? "/admin/reviews" : `/admin/reviews?status=${f.value}`
            }
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
              status === f.value
                ? "bg-primary text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 ring-inset hover:bg-slate-100",
            )}
          >
            {f.label}
            {f.value === "pending" && pendingCount > 0 && (
              <span className="mr-1.5 tabular-nums">
                ({toPersianDigits(pendingCount)})
              </span>
            )}
          </Link>
        ))}
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquareQuote}
          title={
            status === "pending"
              ? "دیدگاه تازه‌ای نیست"
              : "دیدگاهی وجود ندارد"
          }
          description="دیدگاه‌هایی که کاربران در صفحه محصول ثبت می‌کنند اینجا می‌آیند و تا وقتی تأیید نشوند روی سایت دیده نمی‌شوند."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => {
            const image = firstImage(review.product.images);

            return (
              <article
                key={review.id}
                className={cn(
                  "rounded-2xl border bg-white p-4 sm:p-5",
                  review.published
                    ? "border-slate-200"
                    : "border-amber-300/60 bg-amber-50/30",
                )}
              >
                {/* --------------------------- سربرگ --------------------------- */}
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      {image && (
                        <Image
                          src={image}
                          alt={review.product.name}
                          fill
                          sizes="44px"
                          className="object-contain p-1"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/admin/products/${review.product.id}`}
                        className="block truncate text-xs font-bold text-slate-800 hover:text-primary"
                      >
                        {review.product.name}
                      </Link>
                      <span className="text-[11px] text-slate-400">
                        {review.user} · {formatRelative(review.createdAt.toISOString())}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* امتیاز */}
                    <span
                      className="flex items-center gap-0.5"
                      aria-label={`امتیاز ${review.rating} از ۵`}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={13}
                          className={
                            n <= review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }
                        />
                      ))}
                    </span>

                    {review.published ? (
                      <Badge tone="emerald">منتشر شده</Badge>
                    ) : (
                      <Badge tone="amber">در انتظار</Badge>
                    )}
                    {review.verified && <Badge tone="sky">خریدار تأییدشده</Badge>}
                  </div>
                </div>

                {/* ---------------------------- متن ---------------------------- */}
                <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700">
                  {review.text}
                </p>

                {/* --------------------------- اقدام‌ها --------------------------- */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                  <form action={toggleReviewPublishedAction}>
                    <input type="hidden" name="id" value={review.id} />
                    <button
                      type="submit"
                      className={cn(
                        "rounded-lg px-3 py-2 text-[11px] font-bold transition-colors",
                        review.published
                          ? "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          : "bg-emerald-600 text-white hover:bg-emerald-700",
                      )}
                    >
                      {review.published ? "لغو انتشار" : "تأیید و انتشار"}
                    </button>
                  </form>

                  <form action={toggleReviewVerifiedAction}>
                    <input type="hidden" name="id" value={review.id} />
                    <button
                      type="submit"
                      className="rounded-lg px-3 py-2 text-[11px] font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      {review.verified
                        ? "برداشتن نشان خریدار"
                        : "نشان‌گذاری خریدار واقعی"}
                    </button>
                  </form>

                  <form action={deleteReviewAction} className="mr-auto">
                    <input type="hidden" name="id" value={review.id} />
                    <button
                      type="submit"
                      aria-label="حذف دیدگاه"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
