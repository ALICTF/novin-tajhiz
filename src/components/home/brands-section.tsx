import Link from "next/link";
import { ArrowLeft, Factory } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getBrandCounts, getBrands } from "@/lib/db/public";
import { siteConfig } from "@/lib/data/site";
import { toPersianDigits } from "@/lib/format";

/**
 * برندهایی که قطعاتشان تأمین می‌شود.
 *
 * این بخش بیشتر از آنکه تزئینی باشد، کار سئو می‌کند. جست‌وجوهایی مثل
 * «قطعات سی‌پپ رزمد» یا «فیلتر فیلیپس ریسپیرونیکس» نیت خرید بالایی دارند و
 * تا قبل از این، اسم هیچ‌کدام از این برندها در متن صفحه اصلی نبود.
 *
 * هر کارت به `/products?brand=<نام>` لینک می‌شود. صفحه محصولات این پارامتر را
 * با searchParams.getAll("brand") می‌خواند، پس لینک‌ها واقعاً فیلتر می‌کنند و
 * صفحه‌های مقصد هم برای خزنده قابل دسترسی‌اند.
 *
 * برند خودِ مجموعه جداست: بزرگ‌ترین بخش کاتالوگ است و ساخت خودشان، پس در یک
 * کارت پهن‌تر و با متن متفاوت معرفی می‌شود نه در کنار برندهای وارداتی.
 */

/** توضیح یک‌خطی برندهای شناخته‌شده؛ برند ناشناس بدون توضیح نمایش داده می‌شود. */
const BRAND_NOTES: Record<string, string> = {
  ResMed: "قطعات و مصرفی دستگاه‌های اتوسی‌پپ و بای‌پپ رزمد",
  Philips: "اکسسوری آلیس و فیلتر دستگاه‌های ریسپیرونیکس",
  "Löwenstein": "موتور، برد و مخزن آب دستگاه‌های لوون‌اشتاین",
  Ventmed: "سنسور و اکسسوری دستگاه‌های تست خواب ونتمد",
  Nonin: "پراب و ماژول پالس اکسیمتری نونین",
  Dräger: "اکسسوری تجهیزات مانیتورینگ درگر",
  Grass: "الکترود و اکسسوری ثبت سیگنال",
  Skintact: "الکترود یک‌بارمصرف",
  Dormo: "چست‌لید و اقلام مصرفی تست خواب",
  Protec: "اکسسوری تجهیزات پایش",
  Weaver: "ژل و اقلام آماده‌سازی پوست",
};

export async function BrandsSection() {
  const [brands, counts] = await Promise.all([getBrands(), getBrandCounts()]);

  const own = siteConfig.name;
  const ownCount = counts[own] ?? 0;

  // برندهای وارداتی، پرتعدادترین اول — همان ترتیبی که برای خریدار مفید است.
  const external = brands
    .filter((b) => b !== own)
    .sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0));

  if (external.length === 0 && ownCount === 0) return null;

  return (
    <section className="reveal w-full bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 flex flex-col items-center space-y-4 text-center">
          <Badge
            variant="outline"
            className="rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-primary"
          >
            <Factory className="ml-2 h-3.5 w-3.5" />
            برندهای تحت پوشش
          </Badge>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            قطعات کدام دستگاه‌ها را داریم؟
          </h2>
          <p className="max-w-2xl leading-relaxed text-slate-500">
            دنبال قطعه یدکی یک برند مشخص هستید؟ روی همان برند بزنید تا مستقیم
            محصولات مربوط به آن را ببینید.
          </p>
        </div>

        {/* ---------------------- برند خودِ مجموعه ---------------------- */}
        {ownCount > 0 && (
          <Link
            href={`/products?brand=${encodeURIComponent(own)}`}
            className="group mb-5 flex flex-col gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-6 transition-colors hover:border-primary/40 hover:bg-primary/10 sm:flex-row sm:items-center sm:justify-between md:p-8"
          >
            <div>
              <h3 className="mb-2 text-xl font-black text-slate-900">
                ساخت نوین تجهیز
              </h3>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                بخش بزرگی از کاتالوگ، اکسسوری‌هایی است که خودمان طراحی و تولید
                می‌کنیم — از الکترود و کانولا تا سیم‌های رابط اختصاصی، سازگار با
                دستگاه‌های رایج آزمایشگاه‌های خواب کشور.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-transform group-hover:-translate-x-1">
              {toPersianDigits(ownCount)} محصول
              <ArrowLeft size={16} />
            </span>
          </Link>
        )}

        {/* ------------------------ برندهای دیگر ------------------------ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {external.map((brand) => (
            <Link
              key={brand}
              href={`/products?brand=${encodeURIComponent(brand)}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="min-w-0">
                <h3 className="mb-1 truncate text-base font-bold text-slate-900 transition-colors group-hover:text-primary">
                  {brand}
                </h3>
                <p className="truncate text-xs leading-relaxed text-slate-500">
                  {BRAND_NOTES[brand] ?? "قطعات و اکسسوری موجود"}
                </p>
              </div>

              <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-slate-400">
                {toPersianDigits(counts[brand] ?? 0)}
                <ArrowLeft
                  size={15}
                  className="text-slate-300 transition-all group-hover:-translate-x-1 group-hover:text-primary"
                />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">
          برند دستگاهتان در فهرست نیست؟ شماره مدل را برایمان بفرستید — بیشتر
          قطعات را می‌توانیم تأمین یا جایگزین سازگارش را پیشنهاد کنیم.
        </p>
      </div>
    </section>
  );
}
