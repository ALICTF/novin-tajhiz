import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Wrench, ShieldCheck, PhoneCall, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { primaryPhone } from "@/lib/data/site";

export function HeroSection() {
  return (
    // هدر ثابت است و ۹۶ پیکسل بالای صفحه را می‌پوشاند؛ pt-28 همان فاصله را جبران می‌کند.
    <section className="relative w-full lg:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-slate-50 pt-28 pb-14 md:pt-32 md:pb-20 lg:py-32">
      
      {/* --- 1. Background --- */}
      <div className="absolute inset-0 w-full h-full bg-white">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]" />
      </div>

      {/* --- 2. Ambient Blurs --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full max-w-7xl">
        
        <div className="flex flex-col items-center text-center justify-center w-full">

          <div className="space-y-6 md:space-y-8 max-w-4xl w-full mx-auto flex flex-col items-center">
            
            {/* Badge */}
            <Badge variant="outline" className="py-2 px-4 sm:px-6 text-primary border-primary/20 bg-white/80 backdrop-blur-md rounded-full text-xs sm:text-sm font-medium shadow-sm hover:bg-white transition-colors gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>مرکز تخصصی مهندسی پزشکی نوین تجهیز</span>
            </Badge>

            {/* Title */}
            <h1 className="text-[1.75rem] sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.25] md:leading-[1.2] w-full text-center text-balance">
              تجربه خوابی آرام با <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_auto] animate-gradient">
                تکنولوژی‌های پیشرفته پزشکی
              </span>
            </h1>
            
            {/* Description */}
            <p className="max-w-2xl text-slate-600 text-sm sm:text-base md:text-xl leading-relaxed mx-auto text-center text-pretty">
              مرجع تخصصی فروش، اجاره و تعمیرات دستگاه‌های <span className="font-bold text-slate-800">CPAP</span> و <span className="font-bold text-slate-800">BiPAP</span> و تجهیزات پلی‌سومنوگرافی در شرق کشور.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center pt-2">
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
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 md:gap-8 text-xs sm:text-sm font-medium text-slate-500 pt-2 md:pt-4 opacity-90 w-full">
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

          {/* --- Hero Image & Floating Cards --- */}
          <div className="relative mt-12 md:mt-20 w-full max-w-5xl mx-auto">

            {/* Main Image Container */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/9] bg-gradient-to-b from-slate-50 to-white border border-white/60 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] flex items-end justify-center p-5 sm:p-8 md:p-12 overflow-visible group">
                
                {/* Glow behind device */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/10 rounded-full blur-[80px]" />

                <div className="relative z-10 w-full max-w-[500px] lg:max-w-[600px] -mb-8 sm:-mb-12 md:-mb-24 transition-transform duration-700 ease-out md:group-hover:scale-[1.02]">
                    {/* عکس اصلی محصول که دست نخورده باقی می‌ماند */}
                    <Image
                        src="/images/sleep.jpg"
                        alt="دستگاه تخصصی خواب"
                        width={800}
                        height={600}
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 500px, 600px"
                        className="drop-shadow-2xl mx-auto rounded-[20px] sm:rounded-[32px]"
                        priority
                    />
                </div>

                {/* Floating Card: Engineer Profile (SVG Icon Replaced) */}
                <div className="hidden lg:flex absolute -top-6 -right-6 z-20 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/60 w-[260px] hover:-translate-y-2 transition-transform duration-300 animate-in fade-in zoom-in duration-700 delay-300">
                    <div className="flex items-center gap-4 text-right w-full">
                        {/* جایگزین عکس مهندس با آیکون SVG */}
                        <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-md overflow-hidden relative shrink-0 flex items-center justify-center bg-slate-100 text-slate-400">
                            <User size={32} strokeWidth={1.5} />
                        </div>
                        
                        <div className="flex flex-col flex-1">
                            <span className="text-sm font-bold text-slate-800">مهندس حاجی‌میرزایی</span>
                            <span className="text-[11px] text-slate-500 mt-0.5">مدیریت دپارتمان فنی</span>
                            <a
                                href={`tel:${primaryPhone.tel}`}
                                className="mt-2 flex w-fit items-center gap-1.5 rounded-md bg-primary/5 px-2 py-1 text-[11px] font-bold text-primary transition-colors hover:bg-primary/10"
                            >
                                <PhoneCall size={12} />
                                <span className="dir-ltr tabular-nums tracking-wide">
                                    {primaryPhone.number}
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Floating Card: Reviews (SVG Icons Replaced) */}
                <div className="hidden lg:flex absolute top-1/3 -left-8 z-20 bg-slate-900/95 backdrop-blur-xl text-white p-5 rounded-2xl shadow-2xl border border-slate-700 w-[220px] hover:-translate-y-2 transition-transform duration-300 animate-in fade-in zoom-in duration-700 delay-500">
                    <div className="flex flex-col items-center text-center gap-3 w-full">
                        <div className="flex gap-1 text-yellow-400">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                        </div>
                        <span className="text-sm font-medium text-slate-200 leading-snug">
                            انتخاب اول کلینیک‌های معتبر خواب کشور
                        </span>
                        <div className="flex -space-x-3 space-x-reverse mt-1">
                            {/* جایگزین عکس‌های کوچک کاربر با آیکون SVG */}
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center relative z-10">
                                    <User size={14} className="text-slate-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}