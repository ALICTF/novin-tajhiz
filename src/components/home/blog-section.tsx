"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, BookOpen, UserCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const articles = [
  {
    id: 1,
    title: "راهنمای جامع خرید دستگاه CPAP و BiPAP",
    excerpt: "تفاوت‌های اصلی بین دستگاه‌های کمک تنفسی چیست و کدام مدل برای آپنه شما بهتر است؟",
    date: "۲۵ آذر ۱۴۰۳",
    readTime: "۵ دقیقه",
    category: "راهنمای خرید",
    author: "دکتر خواب",
    image: "https://placehold.co/800x600/f1f5f9/1e293b?text=CPAP+Device",
  },
  {
    id: 2,
    title: "۵ علامت خطرناک آپنه خواب در مردان",
    excerpt: "خروپف‌های بلند و خستگی مفرط روزانه را جدی بگیرید؛ شاید زنگ خطری برای سلامت قلب باشد.",
    date: "۲۰ آذر ۱۴۰۳",
    readTime: "۳ دقیقه",
    category: "پزشکی",
    author: "تیم علمی",
    image: "https://placehold.co/800x600/f1f5f9/1e293b?text=Sleep+Danger",
  },
  {
    id: 3,
    title: "آموزش تصویری شستشوی ماسک و لوله",
    excerpt: "راهنمای گام‌به‌گام ضدعفونی کردن تجهیزات تنفسی برای جلوگیری از عفونت‌های ریوی.",
    date: "۱۵ آذر ۱۴۰۳",
    readTime: "۷ دقیقه",
    category: "آموزشی",
    author: "واحد فنی",
    image: "https://placehold.co/800x600/f1f5f9/1e293b?text=Cleaning",
  },
];

export function BlogSection() {
  return (
    <section className="py-24 bg-slate-50 border-none">
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <Badge variant="secondary" className="px-4 py-1.5 bg-white text-slate-600 border border-slate-200 shadow-sm rounded-full">
            <BookOpen className="w-3.5 h-3.5 mr-2 text-primary" />
            مجله نوین تجهیز
          </Badge>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.2]">
            دانستنی‌های تخصصی <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              خواب و تکنولوژی پزشکی
            </span>
          </h2>
          
          <p className="text-slate-500 max-w-2xl text-lg font-light leading-relaxed">
            بررسی‌های تخصصی، اخبار پزشکی و راهنماهای کاربردی برای استفاده بهتر از تجهیزات.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link 
                href={`/blog/${article.id}`} 
                key={article.id}
                className="group flex flex-col bg-white p-3 rounded-[32px] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 ease-out"
            >
              
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-slate-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 right-4 z-10">
                    <span className="bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {article.category}
                    </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 px-4 pt-6 pb-2">
                
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-medium">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-primary" />
                        <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <UserCircle2 size={16} />
                        <span>{article.author}</span>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-3 leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {article.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                    {article.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                        مطالعه مقاله
                    </span>
                    
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                        <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                    </div>
                </div>
              </div>

            </Link>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
            <Button variant="outline" className="rounded-full h-12 px-8 border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400 bg-transparent transition-all">
                مشاهده آرشیو
            </Button>
        </div>

      </div>
    </section>
  );
}