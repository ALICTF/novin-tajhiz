"use client";

import Image from "next/image";
import { Users, Target, History, Award, CheckCircle2, Linkedin, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* --- 1. Hero Section (Introduction) --- */}
      {/* تغییرات: 
          1. pt-32: فاصله از بالا برای هدر
          2. bg-slate-50: رنگ زمینه روشن مثل صفحه اصلی
          3. text-slate-900: رنگ متن تیره
      */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 text-slate-900">
        
        {/* Background Patterns (Light Mode) */}
        
        {/* Blob Decoration */}
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

      {/* --- 2. Stats Section (Trust by Numbers) --- */}
      {/* تغییر: رنگ پس‌زمینه کارت سفید است که روی زمینه طوسی سکشن بالا کنتراست زیبایی ایجاد می‌کند */}
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

      {/* --- 3. Our Mission (Grid Layout) --- */}
      <section className="py-24 container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
                <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50">
                    <Image 
                        src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000" 
                        alt="تیم مهندسی پزشکی" 
                        fill 
                        className="object-cover"
                    />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-xs hidden md:block">
                    <p className="text-slate-800 font-bold mb-2">تعهد ما:</p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        پشتیبانی فنی ۲۴ ساعته حتی در روزهای تعطیل برای بیماران تنفسی.
                    </p>
                </div>
            </div>
            
            <div className="space-y-8">
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
                
                <Button size="lg" className="rounded-full px-8 bg-slate-900 text-white hover:bg-slate-800">
                    دریافت مشاوره رایگان
                </Button>
            </div>
        </div>
      </section>

      {/* --- 4. Team Section (Clean Cards) --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">تیم متخصص ما</h2>
                <p className="text-slate-500">افرادی که پشت تکنولوژی ایستاده‌اند</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { name: "مهندس حاجی‌میرزایی", role: "مدیریت و موسس", img: "https://placehold.co/400x400/1e293b/FFF?text=CEO" },
                    { name: "مهندس کریمی", role: "مدیر فنی و تعمیرات", img: "https://placehold.co/400x400/1e293b/FFF?text=CTO" },
                    { name: "دکتر رضایی", role: "مشاور علمی", img: "https://placehold.co/400x400/1e293b/FFF?text=DR" },
                ].map((member, i) => (
                    <div key={i} className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 text-center">
                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-slate-100">
                            <Image 
                                src={member.img} 
                                alt={member.name} 
                                fill 
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            {/* Social Overlay */}
                            <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full">
                                    <Linkedin size={20} />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full">
                                    <Mail size={20} />
                                </Button>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                        <p className="text-sm text-primary font-medium">{member.role}</p>
                    </div>
                ))}
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
                {/* لوگوهای فیک برای نمونه */}
                <div className="flex items-center gap-2 font-black text-2xl text-slate-800"><Award /> ISO 13485</div>
                <div className="flex items-center gap-2 font-black text-2xl text-slate-800"><ShieldCheck /> IMED</div>
                <div className="flex items-center gap-2 font-black text-2xl text-slate-800"><CheckCircle2 /> CE Europe</div>
            </div>
        </div>
      </section>

    </div>
  );
}