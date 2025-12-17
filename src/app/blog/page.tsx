"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, Clock, ChevronLeft, Hash, ArrowUpRight, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock Data
const categories = ["همه مطالب", "راهنمای خرید", "سلامت خواب", "تکنولوژی", "اخبار شرکت"];

const articles = [
  {
    id: 1,
    title: "انقلاب هوش مصنوعی در تشخیص آپنه خواب",
    excerpt: "چگونه الگوریتم‌های جدید می‌توانند بدون نیاز به تست‌های گران‌قیمت PSG، اختلالات خواب را با دقت ۹۹٪ تشخیص دهند؟",
    image: "https://placehold.co/1200x600/1e293b/ffffff?text=AI+Sleep",
    category: "تکنولوژی",
    author: "مهندس حاجی‌میرزایی",
    date: "۲ دی ۱۴۰۳",
    readTime: "۸ دقیقه",
    isFeatured: true,
  },
  {
    id: 2,
    title: "راهنمای تنظیم رطوبت‌ساز دستگاه CPAP",
    excerpt: "خشکی دهان و بینی یکی از مشکلات شایع بیماران است. در این مقاله نحوه تنظیم دقیق سطح رطوبت را آموزش می‌دهیم.",
    image: "https://placehold.co/600x400/f1f5f9/1e293b?text=Humidifier",
    category: "آموزشی",
    author: "تیم فنی",
    date: "۳۰ آذر ۱۴۰۳",
    readTime: "۵ دقیقه",
    isFeatured: false,
  },
  {
    id: 3,
    title: "تفاوت ماسک‌های Full Face و Nasal",
    excerpt: "کدام ماسک برای شما مناسب‌تر است؟ بررسی مزایا و معایب انواع ماسک‌های تنفسی بر اساس فرم صورت.",
    image: "https://placehold.co/600x400/f1f5f9/1e293b?text=Masks",
    category: "راهنمای خرید",
    author: "دکتر حسینی",
    date: "۲۵ آذر ۱۴۰۳",
    readTime: "۶ دقیقه",
    isFeatured: false,
  },
  {
    id: 4,
    title: "تاثیر خواب بی‌کیفیت بر فشار خون",
    excerpt: "ارتباط مستقیم بین آپنه خواب درمان نشده و بیماری‌های قلبی عروقی چیست؟",
    image: "https://placehold.co/600x400/f1f5f9/1e293b?text=Health",
    category: "سلامت خواب",
    author: "تحریریه نوین تجهیز",
    date: "۲۰ آذر ۱۴۰۳",
    readTime: "۴ دقیقه",
    isFeatured: false,
  },
  {
    id: 5,
    title: "رونمایی از دستگاه جدید ResMed AirSense 11",
    excerpt: "نقد و بررسی کامل جدیدترین محصول شرکت رزمد با قابلیت اتصال به فضای ابری.",
    image: "https://placehold.co/600x400/f1f5f9/1e293b?text=AirSense+11",
    category: "اخبار شرکت",
    author: "واحد فروش",
    date: "۱۵ آذر ۱۴۰۳",
    readTime: "۱۰ دقیقه",
    isFeatured: false,
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("همه مطالب");

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* --- 1. Hero & Search --- */}
      {/* تغییر: pt-32 برای فاصله گرفتن از هدر ثابت */}
      <section className="bg-white border-b border-slate-200 pt-32 pb-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-right">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                مجله تخصصی <span className="text-primary">نوین تجهیز</span>
              </h1>
              <p className="text-slate-500 text-lg font-light">
                مرجع علمی مقالات خواب و تنفس در ایران
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input 
                        placeholder="جستجو در مقالات..." 
                        className="pr-12 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 rounded-2xl shadow-sm text-base"
                    />
                </div>
            </div>
          </div>

          {/* Categories Scroll */}
          <div className="mt-12 flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat, idx) => (
                <button
                    key={idx}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                        activeCategory === cat 
                        ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-105" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-800"
                    }`}
                >
                    {cat}
                </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl mt-12">
        
        {/* --- 2. Featured Article (Big Card) --- */}
        {articles.filter(a => a.isFeatured).map(article => (
            <Link href={`/blog/${article.id}`} key={article.id} className="group block mb-16 relative">
                <div className="relative w-full aspect-[21/9] md:aspect-[21/8] rounded-[40px] overflow-hidden shadow-2xl">
                    <Image 
                        src={article.image} 
                        alt={article.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                    
                    <div className="absolute bottom-0 right-0 p-6 md:p-12 w-full md:max-w-3xl">
                        <Badge className="bg-primary hover:bg-primary text-white mb-4 px-3 py-1">
                            {article.category}
                        </Badge>
                        <h2 className="text-2xl md:text-5xl font-black text-white mb-4 leading-tight group-hover:text-blue-200 transition-colors">
                            {article.title}
                        </h2>
                        <p className="text-slate-300 text-lg mb-6 line-clamp-2 md:line-clamp-none">
                            {article.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
                            <div className="flex items-center gap-2">
                                <UserCircle2 size={18} />
                                {article.author}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={18} />
                                {article.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} />
                                {article.readTime} مطالعه
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        ))}

        {/* --- 3. Articles Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.filter(a => !a.isFeatured).map((article) => (
                <Link href={`/blog/${article.id}`} key={article.id} className="group flex flex-col bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500">
                    
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <Image 
                            src={article.image} 
                            alt={article.title} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute top-4 right-4">
                            <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                {article.category}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                            <span className="flex items-center gap-1"><Calendar size={12}/> {article.date}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1"><Clock size={12}/> {article.readTime}</span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                        </h3>
                        
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                            {article.excerpt}
                        </p>

                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">
                            <span>ادامه مطلب</span>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <ArrowUpRight size={16} />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>

        {/* --- 4. Pagination --- */}
        <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                <Button variant="ghost" size="sm" disabled className="rounded-full w-10 h-10 p-0 text-slate-400">
                    <ChevronLeft className="rotate-180" size={18} />
                </Button>
                <Button variant="default" size="sm" className="rounded-full w-10 h-10 p-0 bg-primary text-white shadow-md">1</Button>
                <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 text-slate-600 hover:bg-slate-100">2</Button>
                <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 text-slate-600 hover:bg-slate-100">3</Button>
                <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 text-slate-600 hover:bg-slate-100">
                    <ChevronLeft size={18} />
                </Button>
            </div>
        </div>

        {/* --- 5. Newsletter Banner --- */}
        <div className="mt-24 bg-slate-900 rounded-[40px] p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-primary mb-2">
                    <Hash size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white">عضویت در خبرنامه علمی</h2>
                <p className="text-slate-400 text-lg">
                    جدیدترین مقالات و تخفیف‌های ویژه تجهیزات را در ایمیل خود دریافت کنید.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <Input placeholder="آدرس ایمیل شما..." className="h-12 bg-white/10 border-white/10 text-white placeholder:text-slate-500 rounded-xl" />
                    <Button className="h-12 bg-primary hover:bg-primary/90 text-white px-8 rounded-xl font-bold">عضویت</Button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}