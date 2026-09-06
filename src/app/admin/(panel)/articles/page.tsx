import Link from "next/link";
import Image from "next/image";
import { FileText, Search } from "lucide-react";
import { listArticles } from "@/lib/db/queries";
import { toPersianDigits } from "@/lib/format";
import { formatOrderDate } from "@/lib/admin/format";
import {
  Badge,
  EmptyState,
  PageHeader,
  TableShell,
  Td,
  Th,
} from "@/components/admin/ui";
import { toggleArticlePublishedAction } from "./actions";

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const items = await listArticles({ search: q?.trim() || undefined });

  return (
    <>
      <PageHeader
        title="مقالات"
        description={`${toPersianDigits(items.length)} مطلب`}
        action={
          <form action="/admin/articles" className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            />
            <input
              name="q"
              defaultValue={q}
              placeholder="عنوان مقاله..."
              aria-label="جستجوی مقاله"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pr-9 pl-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none sm:w-56"
            />
          </form>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={q ? "مقاله‌ای پیدا نشد" : "هنوز مقاله‌ای ثبت نشده"}
          description="مطالب وبلاگ سایت از اینجا مدیریت می‌شوند."
        />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <Th className="w-16" />
              <Th>عنوان</Th>
              <Th>دسته</Th>
              <Th>نویسنده</Th>
              <Th>انتشار</Th>
              <Th>وضعیت</Th>
              <Th className="w-24" />
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="transition-colors hover:bg-slate-50">
                <Td>
                  <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    {a.image && (
                      <Image
                        src={a.image}
                        alt={a.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                </Td>
                <Td>
                  <Link
                    href={`/admin/articles/${a.id}`}
                    className="font-medium text-slate-800 hover:text-primary"
                  >
                    {a.title}
                  </Link>
                  <span className="mt-0.5 block max-w-md truncate text-[11px] text-slate-400">
                    {a.excerpt}
                  </span>
                </Td>
                <Td className="whitespace-nowrap text-xs text-slate-500">
                  {a.category}
                </Td>
                <Td className="whitespace-nowrap text-xs text-slate-500">
                  {a.author}
                </Td>
                <Td className="whitespace-nowrap text-xs text-slate-400">
                  {formatOrderDate(a.publishedAt)}
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1.5">
                    {a.published ? (
                      <Badge tone="emerald">منتشر شده</Badge>
                    ) : (
                      <Badge tone="amber">پیش‌نویس</Badge>
                    )}
                    {a.isFeatured && <Badge tone="sky">شاخص</Badge>}
                  </div>
                </Td>
                <Td>
                  <form action={toggleArticlePublishedAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <button
                      type="submit"
                      className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      {a.published ? "پنهان کن" : "منتشر کن"}
                    </button>
                  </form>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </>
  );
}
