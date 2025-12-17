"use client";

import Image from "next/image";
import { CheckCircle, Award, FileText, Phone, Linkedin, Instagram, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AboutSummary() {
  return (
    <section className="relative py-24 bg-[#0B1120] text-white overflow-hidden flex flex-col items-center justify-center border-t border-white/5">
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] -z-10 -translate-x-1/3 translate-y-1/3" />
      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10 flex flex-col items-center text-center">
    
        <Badge variant="outline" className="mb-6 px-4 py-1.5 text-primary border-primary/30 bg-primary/5 backdrop-blur-sm rounded-full animate-in fade-in zoom-in duration-700">
          درباره مدیریت
        </Badge>
        
        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-white tracking-tight">
          تلفیق دانش <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">مهندسی</span> و تجربه <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">بالینی</span>
        </h2>
        
        <p className="text-slate-300 max-w-3xl text-lg leading-relaxed mb-16 font-light">
          مهندسی پزشکی نوین تجهیز با مدیریت <strong>مهندس سید محمدرضا حاجی میرزایی</strong>، 
          از سال ۱۳۹۳ با هدف ارتقای کیفیت سلامت خواب در کشور تاسیس شد. ما فقط فروشنده نیستیم؛ 
          ما مشاورین تخصصی شما در تمام مراحل تشخیص و درمان هستیم.
        </p>

        <div className="relative w-full flex justify-center items-center mb-20 group">
            
            <div className="absolute w-[340px] h-[340px] border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-[450px] h-[450px] border border-white/5 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
            <div className="hidden md:flex absolute inset-0 justify-between items-center w-full max-w-4xl px-4 pointer-events-none">
                
                <div className="flex flex-col gap-6 translate-y-12">
                    <div className="flex items-center gap-4 bg-[#1e293b]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto hover:scale-105 transition-transform hover:border-primary/50 hover:bg-[#1e293b]">
                        <div className="bg-primary/20 p-3 rounded-xl text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            <Award size={24} />
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-sm text-white">ثبت اختراع ملی</div>
                            <div className="text-xs text-slate-400 mt-1">تجهیزات پزشکی خواب</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 -translate-y-12">
                    <div className="flex items-center flex-row-reverse gap-4 bg-[#1e293b]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto hover:scale-105 transition-transform hover:border-primary/50 hover:bg-[#1e293b]">
                        <div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                            <FileText size={24} />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-sm text-white">مقالات علمی</div>
                            <div className="text-xs text-slate-400 mt-1">انتشارات بین‌المللی</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-20">
                <div className="relative w-52 h-52 md:w-64 md:h-64 rounded-full p-2 bg-gradient-to-b from-slate-700 to-transparent">
                    <div className="w-full h-full rounded-full border-4 border-[#0B1120] overflow-hidden relative shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700">
                        <Image 
                            src="/images/boss.jpg" 
                            alt="مهندس حاجی میرزایی" 
                            fill 
                            className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                        />
                    </div>
                    
                    <div className="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg border-4 border-[#0B1120]">
                        <Quote size={16} fill="currentColor" />
                    </div>
                </div>
                
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#1e293b] border border-white/10 px-6 py-2.5 rounded-full shadow-xl whitespace-nowrap z-30 flex flex-col items-center">
                    <span className="text-sm font-bold text-white">مهندس حاجی‌میرزایی</span>
                    <span className="text-[10px] text-white font-medium tracking-wider uppercase">مدیریت و موسس</span>
                </div>
            </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-20 w-full pt-4">
            <Button variant="outline" className="h-14 px-8 rounded-full border-white/10 bg-white/5 text-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all gap-3 group">
                <Phone size={18} className="text-white group-hover:text-white group-hover: transition-colors" />
                <span className="dir-ltr font-mono text-base">0915-425-6458</span>
            </Button>
            
            <Button variant="outline" className="h-14 px-8 rounded-full border-white/10 bg-white/5 hover:bg-[#0077b5] text-slate-300 hover:text-white hover:border-[#0077b5] transition-all gap-3 group">
                <Linkedin size={20} className="group-hover:text-white text-[#0077b5] transition-colors" />
                <span>پروفایل لینکدین</span>
            </Button>

            <Button variant="outline" className="h-14 px-8 rounded-full border-white/10 bg-white/5 hover:bg-[#E1306C] text-slate-300 hover:text-white hover:border-[#E1306C] transition-all gap-3 group">
                <Instagram size={20} className="group-hover:text-white text-[#E1306C] transition-colors" />
                <span>اینستاگرام</span>
            </Button>
        </div>

        <div className="w-full border-t border-white/5 pt-10 flex flex-col items-center">
            <p className="text-sm text-slate-500 mb-8 font-medium bg-[#0B1120] -mt-14 px-4 py-1">
                مورد اعتماد مراکز درمانی برتر کشور
            </p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-50 hover:opacity-100 transition-opacity duration-500">
                {["بیمارستان امام رضا", "بیمارستان مسیح دانشوری", "کلینیک خواب رویا", "کلینیک دکتر پارساپور"].map((partner, i) => (
                    <div key={i} className="flex items-center gap-2 group cursor-default">
                        <CheckCircle className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
                        <span className="text-sm md:text-lg font-bold text-slate-400 group-hover:text-white transition-colors">
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



