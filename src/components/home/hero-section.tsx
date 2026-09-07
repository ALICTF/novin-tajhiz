import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustBand } from "@/components/home/trust-band";
import { primaryPhone } from "@/lib/data/site";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">

      {/* ---------------------------- تصویر پس‌زمینه ----------------------------
          تصویر تمام‌عرض است و متن رویش می‌نشیند. همچنان عنصر LCP صفحه است، پس
          priority دارد و هیچ انیمیشن ورودی رویش گذاشته نشده تا ثبت LCP عقب نیفتد. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/sleep.webp"
          alt="درمان آپنه خواب با دستگاه CPAP"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />

        {/*
          تصویر روشن است، پس بدون این لایه متن سفید خوانا نمی‌شود.
          گرادیان به‌جای رنگ تخت استفاده شده تا بالای کادر تیره‌تر بماند
          (زیر هدر شیشه‌ای) و وسط کمی از خود تصویر پیدا باشد.
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/92" />
      </div>

      {/* هدر ثابت است و ۹۶ پیکسل بالای صفحه را می‌پوشاند؛ pt جبرانش می‌کند. */}
      <div className="relative z-10 container mx-auto flex w-full max-w-7xl flex-col justify-center px-4 pt-32 pb-16 md:px-6 md:pt-40 md:pb-20 lg:min-h-[92vh]">

        {/* ------------------------------ متن ------------------------------ */}
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center md:gap-8">

          {/* نشان — روی زمینه تیره شیشه‌ای می‌شود */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 py-1.5 ps-1.5 pe-4 backdrop-blur-md">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white sm:h-8 sm:w-8">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold text-white sm:text-sm">
              مرکز تخصصی مهندسی پزشکی نوین تجهیز
            </span>
          </div>

          <h1 className="w-full text-[1.9rem] leading-[1.25] font-extrabold tracking-tight text-balance text-white sm:text-5xl md:text-6xl md:leading-[1.15] lg:text-7xl">
            تجربه خوابی آرام با{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 bg-clip-text text-transparent">
              تکنولوژی‌های پیشرفته پزشکی
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-pretty text-white/75 sm:text-base md:text-xl">
            مرجع تخصصی فروش، اجاره و تعمیرات دستگاه‌های{" "}
            <span className="font-bold text-white">CPAP</span> و{" "}
            <span className="font-bold text-white">BiPAP</span> و تجهیزات
            پلی‌سومنوگرافی در شرق کشور.
          </p>

          {/* اقدام */}
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-2 sm:w-auto sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-13 w-full gap-2 rounded-full px-8 text-base shadow-xl shadow-primary/25 transition-all duration-300 sm:h-14 sm:w-auto sm:px-10 sm:text-lg md:hover:-translate-y-1"
            >
              <Link href="/products">
                مشاهده محصولات
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 w-full gap-2 rounded-full border-white/25 bg-white/10 px-8 text-base text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-slate-900 sm:h-14 sm:w-auto sm:px-10 sm:text-lg md:hover:-translate-y-1"
            >
              <a href={`tel:${primaryPhone.tel}`}>
                <Phone className="h-5 w-5" />
                <span className="dir-ltr tabular-nums tracking-wide">
                  {primaryPhone.number}
                </span>
              </a>
            </Button>
          </div>

          {/* مزیت‌ها */}
          <div className="flex w-full flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium text-white/80 sm:gap-4 sm:text-sm md:gap-6 md:pt-4">
            {["تامین قطعات اورجینال", "مشاوره تخصصی رایگان", "گارانتی معتبر"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 backdrop-blur-md sm:gap-2 sm:px-3"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400 sm:h-4 sm:w-4" />
                  <span>{item}</span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* ردیف مراکز همکار، بدون خط جداکننده — بخشی از خود هیرو. */}
        <div className="mt-14 md:mt-20">
          <TrustBand tone="dark" />
        </div>
      </div>
    </section>
  );
}
