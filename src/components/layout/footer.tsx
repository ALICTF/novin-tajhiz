"use client";

import Link from "next/link";
import { Stethoscope, MapPin, Phone, Mail, Instagram, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// نکته مهم: کلمه export حتما باید اینجا باشد
export function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-300 pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 text-center lg:text-right">
          
          {/* ستون ۱: برند و معرفی (4 واحد عرض) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col items-center lg:items-start">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="bg-white/5 p-2.5 rounded-xl text-primary border border-white/10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Stethoscope size={28} strokeWidth={2} />
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-xl font-bold text-white tracking-tight">Novin Tajhiz</span>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Medical Engineering</span>
                </div>
            </Link>
            <p className="text-sm leading-7 text-slate-400 font-light max-w-sm">
              مرکز تخصصی مهندسی پزشکی نوین تجهیز، پیشرو در ارائه راهکارهای نوین تشخیص و درمان اختلالات خواب و تنفسی با تکیه بر دانش فنی و تجربه بالینی.
            </p>
            <div className="flex gap-3">
                <Button size="icon" variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-[#E1306C] hover:text-white hover:border-transparent transition-all">
                    <Instagram size={18} />
                </Button>
                <Button size="icon" variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-[#2AABEE] hover:text-white hover:border-transparent transition-all">
                    <Send size={18} />
                </Button>
            </div>
          </div>

          {/* ستون ۲: لینک‌های سریع (2 واحد عرض) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-white font-bold text-lg">دسترسی سریع</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">صفحه اصلی</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">محصولات</Link></li>
              <li><Link href="/repair" className="hover:text-primary transition-colors">درخواست تعمیرات</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">مقالات آموزشی</Link></li>
            </ul>
          </div>

          {/* ستون ۳: خدمات (3 واحد عرض) */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-white font-bold text-lg">خدمات تخصصی</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">تست خواب در منزل (Home PSG)</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">کالیبراسیون دستگاه‌های تنفسی</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">تعمیرات برد و موتور CPAP</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">مشاوره راه‌اندازی کلینیک</Link></li>
            </ul>
          </div>

          {/* ستون ۴: خبرنامه (3 واحد عرض) */}
          <div className="lg:col-span-3 space-y-6 flex flex-col items-center lg:items-start">
            <h3 className="text-white font-bold text-lg">عضویت در خبرنامه</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
                برای اطلاع از جدیدترین محصولات و تخفیف‌های ویژه عضو شوید.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2 space-x-reverse">
                <Input type="email" placeholder="ایمیل شما" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-primary" />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">عضویت</Button>
            </div>
          </div>

        </div>

        <Separator className="my-10 bg-white/5" />

        {/* بخش پایین فوتر */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary" />
                    <span>مشهد، بلوار احمدآباد، خیابان پاستور...</span>
                </div>
                <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full" />
                <div className="flex items-center gap-2">
                    <Phone size={14} className="text-primary" />
                    <span className="dir-ltr">0915-425-6458</span>
                </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                <span>طراحی و توسعه با</span>
                <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" />
                <span>توسط تیم فنی نوین تجهیز</span>
            </div>
        </div>
      </div>
    </footer>
  );
}