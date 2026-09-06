import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { getArticleById } from "@/lib/db/queries";
import { PageHeader } from "@/components/admin/ui";
import { ArticleForm } from "@/components/admin/article-form";
import { toPersianDigits } from "@/lib/format";

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);

  const article = await getArticleById(Number(id));
  if (!article) notFound();

  return (
    <>
      <Link
        href="/admin/articles"
        className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowRight size={15} />
        بازگشت به مقالات
      </Link>

      {saved && (
        <p className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 ring-inset">
          <CheckCircle2 size={15} />
          تغییرات ذخیره شد
        </p>
      )}

      <PageHeader
        title={article.title}
        description={`${toPersianDigits(article.body.length)} بلوک محتوا`}
        action={
          article.published ? (
            <a
              href={`/blog/${article.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 ring-inset transition-colors hover:bg-slate-100"
            >
              <ExternalLink size={15} />
              مشاهده در سایت
            </a>
          ) : null
        }
      />

      <ArticleForm
        article={{
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          category: article.category,
          author: article.author,
          authorRole: article.authorRole,
          readTime: article.readTime,
          image: article.image,
          tags: article.tags,
          isFeatured: article.isFeatured,
          published: article.published,
          blockCount: article.body.length,
        }}
      />
    </>
  );
}
