"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Wrench, ShieldCheck, PhoneCall, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed bg-slate-50/50 py-20 lg:py-32">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-[80px] -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-100/30 rounded-full blur-[80px] -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full max-w-7xl">
        
        <div className="flex flex-col items-center text-center justify-center w-full">

          <div className="space-y-8 max-w-4xl w-full mx-auto flex flex-col items-center">
            
            <Badge variant="outline" className="py-2 px-6 text-primary border-primary/20 bg-white/50 backdrop-blur-sm rounded-full text-sm font-medium shadow-sm hover:bg-white transition-colors">
              <ShieldCheck className="w-4 h-4 ml-2 inline-block" />
              مرکز تخصصی مهندسی پزشکی نوین تجهیز
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.2] w-full text-center">
              تجربه خوابی آرام با <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_auto] animate-gradient">
                تکنولوژی‌های پیشرفته پزشکی
              </span>
            </h1>
            
            <p className="max-w-2xl text-slate-600 md:text-xl leading-relaxed mx-auto px-4 text-center">
              مرجع تخصصی فروش، اجاره و تعمیرات دستگاه‌های <span className="font-bold text-slate-800">CPAP</span> و <span className="font-bold text-slate-800">BiPAP</span> و تجهیزات پلی‌سومنوگرافی در شرق کشور.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center pt-2">
              <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                <Link href="/products">
                  مشاهده محصولات
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full border-slate-300 bg-white/60 backdrop-blur-sm hover:bg-white text-slate-700 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                <Link href="/repair">
                  <Wrench className="ml-2 h-5 w-5 text-slate-500" />
                  درخواست تعمیرات
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-sm font-medium text-slate-500 pt-4 opacity-90 w-full">
                <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>تامین قطعات اورجینال</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>مشاوره تخصصی رایگان</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>گارانتی معتبر</span>
                </div>
            </div>
          </div>

          <div className="relative mt-20 w-full max-w-5xl mx-auto px-4">
            
            <div className="relative w-full aspect-[16/10] md:aspect-[21/9] bg-gradient-to-b from-slate-100 to-white border border-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/60 flex items-end justify-center p-8 md:p-12 overflow-visible group">
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[60px]" />

                <div className="relative z-10 w-full max-w-[500px] lg:max-w-[600px] -mb-12 md:-mb-24 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                    <Image 
                        src="https://placehold.co/800x600/png?text=Sleep+Device+Pro" 
                        alt="دستگاه تخصصی خواب"
                        width={800}
                        height={600}
                        className="drop-shadow-2xl mx-auto" 
                        priority
                    />
                </div>

                <div className="hidden lg:flex absolute -top-6 -right-6 z-20 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/60 w-[260px] hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex items-center gap-4 text-right w-full">
                        <div className="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden relative shrink-0">
                            <Image src="https://placehold.co/100x100/e2e8f0/1e293b?text=Eng" alt="Eng" fill className="object-cover" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-sm font-bold text-slate-800">مهندس حاجی‌میرزایی</span>
                            <span className="text-[11px] text-slate-500 mt-0.5">مدیریت دپارتمان فنی</span>
                            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-primary bg-primary/5 py-1 px-2 rounded-md w-fit">
                                <PhoneCall size={12} />
                                <span className="dir-ltr">0915-425-6458</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex absolute top-1/3 -left-8 z-20 bg-slate-900/95 backdrop-blur-xl text-white p-5 rounded-2xl shadow-2xl border border-slate-700 w-[220px] hover:-translate-y-2 transition-transform duration-300">
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
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-600 overflow-hidden relative">
                                    <Image src={`https://placehold.co/50x50/475569/ffffff?text=${i}`} alt="user" fill className="object-cover" />
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