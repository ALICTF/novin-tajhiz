import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shared/product-card";
import { getFeaturedProducts, products } from "@/lib/data/products";
import { toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

/** تعداد کارت داخل ریل افقی موبایل؛ بقیه فقط از عرض sm به بعد دیده می‌شوند. */
const MOBILE_VISIBLE = 6;

export function ProductShowcase() {
  const featured = getFeaturedProducts(8);

  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden border-t border-white bg-slate-50 py-16 md:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="absolute top-[10%] left-[10%] -z-10 h-96 w-96 rounded-full bg-blue-100/40 blur-[100px]" />
      <div className="absolute right-[10%] bottom-[10%] -z-10 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 flex flex-col items-center space-y-4 text-center md:mb-16 md:space-y-5">
          <Badge
            variant="outline"
            className="rounded-full border-primary/20 bg-white px-4 py-1.5 text-primary shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="ml-2 h-3.5 w-3.5 animate-pulse" />
            ویترین محصولات
          </Badge>
          <h2 className="text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            پرفروش‌ترین{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              تجهیزات تنفسی و خواب
            </span>
          </h2>
          <p className="max-w-2xl leading-relaxed text-slate-500 md:text-lg">
            منتخبی از دستگاه‌ها، ماسک‌ها و سنسورهای تخصصی با گارانتی رسمی و پشتیبانی فنی.
          </p>
        </div>

        {/*
          روی موبایل یک ریل افقی با snap است: کارت‌ها تک‌ستونه و بزرگ می‌مانند،
          ولی به‌جای هشت ردیف عمودی فقط یک ردیف کشیدنی می‌سازند. کارت بعدی
          عمداً کمی پیداست تا کاربر بفهمد می‌تواند بکشد.
          از عرض sm به بالا همین عنصر به شبکه معمولی تبدیل می‌شود — بدون جاوااسکریپت.
        */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 md:gap-6 lg:grid-cols-4">
          {featured.map((product, i) => (
            <div
              key={product.id}
              className={cn(
                "w-[78%] shrink-0 snap-start sm:w-auto sm:shrink",
                // بقیه فقط از تبلت به بعد لازم‌اند؛ روی موبایل ریل کوتاه می‌ماند.
                i >= MOBILE_VISIBLE && "hidden sm:block",
              )}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <p className="mt-3 text-center text-xs text-slate-400 sm:hidden">
          برای دیدن بقیه، انگشت خود را بکشید
        </p>

        <div className="mt-10 flex justify-center md:mt-16">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group h-14 w-full rounded-full border-2 border-slate-200 bg-white px-8 text-base text-slate-700 shadow-sm transition-all hover:border-primary hover:bg-primary/5 hover:text-primary sm:h-16 sm:w-auto sm:px-10 sm:text-lg"
          >
            <Link href="/products">
              <span className="sm:hidden">
                مشاهده همه {toPersianDigits(products.length)} محصول
              </span>
              <span className="hidden sm:inline">مشاهده کاتالوگ کامل</span>
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
