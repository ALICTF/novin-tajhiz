import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/shared/article-card";
import { getPublishedArticles } from "@/lib/db/public";
import { getLatestArticles } from "@/lib/catalog/articles";

export async function BlogSection() {
  const all = await getPublishedArticles();
  const articles = getLatestArticles(all, 3);

  return (
    <section className="border-none bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 flex flex-col items-center space-y-4 text-center md:mb-16">
          <Badge
            variant="secondary"
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-600 shadow-sm"
          >
            <BookOpen className="ml-2 h-3.5 w-3.5 text-primary" />
            مجله نوین تجهیز
          </Badge>

          <h2 className="text-3xl leading-[1.2] font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            دانستنی‌های تخصصی <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              خواب و تکنولوژی پزشکی
            </span>
          </h2>

          <p className="max-w-2xl text-lg leading-relaxed font-light text-slate-500">
            بررسی‌های تخصصی، اخبار پزشکی و راهنماهای کاربردی برای استفاده بهتر از تجهیزات.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="group h-12 gap-2 rounded-full border-slate-200 bg-transparent px-8 text-slate-500 transition-all hover:border-slate-400 hover:text-slate-900"
          >
            <Link href="/blog">
              مشاهده آرشیو مقالات
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
