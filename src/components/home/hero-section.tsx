import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Wrench, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrustBand } from "@/components/home/trust-band";

export function HeroSection() {
  return (
    // هدر ثابت است و ۹۶ پیکسل بالای صفحه را می‌پوشاند؛ pt-28 همان فاصله را جبران می‌کند.
    <section className="relative w-full lg:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-slate-50 pt-28 pb-14 md:pt-32 md:pb-20 lg:py-32">

      {/* --- Background ---
          قبلاً سه لایه با blur-[100px] و blur-[120px] روی هم بودند. فیلتر blur
          روی سطح بزرگ، گران‌ترین کار پردازنده گرافیکی موبایل است و در هر اسکرول
          دوباره محاسبه می‌شود. همان ظاهر با چند radial-gradient ساخته می‌شود که
          مرورگر یک‌بار رستر می‌کند و دیگر دست نمی‌زند. */}
      <div
        className="absolute inset-0 -z-20 w-full h-full bg-white"
        style={{
          backgroundImage: [
            "radial-gradient(circle 500px at 50% 200px, #C9EBFF, transparent)",
            "radial-gradient(circle 420px at 50% 0, rgba(37,99,235,.07), transparent)",
            "radial-gradient(circle 340px at 0 100%, rgba(191,219,254,.35), transparent)",
            "radial-gradient(circle 300px at 100% 33%, rgba(165,243,252,.35), transparent)",
          ].join(", "),
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full max-w-7xl">

        {/* در RTL ستون اول سمت راست می‌نشیند: متن راست، تصویر چپ. */}
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">

          {/* ------------------------------ متن ------------------------------ */}
          <div className="flex flex-col items-center gap-6 text-center md:gap-8 lg:items-start lg:text-right">

            {/* Badge */}
            <Badge variant="outline" className="py-2 px-4 sm:px-6 text-primary border-primary/20 bg-white rounded-full text-xs sm:text-sm font-medium shadow-sm hover:bg-white transition-colors gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>مرکز تخصصی مهندسی پزشکی نوین تجهیز</span>
            </Badge>

            {/* Title */}
            <h1 className="text-[1.75rem] sm:text-4xl md:text-6xl lg:text-[3.4rem] xl:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.25] md:leading-[1.2] w-full text-balance">
              تجربه خوابی آرام با{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-primary">
                تکنولوژی‌های پیشرفته پزشکی
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-2xl text-slate-600 text-sm sm:text-base md:text-xl leading-relaxed mx-auto lg:mx-0 text-pretty">
              مرجع تخصصی فروش، اجاره و تعمیرات دستگاه‌های <span className="font-bold text-slate-800">CPAP</span> و <span className="font-bold text-slate-800">BiPAP</span> و تجهیزات پلی‌سومنوگرافی در شرق کشور.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start items-center pt-2">
              <Button asChild size="lg" className="h-13 sm:h-14 px-8 sm:px-10 text-base sm:text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 md:hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto gap-2">
                <Link href="/products">
                  مشاهده محصولات
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="h-13 sm:h-14 px-8 sm:px-10 text-base sm:text-lg rounded-full border-slate-300 bg-white/60 backdrop-blur-sm hover:bg-white text-slate-700 md:hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto gap-2">
                <Link href="/contact">
                  <Wrench className="w-5 h-5 text-slate-500" />
                  درخواست تعمیرات
                </Link>
              </Button>
            </div>

            {/* Features List */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm font-medium text-slate-500 pt-2 md:pt-4 opacity-90 w-full">
                {["تامین قطعات اورجینال", "مشاوره تخصصی رایگان", "گارانتی معتبر"].map((item) => (
                    <div
                        key={item}
                        className="flex items-center gap-1.5 sm:gap-2 bg-white/60 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-200/60 shadow-sm"
                    >
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* ----------------------------- تصویر ----------------------------- */}
          <div className="relative w-full">
            <Image
              src="/images/sleep.jpg"
              alt="دستگاه تخصصی خواب"
              width={800}
              height={600}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 560px"
              className="mx-auto w-full max-w-[560px] rounded-[20px] sm:rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]"
              priority
            />
          </div>

        </div>

        {/* ردیف مراکز همکار، بدون خط جداکننده — بخشی از خود هیرو. */}
        <div className="mt-14 md:mt-20">
          <TrustBand />
        </div>
      </div>
    </section>
  );
}
