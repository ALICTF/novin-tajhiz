import Link from "next/link";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/icon-map";
import { categories, getCategoryCounts } from "@/lib/data/products";
import { toPersianDigits } from "@/lib/format";

export function CategoriesSection() {
  const counts = getCategoryCounts();

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-14 flex flex-col items-center space-y-4 text-center">
          <Badge
            variant="outline"
            className="rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-primary"
          >
            <LayoutGrid className="ml-2 h-3.5 w-3.5" />
            دسته‌بندی محصولات
          </Badge>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            دنبال چه چیزی می‌گردید؟
          </h2>
          <p className="max-w-2xl leading-relaxed text-slate-500">
            کاتالوگ ما در هفت دسته تخصصی سازمان‌دهی شده تا سریع‌تر به آنچه نیاز دارید
            برسید.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => {
            const Icon = getIcon(category.icon);
            // دسته اول کارت بزرگ‌تر می‌گیرد تا شبکه یکنواخت نباشد.
            const isWide = i === 0;

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:bg-white hover:shadow-xl ${
                  isWide ? "lg:col-span-2" : ""
                }`}
              >
                <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-primary">
                    {category.shortName}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
                    {category.description}
                  </p>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-xs text-slate-400">
                    {toPersianDigits(counts[category.id] ?? 0)} محصول
                  </span>
                  <ArrowLeft
                    size={18}
                    className="text-slate-300 transition-all group-hover:-translate-x-1 group-hover:text-primary"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
