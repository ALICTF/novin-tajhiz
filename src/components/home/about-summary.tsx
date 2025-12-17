"use client";

import Image from "next/image";
import { CheckCircle, Award, FileText, Phone, Linkedin, Instagram, Quote, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AboutSummary() {
  return (
    <section className="relative py-24 bg-[#0B1120] text-white overflow-hidden flex flex-col items-center justify-center border-t border-white/5">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] -z-10 -translate-x-1/3 translate-y-1/3" />
      
      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10 flex flex-col items-center text-center">
    
        <Badge variant="outline" className="mb-8 px-4 py-1.5 text-white border-primary/30 bg-primary/10 backdrop-blur-md rounded-full shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]">
          <Sparkles className="w-3.5 h-3.5 mr-2 animate-pulse text-white" />
          درباره مدیریت
        </Badge>
        
        {/* ✅ تیتر اصلاح شده: استفاده از رنگ‌های بسیار روشن‌تر برای کنتراست روی زمینه تاریک */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-8">
          تلفیق دانش{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-[length:200%_auto] animate-gradient">
            مهندسی
          </span>
          <br className="hidden md:block" />
          و تجربه{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-[length:200%_auto] animate-gradient">
            بالینی
          </span>
        </h2>
        
        <p className="text-slate-300 max-w-3xl text-lg md:text-xl leading-relaxed mb-20 font-light opacity-90">
          مهندسی پزشکی نوین تجهیز با مدیریت <strong>مهندس سید محمدرضا حاجی میرزایی</strong>، 
          از سال ۱۳۹۳ با هدف ارتقای کیفیت سلامت خواب در کشور تاسیس شد. ما فقط فروشنده نیستیم؛ 
          ما مشاورین تخصصی شما در تمام مراحل تشخیص و درمان هستیم.
        </p>

        {/* Orbit Animation Section */}
        <div className="relative w-full flex justify-center items-center mb-24 group">
            
            {/* Spinning Rings */}
            <div className="absolute w-[340px] h-[340px] border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-[480px] h-[480px] border border-white/5 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
            
            {/* Floating Cards Container */}
            <div className="hidden md:flex absolute inset-0 justify-between items-center w-full max-w-4xl px-4 pointer-events-none">
                
                {/* Left Card: Award (Gold Theme) */}
                <div className="flex flex-col gap-6 translate-y-12">
                    <div className="flex items-center gap-4 bg-[#111827]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto hover:scale-105 transition-all duration-300 hover:border-amber-500/30 hover:shadow-amber-500/10">
                        <div className="bg-amber-500/10 p-3.5 rounded-xl text-amber-400 shadow-inner shadow-amber-500/20">
                            <Award size={28} />
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-base text-white">ثبت اختراع ملی</div>
                            <div className="text-xs text-slate-400 mt-1">تجهیزات پزشکی خواب</div>
                        </div>
                    </div>
                </div>

                {/* Right Card: Articles (Cyan Theme) */}
                <div className="flex flex-col gap-6 -translate-y-12">
                    <div className="flex items-center flex-row-reverse gap-4 bg-[#111827]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto hover:scale-105 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-cyan-500/10">
                        <div className="bg-cyan-500/10 p-3.5 rounded-xl text-cyan-400 shadow-inner shadow-cyan-500/20">
                            <FileText size={28} />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-base text-white">مقالات علمی</div>
                            <div className="text-xs text-slate-400 mt-1">انتشارات بین‌المللی</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Center Profile Image */}
            <div className="relative z-20">
                <div className="relative w-52 h-52 md:w-64 md:h-64 rounded-full p-2 bg-gradient-to-b from-slate-700/50 to-transparent">
                    <div className="w-full h-full rounded-full border-4 border-[#0B1120] overflow-hidden relative shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out">
                        <Image 
                            src="/images/boss.jpg" 
                            alt="مهندس حاجی میرزایی" 
                            fill 
                            className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                        />
                    </div>
                    
                    <div className="absolute -top-2 -right-2 bg-primary text-white p-2.5 rounded-full shadow-lg border-4 border-[#0B1120]">
                        <Quote size={20} fill="currentColor" />
                    </div>
                </div>
                
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#1e293b] border border-white/10 px-8 py-3 rounded-2xl shadow-xl whitespace-nowrap z-30 flex flex-col items-center backdrop-blur-xl">
                    <span className="text-base font-bold text-white">مهندس حاجی‌میرزایی</span>
                    <span className="text-[11px] text-primary font-bold tracking-widest uppercase mt-0.5">مدیریت و موسس</span>
                </div>
            </div>
        </div>

        {/* Action Buttons - High Contrast */}
        <div className="flex flex-wrap justify-center gap-4 mb-20 w-full pt-4">
            
            <Button variant="outline" className="h-14 px-8 rounded-full border-white/20 bg-white/5 text-white hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 gap-3 text-base group">
                <Phone size={20} className="text-white group-hover:animate-pulse" />
                <span className="dir-ltr font-mono font-bold tracking-wider">0915-425-6458</span>
            </Button>
            
            <Button variant="outline" className="h-14 px-8 rounded-full border-white/20 bg-white/5 text-white hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all duration-300 gap-3 text-base">
                <Linkedin size={22} />
                <span>پروفایل لینکدین</span>
            </Button>

            <Button variant="outline" className="h-14 px-8 rounded-full border-white/20 bg-white/5 text-white hover:bg-gradient-to-r hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] hover:border-transparent hover:text-white transition-all duration-300 gap-3 text-base">
                <Instagram size={22} />
                <span>اینستاگرام</span>
            </Button>
        </div>

        {/* Trusted Partners */}
        <div className="w-full border-t border-white/10 pt-10 flex flex-col items-center">
            <p className="text-sm text-slate-400 mb-8 font-medium bg-[#0B1120] -mt-14 px-6 py-2 rounded-full border border-white/5">
                مورد اعتماد مراکز درمانی برتر کشور
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-16 opacity-60 hover:opacity-100 transition-opacity duration-500">
                {["بیمارستان امام رضا", "بیمارستان مسیح دانشوری", "کلینیک خواب رویا", "کلینیک دکتر پارساپور"].map((partner, i) => (
                    <div key={i} className="flex items-center gap-2.5 group cursor-default select-none">
                        <CheckCircle className="w-5 h-5 text-emerald-500/80 group-hover:text-emerald-400 transition-colors" />
                        <span className="text-base md:text-lg font-bold text-slate-300 group-hover:text-white transition-colors">
                            {partner}
                        </span>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
}