"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Phone, MapPin, Mail, Clock, Send, MessageSquare, 
  Headphones, Building2, Instagram, Linkedin, ArrowRight, 
  Navigation, Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    // رعایت فاصله از هدر با pt-32
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      
      {/* --- 1. Hero Header --- */}
      <section className="relative pb-16 container mx-auto px-4 text-center">
        <div className="flex flex-col items-center space-y-4">
            <Badge variant="outline" className="text-primary border-primary/20 bg-white px-4 py-1.5 shadow-sm backdrop-blur-sm">
                همیشه پاسخگو هستیم
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                ارتباط با <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-600">نوین تجهیز</span>
            </h1>
            
            <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
                چه برای مشاوره خرید و چه برای خدمات پس از فروش، تیم متخصص ما آماده شنیدن صدای گرم شماست.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-20">
        
        {/* --- 2. Contact Cards Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
            
            {/* Card 1: Sales (Left) */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Building2 size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">واحد فروش و مشاوره</h3>
                <p className="text-slate-500 text-sm mb-8">برای استعلام قیمت و مشاوره خرید دستگاه</p>
                
                <div className="space-y-4">
                    <a href="tel:05138400000" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group/item">
                        <div className="flex items-center gap-3">
                            <Phone size={18} className="text-slate-400 group-hover/item:text-blue-600" />
                            <span className="text-sm font-bold text-slate-700">خط ثابت</span>
                        </div>
                        <span className="font-mono font-bold dir-ltr text-slate-900">051-3840-1234</span>
                    </a>
                    <a href="tel:09120000000" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group/item">
                        <div className="flex items-center gap-3">
                            <Phone size={18} className="text-slate-400 group-hover/item:text-blue-600" />
                            <span className="text-sm font-bold text-slate-700">کارشناس فروش</span>
                        </div>
                        <span className="font-mono font-bold dir-ltr text-slate-900">0915-111-2222</span>
                    </a>
                </div>
            </div>

            {/* Card 2: Support (Center - Highlighted) */}
            <div className="bg-[#0f172a] p-8 rounded-[2rem] shadow-2xl shadow-slate-900/20 border border-slate-800 text-white hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden lg:-mt-6 lg:mb-6 min-h-[420px] flex flex-col">
                 
                 {/* Background Glow */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                 {/* Active Indicator */}
                 <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-medium text-emerald-400">آنلاین</span>
                 </div>

                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary mb-6 border border-white/5 backdrop-blur-sm">
                    <Headphones size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">پشتیبانی فنی</h3>
                <p className="text-slate-400 text-sm mb-8">ویژه بیماران اورژانسی و تعمیرات فوری (۲۴ ساعته)</p>
                
                <div className="space-y-4 mb-auto">
                    <a href="tel:09154256458" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group/item cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                <Phone size={18} />
                            </div>
                            <span className="text-sm font-medium">شماره مستقیم</span>
                        </div>
                        <span className="font-mono font-bold dir-ltr text-lg tracking-wider">0915-425-6458</span>
                    </a>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Clock size={14} className="text-primary" />
                    <span>پاسخگویی حتی در روزهای تعطیل</span>
                </div>
            </div>

            {/* Card 3: Social (Right) */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <MessageSquare size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">فضای مجازی</h3>
                <p className="text-slate-500 text-sm mb-8">ما را در شبکه‌های اجتماعی دنبال کنید</p>
                
                <div className="flex flex-col gap-3">
                    <a href="#" className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group/link">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white flex items-center justify-center shadow-md">
                            <Instagram size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-slate-800 text-sm">اینستاگرام</div>
                            <div className="text-[10px] text-slate-400">@novintajhiz_medical</div>
                        </div>
                        <ArrowRight size={16} className="text-slate-300 group-hover/link:text-primary transition-colors" />
                    </a>

                    <a href="#" className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group/link">
                        <div className="w-10 h-10 rounded-full bg-[#0077b5] text-white flex items-center justify-center shadow-md">
                            <Linkedin size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-slate-800 text-sm">لینکدین</div>
                            <div className="text-[10px] text-slate-400">Novin Tajhiz Co</div>
                        </div>
                        <ArrowRight size={16} className="text-slate-300 group-hover/link:text-primary transition-colors" />
                    </a>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-100">
                    <a href="mailto:info@novintajhiz.ir" className="flex items-center justify-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
                        <Mail size={16} />
                        <span>info@novintajhiz.ir</span>
                    </a>
                </div>
            </div>
        </div>

        {/* --- 3. Map & Form Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-2 rounded-[3rem] shadow-xl border border-slate-100">
            
            {/* Left: Form */}
            <div className="p-6 md:p-10">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">ارسال پیام متنی</h2>
                    <p className="text-slate-500 text-sm">
                        انتقادات، پیشنهادات و پیام‌های شما مستقیماً توسط مدیریت بررسی می‌شود.
                    </p>
                </div>
                
                <form className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 mr-1">نام و نام خانوادگی</label>
                            <Input placeholder="مثلا: علی محمدی" className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:bg-white transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 mr-1">شماره تماس</label>
                            <Input placeholder="091..." className="bg-slate-50 border-slate-200 h-12 rounded-xl dir-ltr text-right focus:bg-white transition-all" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 mr-1">موضوع پیام</label>
                        <Input placeholder="مثلا: درخواست همکاری" className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:bg-white transition-all" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 mr-1">متن پیام</label>
                        <Textarea placeholder="پیام خود را بنویسید..." className="bg-slate-50 border-slate-200 min-h-[140px] rounded-xl resize-none focus:bg-white transition-all" />
                    </div>

                    <Button className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-primary rounded-xl gap-2 shadow-lg shadow-slate-900/10">
                        <Send size={20} />
                        ثبت و ارسال پیام
                    </Button>
                </form>
            </div>

            {/* Right: Map & Location */}
            <div className="relative h-[400px] lg:h-auto rounded-[2.5rem] overflow-hidden bg-slate-100 group min-h-[500px]">
                {/* Fake Map Image */}
                <Image 
                    src="https://placehold.co/1000x1000/e2e8f0/64748b?text=Map+View" 
                    alt="Map Location" 
                    fill 
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                />
                
                {/* Location Overlay Card */}
                <div className="absolute bottom-6 right-6 left-6 bg-white/95 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-2xl">
                    <div className="flex items-start gap-4">
                        <div className="bg-rose-50 p-3.5 rounded-2xl text-rose-600 shrink-0 border border-rose-100">
                            <MapPin size={24} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 mb-1 text-lg">دفتر مرکزی</h4>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                مشهد، بلوار احمدآباد، خیابان پاستور، پاستور ۱۰، ساختمان پزشکان، طبقه ۳، واحد ۱۲
                            </p>
                            
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <Button size="sm" variant="outline" className="h-10 rounded-xl bg-slate-50 hover:bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all gap-2">
                                    <Navigation size={16} />
                                    مسیریابی با نشان
                                </Button>
                                <Button size="sm" variant="outline" className="h-10 rounded-xl bg-slate-50 hover:bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all gap-2">
                                    <Map size={16} />
                                    مسیریابی با بلد
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}