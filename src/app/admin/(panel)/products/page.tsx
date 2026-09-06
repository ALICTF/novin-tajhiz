import Link from "next/link";
import Image from "next/image";
import { Package, Plus, Search } from "lucide-react";
import { listCategories, listProducts } from "@/lib/db/queries";
import { formatNumber, toPersianDigits } from "@/lib/format";
import {
  Badge,
  EmptyState,
  PageHeader,
  TableShell,
  Td,
  Th,
} from "@/components/admin/ui";
import { toggleProductPublishedAction } from "./actions";
import { cn } from "@/lib/utils";

type Search = {
  q?: string;
  category?: string;
  status?: string;
  page?: string;
};

const STATUS_FILTERS = [
  { value: "all", label: "همه" },
  { value: "published", label: "منتشرشده" },
  { value: "draft", label: "پیش‌نویس" },
  { value: "out-of-stock", label: "ناموجود" },
] as const;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const categoryId = params.category || undefined;
  const status = (STATUS_FILTERS.find((s) => s.value === params.status)?.value ??
    "all") as "all" | "published" | "draft" | "out-of-stock";
  const page = Math.max(1, Number(params.page) || 1);

  const [{ items, total, pageCount }, categories] = await Promise.all([
    listProducts({ search: q, categoryId, status, page, perPage: 20 }),
    listCategories(),
  ]);

  const buildHref = (next: Partial<Search>) => {
    const sp = new URLSearchParams();
    const merged = { q, category: categoryId, status, page: String(page), ...next };
    if (merged.q) sp.set("q", merged.q);
    if (merged.category) sp.set("category", merged.category);
    if (merged.status && merged.status !== "all") sp.set("status", merged.status);
    if (merged.page && merged.page !== "1") sp.set("page", merged.page);
    const qs = sp.toString();
    return `/admin/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="محصولات"
        description={`${toPersianDigits(total)} کالا`}
        action={
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary/90"
          >
            <Plus size={16} />
            افزودن محصول
          </Link>
        }
      />

      {/* ----------------------------- فیلترها ----------------------------- */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <Link
              key={f.value}
              href={buildHref({ status: f.value, page: "1" })}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                status === f.value
                  ? "bg-primary text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 ring-inset hover:bg-slate-100",
              )}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <Link
              href={buildHref({ category: undefined, page: "1" })}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                !categoryId
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500 ring-1 ring-slate-200 ring-inset hover:bg-slate-100",
              )}
            >
              همه دسته‌ها
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={buildHref({ category: c.id, page: "1" })}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  categoryId === c.id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500 ring-1 ring-slate-200 ring-inset hover:bg-slate-100",
                )}
              >
                {c.shortName}
              </Link>
            ))}
          </div>

          <form action="/admin/products" className="relative shrink-0">
            {categoryId && <input type="hidden" name="category" value={categoryId} />}
            {status !== "all" && <input type="hidden" name="status" value={status} />}
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            />
            <input
              name="q"
              defaultValue={q}
              placeholder="نام، برند یا کد کالا..."
              aria-label="جستجوی محصول"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pr-9 pl-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none sm:w-64"
            />
          </form>
        </div>
      </div>

      {/* ------------------------------ جدول ------------------------------ */}
      {items.length === 0 ? (
        <EmptyState
          icon={Package}
          title={q ? "محصولی پیدا نشد" : "هنوز محصولی ثبت نشده"}
          description={
            q
              ? "عبارت دیگری را امتحان کنید یا فیلترها را بردارید."
              : "اولین کالای کاتالوگ را اضافه کنید."
          }
          action={
            <Link
              href="/admin/products/new"
              className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white"
            >
              افزودن محصول
            </Link>
          }
        />
      ) : (
        <>
          <TableShell>
            <thead>
              <tr>
                <Th className="w-16" />
                <Th>محصول</Th>
                <Th>دسته</Th>
                <Th>قیمت</Th>
                <Th>وضعیت</Th>
                <Th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-slate-50">
                  <Td>
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      {p.images[0] && (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      )}
                    </div>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="font-medium text-slate-800 hover:text-primary"
                    >
                      {p.name}
                    </Link>
                    <span className="block text-[11px] text-slate-400">
                      {p.brand} · {p.sku}
                    </span>
                  </Td>
                  <Td className="whitespace-nowrap text-xs text-slate-500">
                    {p.categoryName}
                  </Td>
                  <Td className="whitespace-nowrap tabular-nums text-slate-700">
                    {p.price === null ? (
                      <span className="text-xs text-slate-400">تماس بگیرید</span>
                    ) : (
                      formatNumber(p.price)
                    )}
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      {p.published ? (
                        <Badge tone="emerald">منتشر شده</Badge>
                      ) : (
                        <Badge tone="amber">پیش‌نویس</Badge>
                      )}
                      {!p.inStock && <Badge tone="rose">ناموجود</Badge>}
                    </div>
                  </Td>
                  <Td>
                    <form action={toggleProductPublishedAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      >
                        {p.published ? "پنهان کن" : "منتشر کن"}
                      </button>
                    </form>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>

          {pageCount > 1 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildHref({ page: String(p) })}
                  className={cn(
                    "flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-bold tabular-nums transition-colors",
                    p === page
                      ? "bg-primary text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 ring-inset hover:bg-slate-100",
                  )}
                >
                  {toPersianDigits(p)}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
