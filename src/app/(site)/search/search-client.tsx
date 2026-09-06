"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, Package, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/shared/product-card";
import { ArticleCard } from "@/components/shared/article-card";
import { filterProducts } from "@/lib/catalog/filter";
import { searchArticles } from "@/lib/catalog/articles";
import type { ProductSummary } from "@/lib/data/catalog-meta";
import type { Article } from "@/lib/data/article-meta";
import { toPersianDigits } from "@/lib/format";

const SUGGESTIONS = ["CPAP", "ماسک", "الکترود", "اکسیژن‌ساز", "فیلتر", "آپنه خواب"];

export function SearchClient({
  products,
  articles,
}: {
  products: ProductSummary[];
  articles: Article[];
}) {
  const router = useRouter();
  const query = (useSearchParams().get("q") ?? "").trim();
  const [input, setInput] = React.useState(query);

  React.useEffect(() => setInput(query), [query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    router.replace(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  const productResults = React.useMemo(
    () => (query ? filterProducts(products, { query, sort: "available" }) : []),
    [products, query],
  );
  const articleResults = React.useMemo(
    () => (query ? searchArticles(articles, query) : []),
    [articles, query],
  );
  const total = productResults.length + articleResults.length;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <Breadcrumbs items={[{ label: "جستجو" }]} className="mb-6" />

        <div className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-900">
            جستجو در سایت
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            هم‌زمان در میان محصولات فروشگاه و مقالات مجله جستجو می‌شود.
          </p>

          <form onSubmit={submit} className="relative">
            <Search className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="نام محصول، برند یا موضوع مقاله..."
              aria-label="عبارت جستجو"
              className="h-14 rounded-2xl border-slate-200 bg-slate-50 pr-12 pl-28 text-base focus:bg-white"
            />
            {input && (
              <button
                type="button"
                aria-label="پاک کردن"
                onClick={() => setInput("")}
                className="absolute top-1/2 left-24 -translate-y-1/2 text-slate-400 hover:text-rose-500"
              >
                <X size={18} />
              </button>
            )}
            <Button
              type="submit"
              className="absolute top-1/2 left-2 h-10 -translate-y-1/2 rounded-xl px-5"
            >
              جستجو
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">جستجوهای پرتکرار:</span>
            {SUGGESTIONS.map((s) => (
              <Link
                key={s}
                href={`/search?q=${encodeURIComponent(s)}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 transition-colors hover:border-primary/40 hover:text-primary"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        {!query ? (
          <EmptyState
            icon={Search}
            title="عبارتی برای جستجو وارد کنید"
            description="نام محصول، برند یا موضوع مورد نظرتان را در کادر بالا بنویسید."
          />
        ) : total === 0 ? (
          <EmptyState
            icon={Search}
            title={`نتیجه‌ای برای «${query}» پیدا نشد`}
            description="املای عبارت را بررسی کنید یا کلمه کلیدی کوتاه‌تری امتحان کنید. کارشناسان ما هم آماده راهنمایی شما هستند."
          >
            <Button asChild className="rounded-xl">
              <Link href="/products">مرور همه محصولات</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/contact">تماس با کارشناس</Link>
            </Button>
          </EmptyState>
        ) : (
          <>
            <p className="mb-6 text-sm text-slate-500">
              <span className="font-bold text-slate-900">{toPersianDigits(total)}</span>{" "}
              نتیجه برای «<span className="font-bold text-slate-900">{query}</span>»
            </p>

            <Tabs defaultValue={productResults.length > 0 ? "products" : "articles"}>
              <TabsList className="mb-8 h-auto rounded-full bg-slate-100 p-1.5">
                <TabsTrigger
                  value="products"
                  className="gap-2 rounded-full px-6 py-2.5 font-bold text-slate-600 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <Package size={16} />
                  محصولات ({toPersianDigits(productResults.length)})
                </TabsTrigger>
                <TabsTrigger
                  value="articles"
                  className="gap-2 rounded-full px-6 py-2.5 font-bold text-slate-600 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <FileText size={16} />
                  مقالات ({toPersianDigits(articleResults.length)})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                {productResults.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="محصولی مطابق این جستجو نبود"
                    description="شاید در بخش مقالات نتیجه‌ای پیدا کنید."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {productResults.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="articles">
                {articleResults.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="مقاله‌ای مطابق این جستجو نبود"
                    description="شاید در بخش محصولات نتیجه‌ای پیدا کنید."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {articleResults.map((a) => (
                      <ArticleCard key={a.id} article={a} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
