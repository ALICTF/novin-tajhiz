"use client";

import Image from "next/image";
import { Users, Target, History, Award, CheckCircle2, Linkedin, Mail, ShieldCheck, Quote, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* --- 1. Hero Section (Introduction) --- */}
      {/* تغییر: پترن مربعی حذف شد و فقط رنگ پس‌زمینه و حباب‌های محو باقی ماندند */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 text-slate-900">
        
        {/* Blob Decoration (حباب‌های رنگی محو برای زیبایی) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
            <Badge variant="outline" className="mb-6 text-primary border-primary/20 bg-white/50 backdrop-blur px-4 py-1.5 shadow-sm">
                داستان نوین تجهیز
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                ما <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_auto] animate-gradient">مهندسانی</span> هستیم که<br/>
                به کیفیت خواب شما اهمیت می‌دهیم
            </h1>
            
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
                از سال ۱۳۹۳، ماموریت ما پر کردن شکاف بین "تکنولوژی پزشکی" و "آرامش بیمار" بوده است. ما فقط دستگاه نمی‌فروشیم؛ ما راهکار مهندسی برای سلامتی ارائه می‌دهیم.
            </p>
        </div>
      </section>

      {/* --- 2. Stats Section --- */}
      <section className="py-12 bg-transparent -mt-8 relative z-20 container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-x-reverse divide-slate-100 p-2">
            {[
                { label: "سال تجربه تخصصی", value: "+۱۰", icon: History },
                { label: "بیمار راضی", value: "+۵۰۰۰", icon: Users },
                { label: "پروژه کلینیکی", value: "+۵۰", icon: Target },
                { label: "مجوز و گواهی", value: "۱۲", icon: Award },
            ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-4">
                    <stat.icon className="w-8 h-8 text-primary mb-3 opacity-80" />
                    <div className="text-4xl font-black text-slate-800 mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
            ))}
        </div>
      </section>

      {/* --- 3. Management Team (Single Profile) --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">مدیریت مجموعه</h2>
                <p className="text-slate-500">تعهد به کیفیت، تحت نظارت مستقیم متخصصین</p>
            </div>

            <div className="flex justify-center">
                <div className="group bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100 text-center max-w-md w-full hover:-translate-y-2 transition-all duration-500">
                    
                    {/* Image Container */}
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-8 bg-slate-100 border-4 border-white shadow-inner">
                        <Image 
                            src="/images/boss.jpg" 
                            alt="مهندس سید محمدرضا حاجی‌میرزایی" 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        
                        {/* Quote Overlay */}
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                            <Quote className="text-primary w-6 h-6" fill="currentColor" />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-4 px-4 pb-4">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-1">مهندس سید محمدرضا حاجی‌میرزایی</h3>
                            <p className="text-primary font-bold text-sm tracking-wide uppercase">مدیریت و موسس</p>
                        </div>
                        
                        <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                            کارشناس ارشد مهندسی پزشکی با بیش از یک دهه تجربه در زمینه تجهیزات تنفسی و راه‌اندازی کلینیک‌های خواب. متخصص در کالیبراسیون دقیق دستگاه‌های CPAP و BiPAP.
                        </p>

                        <div className="flex justify-center gap-3 pt-2">
                            <Button size="icon" variant="outline" className="rounded-full border-slate-200 text-slate-500 hover:text-blue-700 hover:border-blue-700 hover:bg-blue-50 transition-colors">
                                <Linkedin size={18} />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-colors">
                                <Mail size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 4. Our Mission & Vision --- */}
      <section className="py-24 bg-slate-50 container mx-auto px-4 md:px-6 max-w-7xl rounded-[3rem] my-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8 order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                    چرا پزشکان متخصص<br/>
                    <span className="text-primary">نوین تجهیز</span> را پیشنهاد می‌کنند؟
                </h2>
                <p className="text-slate-500 leading-7 text-justify">
                    برخلاف فروشگاه‌های عمومی، تمام اعضای تیم ما فارغ‌التحصیلان رشته مهندسی پزشکی هستند. ما زبان پزشک را می‌فهمیم و نیاز بیمار را درک می‌کنیم. هر دستگاهی که از ما تهیه می‌کنید، حاصل ساعت‌ها تست فنی و کنترل کیفی دقیق است.
                </p>
                
                <ul className="space-y-4">
                    {[
                        "نمایندگی رسمی برندهای ResMed و Philips",
                        "واحد فنی تخصصی تعمیرات با قطعات اورجینال",
                        "آموزش رایگان نصب و راه‌اندازی در منزل",
                        "گارانتی تعویض بی قید و شرط ۶ ماهه"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <div className="bg-green-100 p-1 rounded-full text-green-600">
                                <CheckCircle2 size={16} />
                            </div>
                            <span className="text-slate-700 font-medium">{item}</span>
                        </li>
                    ))}
                </ul>
                
                <Button size="lg" className="rounded-full px-8 bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20">
                    دریافت مشاوره رایگان
                </Button>
            </div>

            <div className="relative order-1 lg:order-2">
                <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                    <Image 
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000" 
                        alt="تیم مهندسی پزشکی" 
                        fill 
                        className="object-cover"
                    />
                </div>
                {/* Floating Location Card */}
                <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
                    <div className="bg-rose-100 p-3 rounded-full text-rose-600">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-800">شعبه مرکزی</div>
                        <div className="text-xs text-slate-500">مشهد، خیابان احمدآباد</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 5. Certificates (Logo Strip) --- */}
      <section className="py-16 border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">
                دارای گواهینامه‌های معتبر بین‌المللی
            </p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-black text-2xl text-slate-800"><Award /> ISO 13485</div>
                <div className="flex items-center gap-2 font-black text-2xl text-slate-800"><ShieldCheck /> IMED</div>
                <div className="flex items-center gap-2 font-black text-2xl text-slate-800"><CheckCircle2 /> CE Europe</div>
            </div>
        </div>
      </section>

    </div>
  );
}