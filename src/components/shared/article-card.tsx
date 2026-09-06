import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import type { Article } from "@/lib/data/article-meta";
import { cn } from "@/lib/utils";

export function ArticleCard({
  article,
  className,
}: {
  article: Article;
  className?: string;
}) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[32px] border border-slate-100 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur">
            {article.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {article.date}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="flex items-center gap-1">
            <Clock size={12} /> {article.readTime}
          </span>
        </div>

        <h3 className="mb-3 line-clamp-2 text-xl leading-snug font-bold text-slate-800 transition-colors group-hover:text-primary">
          {article.title}
        </h3>

        <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4 text-sm font-bold text-slate-600 transition-colors group-hover:text-primary">
          <span>ادامه مطلب</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 transition-all group-hover:bg-primary group-hover:text-white">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
