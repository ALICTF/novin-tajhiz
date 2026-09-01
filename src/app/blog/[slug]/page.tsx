import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Calendar, Clock, Info, ListOrdered,
  Quote, Tag, UserCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ArticleCard } from "@/components/shared/article-card";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import {
  articles,
  getArticle,
  getArticleHeadings,
  getRelatedArticles,
} from "@/lib/data/articles";
import { ShareButtons } from "./share-buttons";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "مقاله یافت نشد" };

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      authors: [article.author],
      tags: article.tags,
      images: [{ url: article.image }],
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const headings = getArticleHeadings(article);
  const related = getRelatedArticles(article);

  return (
    <article className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: "وبلاگ", href: "/blog" }, { label: article.title }]}
        />

        {/* ------------------------------ سربرگ ------------------------------ */}
        <header className="mx-auto mb-10 max-w-4xl text-center">
          <Badge className="mb-5 bg-primary px-4 py-1.5 text-white hover:bg-primary">
            {article.category}
          </Badge>
          <h1 className="mb-6 text-3xl leading-tight font-black text-slate-900 md:text-5xl">
            {article.title}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-500">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <UserCircle2 size={18} />
              {article.author}
              <span className="text-xs text-slate-300">({article.authorRole})</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={18} />
              {article.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={18} />
              {article.readTime} مطالعه
            </span>
          </div>
        </header>

        {/* ------------------------------ تصویر ------------------------------ */}
        <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-[40px] shadow-2xl">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* ---------------------------- محتوای مقاله ---------------------------- */}
          <div className="lg:col-span-8">
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm md:p-12">
              <div className="space-y-6 text-justify leading-loose">
                {article.body.map((block, i) => {
                  switch (block.type) {
                    case "heading":
                      return (
                        <h2
                          key={i}
                          id={block.id}
                          className="scroll-mt-32 border-r-4 border-primary pr-4 pt-6 text-2xl font-black text-slate-900"
                        >
                          {block.text}
                        </h2>
                      );

                    case "paragraph":
                      return (
                        <p key={i} className="text-slate-600">
                          {block.text}
                        </p>
                      );

                    case "list":
                      return (
                        <ul key={i} className="space-y-3">
                          {block.items.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-slate-600">
                              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      );

                    case "quote":
                      return (
                        <blockquote
                          key={i}
                          className="relative rounded-3xl bg-slate-50 p-6 pr-14 md:p-8 md:pr-16"
                        >
                          <Quote
                            className="absolute top-6 right-5 text-primary/30"
                            size={28}
                            fill="currentColor"
                          />
                          <p className="text-lg leading-relaxed font-medium text-slate-700">
                            {block.text}
                          </p>
                          {block.source && (
                            <footer className="mt-4 text-sm text-slate-400">
                              — {block.source}
                            </footer>
                          )}
                        </blockquote>
                      );

                    case "callout":
                      return (
                        <aside
                          key={i}
                          className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5"
                        >
                          <Info size={20} className="mt-0.5 shrink-0 text-blue-600" />
                          <div className="text-blue-900">
                            <p className="mb-1 font-bold">{block.title}</p>
                            <p className="text-sm leading-relaxed">{block.text}</p>
                          </div>
                        </aside>
                      );
                  }
                })}
              </div>

              {/* برچسب‌ها و اشتراک‌گذاری */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-slate-100 pt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag size={16} className="text-slate-400" />
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>

                <ShareButtons title={article.title} />
              </div>
            </div>

            {/* کارت نویسنده */}
            <div className="mt-8 flex items-center gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <UserCircle2 size={36} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-slate-900">{article.author}</p>
                <p className="mt-0.5 text-sm text-primary">{article.authorRole}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  محتوای این مقاله توسط تیم تخصصی نوین تجهیز تهیه و بازبینی شده است.
                </p>
              </div>
            </div>
          </div>

          {/* ------------------------------ ستون کناری ------------------------------ */}
          <aside className="space-y-6 lg:col-span-4">
            {headings.length > 0 && (
              <nav
                aria-label="فهرست مطالب"
                className="sticky top-32 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                  <ListOrdered size={18} className="text-primary" />
                  فهرست مطالب
                </h2>
                <ol className="space-y-1 text-sm">
                  {headings.map((h, i) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="flex items-start gap-2 rounded-lg px-2 py-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary"
                      >
                        <span className="text-xs text-slate-300">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="leading-relaxed">{h.text}</span>
                      </a>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <p className="mb-3 text-xs leading-relaxed text-slate-500">
                    مطالب تازه را در ایمیل خود دریافت کنید.
                  </p>
                  <NewsletterForm />
                </div>
              </nav>
            )}
          </aside>
        </div>

        {/* --------------------------- مقالات مرتبط --------------------------- */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
                مطالب مرتبط
              </h2>
              <Link
                href="/blog"
                className="flex shrink-0 items-center gap-1 text-sm font-bold text-primary transition-all hover:gap-2"
              >
                همه مقالات <ArrowLeft size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
