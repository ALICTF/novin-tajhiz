import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/icon-map";
import { getCategories, getCategoryCounts } from "@/lib/db/public";
import { toPersianDigits } from "@/lib/format";
import type { CategoryId } from "@/lib/data/catalog-meta";

/**
 * بخش «معرفی محصولات» صفحه اصلی.
 *
 * قبلاً این بخش یک شبکه فشرده از دسته‌ها بود؛ حالا هر خط یک دسته را واقعاً
 * *معرفی* می‌کند: عکس، متن معرفی، سه قلم شاخص و یک دکمه اقدام مخصوص همان دسته.
 *
 * چرا متن معرفی اینجاست و نه در دیتابیس؟ فیلد `description` دسته در دیتابیس یک
 * جمله کوتاه برای کارت و منو است. متن معرفیِ صفحه اصلی لحن بازاریابی دارد و
 * طولانی‌تر است؛ ریختنش در همان فیلد، جاهای دیگر سایت را خراب می‌کرد. اگر
 * ادمین دسته تازه‌ای بسازد که اینجا کلید ندارد، خودکار به همان توضیح دیتابیس
 * برمی‌گردد و بدون عکس ولی سالم نمایش داده می‌شود.
 */

type Intro = {
  /** متن معرفی — دو تا سه جمله. */
  lead: string;
  /** سه قلم شاخصِ همان دسته، از روی کاتالوگ واقعی. */
  highlights: string[];
  /** متن دکمه؛ عمداً برای هر دسته متفاوت است تا کلیشه‌ای نشود. */
  cta: string;
  image: string;
};

const INTROS: Record<CategoryId, Intro> = {
  polysomnography: {
    lead: "دقتِ تشخیص آپنه خواب به کیفیت سیگنالی بستگی دارد که ثبت می‌شود. سنسورها، پراب‌ها و قطعات یدکی دستگاه‌های تست خواب فیلیپس آلیس، ونتمد و رزمد را با تضمین اصالت تأمین می‌کنیم.",
    highlights: [
      "پراب پالس اکسیمتر نونین و سازگار",
      "سنسور جریان هوا و تلاش تنفسی",
      "قطعات یدکی آلیس، ونتمد و رزمد",
    ],
    cta: "مشاهده تجهیزات پلی‌سومنوگرافی",
    image: "/images/categories/polysomnography.jpg",
  },
  consumables: {
    lead: "اقلامی که هر شب مصرف می‌شوند و تمام شدنشان یعنی تعطیلی تست. کلینیک‌های خواب سراسر کشور موجودی مصرفی‌شان را از ما تأمین می‌کنند تا هیچ شبی بدون تست نماند.",
    highlights: [
      "نازال کانولا تست خواب، کوتاه و بلند",
      "چست‌لید دورمو در بسته‌های ۵۰ عددی",
      "ژل اسکراب، الکترود و لوازم یک‌بارمصرف",
    ],
    cta: "سفارش اقلام مصرفی",
    image: "/images/categories/consumables.jpg",
  },
  eeg: {
    lead: "الکترود، کلاه، ژل و اکسسوری ثبت EEG با کیفیت آزمایشگاهی — به‌همراه تجهیزات نوروفیدبک و CES برای مراکز درمانی و مطب‌های تخصصی.",
    highlights: [
      "الکترود گلد و نقره با سیم استاندارد",
      "گیره گوش CES کربنی و فلزی",
      "پد فیزیوتراپی و سیم‌های رابط",
    ],
    cta: "مشاهده اکسسوری نوار مغز",
    image: "/images/categories/eeg.jpg",
  },
  pap: {
    lead: "وقتی CPAP یا BiPAP بیمار از کار می‌افتد، درمانش متوقف می‌شود. قطعات یدکی و مصرفی دستگاه‌های لوون‌اشتاین، رزمد و فیلیپس را موجود داریم تا دستگاه سریع به چرخه برگردد.",
    highlights: [
      "موتور و مین‌برد اتوسی‌پپ",
      "مخزن آب، فیلتر و لوله خرطومی",
      "ال‌سی‌دی، آداپتور و برد تغذیه",
    ],
    cta: "مشاهده قطعات CPAP و BiPAP",
    image: "/images/categories/pap.jpg",
  },
  "health-care": {
    lead: "اقلام پایش بیمار و مراقبت سلامت برای استفاده خانگی و درمانگاهی، از فیلتر دستگاه تا سنسور تلاش تنفسی.",
    highlights: [
      "فیلتر سی‌پپ و بای‌پپ همه برندها",
      "سنسور اپنه‌لینک رزمد",
      "الکترود گیره‌ای و اقلام پایش",
    ],
    cta: "مشاهده محصولات مراقبت سلامت",
    image: "/images/categories/health-care.jpg",
  },
};

