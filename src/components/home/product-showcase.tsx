"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const products = [
  {
    id: 1,
    name: "الکترود گیره گوش (Ear Clip)",
    price: "تماس بگیرید",
    category: "الکترودها",
    image: "https://placehold.co/600x600/f8fafc/1e293b?text=Ear+Clip",
    tag: "پرفروش",
    isNew: false,
  },
  {
    id: 2,
    name: "اسنپ الکترود اورجینال",
    price: "1,200,000 تومان",
    category: "مصرفی",
    image: "https://placehold.co/600x600/f8fafc/1e293b?text=Snap+Electrode",
    isNew: true,
  },
  {
    id: 3,
    name: "الکتروژل نوار مغز (EEG Paste)",
    price: "تماس بگیرید",
    category: "ژل و چسب",
    image: "https://placehold.co/600x600/f8fafc/1e293b?text=EEG+Gel",
    tag: "ویژه",
    isNew: false,
  },
  {
    id: 4,
    name: "گاپ الکترود گلد (Gold Cup)",
    price: "تماس بگیرید",
    category: "الکترودها",
    image: "https://placehold.co/600x600/f8fafc/1e293b?text=Gold+Cup",
    isNew: false,
  },
  {
    id: 5,
    name: "ماسک تمام صورت (Full Face)",
    price: "4,500,000 تومان",
    category: "ماسک‌ها",
    image: "https://placehold.co/600x600/f8fafc/1e293b?text=Full+Mask",
    isNew: false,
  },
  {
    id: 6,
    name: "لوله خرطومی تنفسی",
    price: "تماس بگیرید",
    category: "لوازم جانبی",
    image: "https://placehold.co/600x600/f8fafc/1e293b?text=Tube",
    isNew: false,
  },
  {
    id: 7,
    name: "فیلتر آنتی‌باکتریال",
    price: "تماس بگیرید",
    category: "فیلترها",
    image: "https://placehold.co/600x600/f8fafc/1e293b?text=Filter",
    isNew: false,
  },
  {
    id: 8,
    name: "دستگاه CPAP رسمد",
    price: "تماس بگیرید",
    category: "دستگاه‌ها",
    image: "https://placehold.co/600x600/f8fafc/1e293b?text=CPAP+Resmed",
    tag: "پیشنهاد ما",
    isNew: true,
  },
];

export function ProductShowcase() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 border-t border-white w-full flex flex-col items-center">
      
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20 space-y-5">
          <Badge variant="outline" className="px-4 py-1.5 bg-white text-primary border-primary/20 shadow-sm rounded-full backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 mr-2 animate-pulse" />
            ویترین محصولات
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            برترین تجهیزات <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">پلی‌سومنوگرافی</span>
          </h2>
          <p className="text-slate-500 max-w-2xl text-lg leading-relaxed">
            مجموعه‌ای از دقیق‌ترین سنسورها و قطعات تخصصی با استاندارد جهانی.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
                key={product.id} 
                className="group relative flex flex-col h-full bg-white rounded-[32px] border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 ease-out overflow-visible"
            >
              
              {/* --- Image Pod (بخش تصویر) --- */}
              <div className="relative w-full aspect-[1/1] p-4">
                {/* کانتینر داخلی عکس با گوشه‌های گرد */}
                <div className="relative w-full h-full bg-slate-50 rounded-[24px] overflow-hidden flex items-center justify-center border border-slate-100 group-hover:border-primary/20 transition-colors duration-500">
                    
                    {/* Ambient Glow (نور پشت محصول در هاور) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
                    
                    {/* Product Image */}
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-8 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110 z-10"
                    />

                    {/* Action Capsule (دکمه‌های شناور وسط) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20">
                        <Button size="icon" className="h-12 w-12 rounded-full bg-slate-900 text-white hover:bg-primary shadow-xl hover:scale-110 transition-all duration-300">
                            <ShoppingCart size={20} />
                        </Button>
                        <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full bg-white text-slate-700 hover:text-primary shadow-xl hover:scale-110 transition-all duration-300">
                            <Eye size={20} />
                        </Button>
                    </div>
                </div>

                {/* Badges (خارج از کادر عکس برای تمیزی، اما روی کارت) */}
                <div className="absolute top-7 right-7 z-30 flex flex-col gap-2 pointer-events-none">
                    {product.isNew && (
                        <Badge className="bg-blue-600/90 backdrop-blur-md text-white border-none shadow-sm px-3 py-1 text-xs">
                            جدید
                        </Badge>
                    )}
                    {product.tag && (
                        <Badge className="bg-rose-500/90 backdrop-blur-md text-white border-none shadow-sm px-3 py-1 text-xs animate-in zoom-in">
                            {product.tag}
                        </Badge>
                    )}
                </div>
              </div>

              {/* --- Content Pod (بخش محتوا) --- */}
              <div className="px-6 pb-8 pt-2 flex flex-col flex-1 items-center text-center">
                
                <div className="text-[11px] font-bold text-primary/80 uppercase tracking-wider mb-2 bg-primary/5 px-2 py-1 rounded-md">
                    {product.category}
                </div>
                
                <h3 className="font-bold text-[17px] text-slate-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem] flex items-center">
                    {product.name}
                </h3>

                <div className="w-12 h-1 bg-slate-100 rounded-full my-4 group-hover:bg-primary/30 group-hover:w-20 transition-all duration-500" />

                <div className={cn(
                    "text-sm font-bold px-4 py-2 rounded-xl w-full",
                    product.price.includes("تماس") 
                        ? "text-slate-500 bg-slate-50 border border-slate-100" 
                        : "text-slate-900 bg-slate-50 border border-slate-200"
                )}>
                    {product.price}
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-24 flex justify-center">
            <Button variant="outline" size="lg" className="rounded-full h-16 px-10 text-lg border-2 border-slate-200 text-slate-700 bg-white hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group shadow-sm" asChild>
                <Link href="/products">
                    مشاهده کاتالوگ کامل
                    <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-2 transition-transform" />
                </Link>
            </Button>
        </div>

      </div>
    </section>
  );
}