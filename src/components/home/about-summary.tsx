import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Phone, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { founder, primaryPhone, siteConfig } from "@/lib/data/site";
import { toPersianDigits } from "@/lib/format";

export function AboutSummary() {
  /** خلاصه‌ای از سوابق — جزئیات کامل در صفحه «درباره ما» است. */
  const facts = [
    { value: 1404 - founder.clinicalSince, label: "سال تجربه بالینی" },
    { value: 1404 - siteConfig.foundedYear, label: "سال فعالیت مجموعه" },
    { value: founder.affiliations.length, label: "مرکز درمانی همکار" },
  ];

  return (
    <section className="reveal relative overflow-hidden border-t border-white/5 bg-[#0B1120] py-16 text-white md:py-24">
      {/* پس‌زمینه */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/3 rounded-full glow [--glow-color:rgba(37,99,235,.16)]" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/3 translate-y-1/3 rounded-full glow [--glow-color:rgba(37,99,235,.16)]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* ------------------------- پرتره دایره‌ای ------------------------- */}
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative aspect-square w-full max-w-[21rem]">
              {/* حلقه بیرونی — چرخش بسیار آرام */}
              <div className="absolute inset-0 animate-spin rounded-full border border-dashed border-white/15 [animation-duration:32s] motion-reduce:animate-none" />
              {/* حلقه میانی ثابت */}
              <div className="absolute inset-[6%] rounded-full border border-white/10" />
              {/* هاله پشت تصویر */}
              <div className="absolute inset-[14%] rounded-full glow [--glow-color:rgba(37,99,235,.30)]" />

              {/* تصویر */}
              <div className="absolute inset-[11%] overflow-hidden rounded-full ring-1 ring-white/15">
                <Image
                  src={founder.photo}
                  alt={founder.name}
                  fill
                  sizes="(max-width: 1024px) 80vw, 336px"
                  className="object-cover object-top"
                  priority={false}
                />
              </div>

              {/* نشان مؤسس روی لبه حلقه */}
              <div className="absolute bottom-[8%] left-0 flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-[#0B1120]/90 px-3 py-1.5 backdrop-blur-md">
                <BadgeCheck size={14} className="text-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-300">
                  مؤسس مجموعه
                </span>
              </div>
            </div>
          </div>

          {/* --------------------------- محتوای خلاصه --------------------------- */}
          <div className="order-2 text-center lg:order-1 lg:text-right">
            <Badge
              variant="outline"
              className="mb-6 rounded-full border-primary/30 bg-primary/10 px-4 py-1.5 text-white backdrop-blur-md"
            >
              <Quote className="ml-2 h-3.5 w-3.5" fill="currentColor" />
              درباره مدیریت
            </Badge>

            <h2 className="mb-5 text-3xl leading-[1.25] font-black tracking-tight text-white md:text-4xl">
              تلفیق دانش{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                مهندسی
              </span>{" "}
              و تجربه{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                بالینی
              </span>
            </h2>

            <p className="mx-auto max-w-xl leading-loose font-light text-slate-400 lg:mx-0">
              {founder.intro}
            </p>

            {/* هویت */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-lg font-bold text-white">{founder.name}</p>
              <p className="mt-1 text-sm text-slate-400">
                {founder.role} • کارشناس ارشد مهندسی پزشکی
              </p>
            </div>

            {/* آمار فشرده */}
            <dl className="mt-7 flex items-center justify-center gap-6 sm:gap-10 lg:justify-start">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="sr-only">{fact.label}</dt>
                  <dd>
                    <span className="block text-2xl font-black text-white tabular-nums">
                      {toPersianDigits(fact.value)}+
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {fact.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            {/* اقدام */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button
                asChild
                className="group h-11 gap-2 rounded-xl bg-primary px-6 font-bold text-white hover:bg-primary/90"
              >
                <Link href="/about">
                  درباره ما
                  <ArrowLeft
                    size={16}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-11 gap-2 rounded-xl border-white/15 bg-white/5 px-5 text-white hover:border-primary hover:bg-primary"
              >
                <a href={`tel:${primaryPhone.tel}`}>
                  <Phone size={16} />
                  <span className="dir-ltr tabular-nums tracking-wide">
                    {primaryPhone.number}
                  </span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