export async function CategoriesSection() {
  const [categories, counts] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
  ]);

  const total = categories.reduce((sum, c) => sum + (counts[c.id] ?? 0), 0);

  return (
    <section className="w-full bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="reveal mb-16 flex flex-col items-center space-y-4 text-center md:mb-20">
          <Badge
            variant="outline"
            className="rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-primary"
          >
            <Package className="ml-2 h-3.5 w-3.5" />
            معرفی محصولات
          </Badge>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            چه چیزهایی تأمین می‌کنیم؟
          </h2>
          <p className="max-w-2xl leading-relaxed text-slate-500">
            {toPersianDigits(total)} قلم تجهیزات و قطعات تخصصی خواب و تنفس، در{" "}
            {toPersianDigits(categories.length)} خط محصول. هر کدام را جداگانه
            معرفی کرده‌ایم تا بدانید دقیقاً چه چیزی از ما می‌خواهید.
          </p>
        </div>

        <div className="flex flex-col gap-20 md:gap-28">
          {categories.map((category, i) => {
            const Icon = getIcon(category.icon);
            const intro = INTROS[category.id as CategoryId];
            const count = counts[category.id] ?? 0;
            // خط‌های زوج، عکس را آن‌طرف می‌برند تا صفحه یکنواخت نشود.
            const flipped = i % 2 === 1;

            return (
              <article
                key={category.id}
                className="reveal grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                {/* ------------------------- عکس ------------------------- */}
                <div className={flipped ? "lg:order-2" : undefined}>
                  <div className="group relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
                    {intro ? (
                      <Image
                        src={intro.image}
                        alt={category.name}
                        width={1600}
                        height={1200}
                        // دو ستونی از lg به بالا، تک‌ستونی در موبایل.
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      // دسته‌ای که ادمین بعداً ساخته و عکس ندارد.
                      <div className="flex aspect-[4/3] w-full items-center justify-center bg-slate-100">
                        <Icon size={56} strokeWidth={1} className="text-slate-300" />
                      </div>
                    )}

                    {/* شماره خط محصول، روی عکس */}
                    <span className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-sm font-black text-primary shadow-sm backdrop-blur-sm">
                      {toPersianDigits(i + 1)}
                    </span>
                  </div>
                </div>

                {/* ------------------------- متن ------------------------- */}
                <div className={flipped ? "lg:order-1" : undefined}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon size={24} strokeWidth={1.5} />
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {toPersianDigits(count)} محصول موجود
                    </span>
                  </div>

                  <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                    {category.name}
                  </h3>

                  <p className="mb-6 leading-loose text-slate-600">
                    {intro?.lead ?? category.description}
                  </p>

                  {intro && (
                    <ul className="mb-8 flex flex-col gap-3">
                      {intro.highlights.map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <Check size={12} strokeWidth={3} />
                          </span>
                          <span className="text-sm text-slate-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={`/products?category=${category.id}`}
                    className="group/cta inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                  >
                    {intro?.cta ?? `مشاهده ${category.shortName}`}
                    <ArrowLeft
                      size={17}
                      className="transition-transform group-hover/cta:-translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
