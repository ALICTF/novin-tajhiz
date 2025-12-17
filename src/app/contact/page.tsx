"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, MapPin, Mail, Clock, Send, MessageSquare, Headphones, Building2, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* --- 1. Hero Header --- */}
      <section className="relative py-20 bg-[#0B1120] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-50/5" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/10 px-4 py-1.5">
                همیشه پاسخگو هستیم
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black mb-6">
                ارتباط با <span className="text-primary">نوین تجهیز</span>
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
                چه برای مشاوره خرید و چه برای خدمات پس از فروش، تیم متخصص ما آماده شنیدن صدای گرم شماست.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl -mt-10 relative z-20">
        
        {/* --- 2. Contact Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Card 1: Sales */}
            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                    <Building2 size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">واحد فروش و مشاوره</h3>
                <p className="text-slate-500 text-sm mb-6">برای استعلام قیمت و مشاوره خرید دستگاه</p>
                <div className="space-y-3">
                    <a href="tel:05138400000" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-colors group cursor-pointer">
                        <span className="text-sm font-medium">خط ثابت</span>
                        <span className="font-mono font-bold dir-ltr group-hover:scale-105 transition-transform">051-3840-1234</span>
                    </a>
                    <a href="tel:09120000000" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-colors group cursor-pointer">
                        <span className="text-sm font-medium">کارشناس فروش</span>
                        <span className="font-mono font-bold dir-ltr group-hover:scale-105 transition-transform">0915-111-2222</span>
                    </a>
                </div>
            </div>

            {/* Card 2: Support */}
            <div className="bg-[#0B1120] p-8 rounded-3xl shadow-xl shadow-slate-900/20 border border-slate-800 text-white hover:-translate-y-1 transition-transform duration-300 transform md:scale-105 z-10 relative">
                 <div className="absolute top-4 left-4">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                 </div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <Headphones size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">پشتیبانی فنی (۲۴ ساعته)</h3>
                <p className="text-slate-400 text-sm mb-6">ویژه بیماران اورژانسی و تعمیرات فوری</p>
                <div className="space-y-3">
                    <a href="tel:09154256458" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-primary hover:text-white transition-colors group cursor-pointer border border-white/10">
                        <span className="text-sm font-medium">شماره مستقیم</span>
                        <span className="font-mono font-bold dir-ltr group-hover:scale-105 transition-transform">0915-425-6458</span>
                    </a>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} />
                    <span>پاسخگویی حتی در روزهای تعطیل</span>
                </div>
            </div>

            {/* Card 3: Email & Social */}
            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
                    <MessageSquare size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">فضای مجازی</h3>
                <p className="text-slate-500 text-sm mb-6">ما را در شبکه‌های اجتماعی دنبال کنید</p>
                <div className="flex gap-4 mb-6">
                    <Button variant="outline" className="flex-1 gap-2 hover:text-rose-600 hover:border-rose-200">
                        <Instagram size={18} />
                        اینستاگرام
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2 hover:text-blue-600 hover:border-blue-200">
                        <Linkedin size={18} />
                        لینکدین
                    </Button>
                </div>
                <a href="mailto:info@novintajhiz.ir" className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors text-sm font-medium p-3 bg-slate-50 rounded-xl">
                    <Mail size={16} />
                    <span>info@novintajhiz.ir</span>
                </a>
            </div>
        </div>

        {/* --- 3. Map & Form Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 md:p-8 rounded-[40px] shadow-sm border border-slate-200">
            
            {/* Left: Form */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">ارسال پیام متنی</h2>
                    <p className="text-slate-500 text-sm">پیام شما مستقیماً برای مدیریت ارسال می‌شود.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">نام و نام خانوادگی</label>
                        <Input placeholder="مثلا: علی محمدی" className="bg-slate-50 border-slate-200 h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">شماره تماس</label>
                        <Input placeholder="091..." className="bg-slate-50 border-slate-200 h-12 rounded-xl dir-ltr text-right" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">موضوع پیام</label>
                    <Input placeholder="مثلا: درخواست تعمیر دستگاه" className="bg-slate-50 border-slate-200 h-12 rounded-xl" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">متن پیام</label>
                    <Textarea placeholder="توضیحات خود را بنویسید..." className="bg-slate-50 border-slate-200 min-h-[120px] rounded-xl resize-none" />
                </div>

                <Button className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 rounded-xl gap-2">
                    <Send size={18} />
                    ارسال پیام
                </Button>
            </div>

            {/* Right: Map & Location */}
            <div className="relative h-full min-h-[400px] rounded-[32px] overflow-hidden bg-slate-100 group">
                {/* Placeholder Image for Map */}
                <Image 
                    src="https://placehold.co/800x800/e2e8f0/475569?text=Map+Location" 
                    alt="Map" 
                    fill 
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                />
                
                {/* Location Overlay Card */}
                <div className="absolute bottom-6 right-6 left-6 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="bg-red-50 p-3 rounded-full text-red-500 shrink-0">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-1">دفتر مرکزی</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                مشهد، بلوار احمدآباد، خیابان پاستور، پاستور ۱۰، ساختمان پزشکان، طبقه ۳، واحد ۱۲
                            </p>
                            <div className="mt-4 flex gap-2">
                                <Button size="sm" variant="outline" className="text-xs h-8 rounded-lg">مسیریابی با نشان</Button>
                                <Button size="sm" variant="outline" className="text-xs h-8 rounded-lg">مسیریابی با بلد</Button>
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