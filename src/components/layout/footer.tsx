"use client";

import Link from "next/link";
import { 
  Stethoscope, MapPin, Phone, Mail, Instagram, Send, Heart, 
  ArrowLeft, Linkedin, Github, MessageCircle, Smartphone, Code2, Copyright 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-[#0B1120] text-slate-300 border-t border-white/5 relative">
      
      {/* --- 1. لایه پس‌زمینه (محدود شده برای جلوگیری از اسکرول) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
          
          {/* Ambient Glows (محصور در این لایه) */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* --- 2. محتوای اصلی (بدون محدودیت اسکرول برای نمایش پاپ‌آپ) --- */}
      <div className="relative z-10 pt-24 pb-8">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          
          {/* --- Main Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 text-center lg:text-right mb-16">
            
            {/* ستون ۱: برند */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-6">
              <Link href="/" className="flex items-center gap-3 group">
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/20 transition-transform duration-500 group-hover:rotate-6">
                      <Stethoscope size={26} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col items-start">
                      <span className="text-2xl font-black tracking-tight text-white">
                          Novin <span className="--chart-1">Tajhiz</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Medical Engineering</span>
                  </div>
              </Link>
              
              <p className="text-sm leading-8 text-slate-400 font-light max-w-sm text-justify">
                مرکز تخصصی مهندسی پزشکی نوین تجهیز، با تکیه بر دانش فنی، راهکارهای جامع تشخیص و درمان اختلالات خواب را ارائه می‌دهد.
              </p>

              <div className="flex gap-3 pt-2">
                  <Button size="icon" variant="outline" className="rounded-xl w-10 h-10 border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-transparent hover:bg-[#E1306C] transition-all">
                      <Instagram size={18} />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-xl w-10 h-10 border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-transparent hover:bg-[#2AABEE] transition-all">
                      <Send size={18} />
                  </Button>
              </div>
            </div>

            {/* ستون ۲ */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-white font-bold text-lg flex items-center gap-2 justify-center lg:justify-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  دسترسی سریع
              </h3>
              <ul className="space-y-4 text-sm">
                {[{name:"صفحه اصلی",href:"/"}, {name:"فروشگاه",href:"/products"}, {name:"تعمیرات",href:"/services"}, {name:"وبلاگ",href:"/blog"}].map((link, i) => (
                    <li key={i}>
                        <Link href={link.href} className="group flex items-center justify-center lg:justify-start gap-2 text-slate-400 hover:text-white transition-all">
                            <ArrowLeft size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                            <span>{link.name}</span>
                        </Link>
                    </li>
                ))}
              </ul>
            </div>

            {/* ستون ۳ */}
            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-white font-bold text-lg flex items-center gap-2 justify-center lg:justify-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  خدمات تخصصی
              </h3>
              <ul className="space-y-4 text-sm">
                {["تست خواب (PSG)", "کالیبراسیون CPAP", "اجاره تجهیزات", "مشاوره کلینیک"].map((item, i) => (
                    <li key={i}>
                        <Link href="#" className="group flex items-center justify-center lg:justify-start gap-2 text-slate-400 hover:text-white transition-all">
                            <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors" />
                            <span>{item}</span>
                        </Link>
                    </li>
                ))}
              </ul>
            </div>

            {/* ستون ۴: خبرنامه */}
            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-white font-bold text-lg flex items-center gap-2 justify-center lg:justify-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  عضویت در خبرنامه
              </h3>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-xs text-slate-400 mb-4 text-right">برای اطلاع از تخفیف‌ها ایمیل خود را وارد کنید.</p>
                  <div className="flex flex-col gap-2">
                      <Input type="email" placeholder="example@mail.com" className="bg-black/20 border-white/10 text-white h-10 text-sm rounded-xl text-left dir-ltr" />
                      <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-bold h-10">عضویت</Button>
                  </div>
              </div>
            </div>

          </div>

          <Separator className="bg-white/5" />

          {/* --- Footer Bottom & Signature --- */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-8 text-xs text-slate-500">
              
              <div className="flex items-center gap-1 order-2 md:order-1">
                  <Copyright size={14} />
                  <span>۱۴۰۳</span>
                  <span className="mx-1">|</span>
                  <span>تمامی حقوق برای </span>
                  <strong className="text-slate-300">نوین تجهیز</strong>
                  <span> محفوظ است.</span>
              </div>

              {/* --- Developer Signature (Hover Card) --- */}
              {/* این بخش چون داخل کانتینر اصلی است اما بیرون از div مخفی‌کننده (overflow-hidden) قرار دارد، به درستی نمایش داده می‌شود */}
              <div className="relative group order-1 md:order-2">
                  <div className="flex items-center gap-2 cursor-default bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-white/10 transition-all">
                      <span className="opacity-70">Design & Dev by</span>
                      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 relative">
                          Mostafa Khajenezhad
                          <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
                      </span>
                      <Code2 size={14} className="text-emerald-400" />
                  </div>

                  {/* The Hover Popup Card */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-[#1e293b]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-50">
                      
                      {/* Header of Card */}
                      <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 p-[2px]">
                              <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center text-white font-bold text-lg">
                                  MK
                              </div>
                          </div>
                          <div className="text-left">
                              <h4 className="text-white font-bold text-sm">Mostafa Khajenezhad</h4>
                              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Full Stack Developer</span>
                          </div>
                      </div>

                      {/* Social Links */}
                      <div className="space-y-2">
                          <a href="https://github.com/ALICTF" target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group/link">
                              <div className="flex items-center gap-3">
                                  <Github size={16} className="text-slate-400 group-hover/link:text-white" />
                                  <span className="text-xs text-slate-300">GitHub</span>
                              </div>
                              <ArrowLeft size={12} className="text-slate-500 -rotate-45 group-hover/link:text-white" />
                          </a>
                          
                          <a href="https://t.me/moskha" target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group/link">
                              <div className="flex items-center gap-3">
                                  <MessageCircle size={16} className="text-blue-400" />
                                  <span className="text-xs text-slate-300">Telegram</span>
                              </div>
                              <ArrowLeft size={12} className="text-slate-500 -rotate-45 group-hover/link:text-white" />
                          </a>

                          <a href="tel:09157152958" className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group/link">
                              <div className="flex items-center gap-3">
                                  <Smartphone size={16} className="text-emerald-400" />
                                  <span className="text-xs text-slate-300">0915-715-2958</span>
                              </div>
                              <ArrowLeft size={12} className="text-slate-500 -rotate-45 group-hover/link:text-white" />
                          </a>
                      </div>

                      {/* Arrow Pointer */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1e293b] border-r border-b border-white/10 rotate-45"></div>
                  </div>
              </div>

          </div>
        </div>
      </div>
    </footer>
  );
}