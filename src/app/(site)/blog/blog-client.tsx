"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Hash, Search, UserCircle2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/shared/article-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import {
  articleCategories,
  getArticleCategoryCounts,
  getFeaturedArticle,
  searchArticles,
} from "@/lib/data/articles";
import { toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

const PER_PAGE = 6;
const categoryCounts = getArticleCategoryCounts();

export function BlogClient() {
  const [activeCategory, setActiveCategory] = React.useState<string>("همه مطالب");
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const featured = getFeaturedArticle();

  const results = React.useMemo(
    () => searchArticles(query, activeCategory),
    [query, activeCategory],
  );

  // مقاله شاخص فقط وقتی جدا نمایش داده می‌شود که فیلتری فعال نباشد.
  const noFilters = !query && activeCategory === "همه مطالب";
  const listed = noFilters ? results.filter((a) => a.id !== featured.id) : results;

  const totalPages = Math.max(1, Math.ceil(listed.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = listed.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  React.useEffect(() => setPage(1), [query, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ------------------------------ سربرگ ------------------------------ */}
      <section className="border-b border-slate-200 bg-white pt-32 pb-12">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="space-y-4 text-center md:text-right">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                مجله تخصصی <span className="text-primary">نوین تجهیز</span>
              </h1>
              <p className="text-lg font-light text-slate-500">
                مرجع علمی مقالات خواب و تنفس
              </p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو در مقالات..."
                aria-label="جستجو در مقالات"
                className="h-14 rounded-2xl border-slate-200 bg-slate-50 pr-12 pl-10 text-base shadow-sm focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
              {query && (
                <button
                  type="button"
                  aria-label="پاک کردن جستجو"
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 hover:text-rose-500"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* دسته‌بندی‌ها */}
          <div className="scrollbar-hide mt-10 flex items-center gap-3 overflow-x-auto pb-4">
            {articleCategories.map((cat) => {
              const count =
                cat === "همه مطالب"
                  ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
                  : (categoryCounts[cat] ?? 0);
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold whitespace-nowrap transition-all duration-300",
                    activeCategory === cat
                      ? "scale-105 border-slate-900 bg-slate-900 text-white shadow-lg"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-800",
                  )}
                >
                  {cat}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[10px]",
                      activeCategory === cat ? "bg-white/20" : "bg-slate-100",
                    )}
                  >
                    {toPersianDigits(count)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto mt-12 max-w-7xl px-4 md:px-6">
        {/* --------------------------- مقاله شاخص --------------------------- */}
        {noFilters && (
          <Link href={`/blog/${featured.slug}`} className="group relative mb-16 block">
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[40px] shadow-2xl md:aspect-[21/8]">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

              <div className="absolute right-0 bottom-0 w-full p-6 md:max-w-3xl md:p-12">
                <Badge className="mb-4 bg-primary px-3 py-1 text-white hover:bg-primary">
                  {featured.category}
                </Badge>
                <h2 className="mb-4 text-2xl leading-tight font-black text-white transition-colors group-hover:text-blue-200 md:text-5xl">
                  {featured.title}
                </h2>
                <p className="mb-6 line-clamp-2 text-lg text-slate-300 md:line-clamp-none">
                  {featured.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400">
                  <span className="flex items-center gap-2">
                    <UserCircle2 size={18} />
                    {featured.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={18} />
                    {featured.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={18} />
                    {featured.readTime} مطالعه
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ----------------------------- فهرست ----------------------------- */}
        {visible.length === 0 ? (
          <EmptyState
            icon={Search}
            title="مقاله‌ای یافت نشد"
            description="عبارت دیگری جستجو کنید یا دسته‌بندی را تغییر دهید."
          >
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setActiveCategory("همه مطالب");
              }}
            >
              نمایش همه مقالات
            </Button>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        <Pagination
          className="mt-16"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 300, behavior: "smooth" });
          }}
        />

        {/* ---------------------------- خبرنامه ---------------------------- */}
        <section className="relative mt-24 overflow-hidden rounded-[40px] bg-slate-900 p-8 text-center md:p-16">
          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-primary">
              <Hash size={32} />
            </div>
            <h2 className="text-3xl font-black text-white md:text-4xl">
              عضویت در خبرنامه علمی
            </h2>
            <p className="text-lg text-slate-400">
              جدیدترین مقالات و تخفیف‌های ویژه تجهیزات را در ایمیل خود دریافت کنید.
            </p>
            <NewsletterForm variant="dark" className="mx-auto max-w-md" />
          </div>
        </section>
      </div>
    </div>
  );
}
