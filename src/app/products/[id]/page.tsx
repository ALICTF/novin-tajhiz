"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, ShieldCheck, Truck, Phone, ChevronLeft, 
  Minus, Plus, Heart, Share2, FileText, Zap, Ruler, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Data for a single product
const product = {
  id: 1,
  title: "دستگاه اتو سیپپ ResMed AirSense 10 AutoSet",
  brand: "ResMed",
  price: "۴۵,۰۰۰,۰۰۰",
  oldPrice: "۴۸,۰۰۰,۰۰۰",
  rating: 4.8,
  reviews: 124,
  sku: "RES-10-AUTO",
  description: "پیشرفته‌ترین دستگاه کمک تنفسی هوشمند با قابلیت تشخیص خودکار انسداد راه هوایی. دارای مرطوب‌کننده یکپارچه و قابلیت اتصال بی‌سیم جهت پایش داده‌های خواب بیمار.",
  features: [
    { icon: Zap, label: "میزان صدا", value: "26 dBA" },
    { icon: Ruler, label: "وزن دستگاه", value: "1.2 kg" },
    { icon: ShieldCheck, label: "گارانتی", value: "۲ ساله" },
    { icon: FileText, label: "مد کاری", value: "Auto CPAP" },
  ],
  images: [
    "https://placehold.co/600x600/f1f5f9/1e293b?text=Main+Device",
    "https://placehold.co/600x600/f1f5f9/1e293b?text=Side+View",
    "https://placehold.co/600x600/f1f5f9/1e293b?text=Mask+Fit",
    "https://placehold.co/600x600/f1f5f9/1e293b?text=Screen+UI",
  ]
};

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    // تغییر: pt-32 برای فاصله گرفتن از هدر سایت
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* --- Breadcrumb --- */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
            <Link href="/" className="hover:text-primary transition-colors">خانه</Link>
            <ChevronLeft size={14} className="rtl:rotate-180" />
            <Link href="/products" className="hover:text-primary transition-colors">محصولات</Link>
            <ChevronLeft size={14} className="rtl:rotate-180" />
            <span className="text-slate-900 font-bold">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* --- Left Column: Gallery (Sticky) --- */}
            <div className="lg:col-span-7">
                {/* تغییر: top-32 برای اینکه وقتی اسکرول میشه زیر هدر گیر نکنه */}
                <div className="sticky top-32 space-y-6">
                    {/* Main Image Stage */}
                    <div className="relative aspect-square w-full bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden group">
                        <Image 
                            src={product.images[selectedImage]} 
                            alt={product.title}
                            fill
                            className="object-contain p-12 transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                        />
                        <div className="absolute top-6 left-6">
                            <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-none px-3 py-1">
                                فروش ویژه
                            </Badge>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`relative aspect-square rounded-2xl border-2 overflow-hidden bg-white transition-all duration-300 ${selectedImage === idx ? 'border-primary ring-4 ring-primary/10 scale-95' : 'border-slate-100 hover:border-slate-300'}`}
                            >
                                <Image src={img} alt="thumbnail" fill className="object-contain p-2 mix-blend-multiply" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Right Column: Product Info --- */}
            <div className="lg:col-span-5 space-y-8">
                
                {/* Header Info */}
                <div className="space-y-4 border-b border-slate-200 pb-8">
                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1">
                            {product.brand}
                        </Badge>
                        <div className="flex items-center gap-1 text-amber-500">
                            <Star size={16} fill="currentColor" />
                            <span className="text-sm font-bold text-slate-700 pt-1">{product.rating}</span>
                            <span className="text-xs text-slate-400 pt-1">({product.reviews} دیدگاه)</span>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                        {product.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">SKU: {product.sku}</span>
                        <span className="text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle2 size={16} />
                            موجود در انبار
                        </span>
                    </div>
                </div>

                {/* Price & Actions Box */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg shadow-slate-200/50 space-y-6">
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <span className="text-slate-400 text-sm line-through decoration-rose-500">{product.oldPrice}</span>
                            <div className="flex items-center gap-1">
                                <span className="text-3xl font-black text-slate-900">{product.price}</span>
                                <span className="text-sm text-slate-500 mb-1">تومان</span>
                            </div>
                        </div>
                        <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-xs font-bold">
                            ۵٪ تخفیف
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-slate-200 rounded-xl h-12 px-2 bg-slate-50">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <Button className="flex-1 h-12 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                            افزودن به سبد خرید
                        </Button>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500 pt-2 border-t border-slate-50 mt-4">
                        <button className="flex items-center gap-2 hover:text-rose-500 transition-colors">
                            <Heart size={18} />
                            افزودن به علاقه‌مندی
                        </button>
                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Share2 size={18} />
                            اشتراک‌گذاری
                        </button>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {product.features.map((feat, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm hover:border-primary/30 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                                <feat.icon size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400">{feat.label}</div>
                                <div className="font-bold text-slate-900 dir-ltr text-right">{feat.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Description Text */}
                <div className="bg-slate-100/50 p-6 rounded-3xl border border-slate-200/50">
                    <h3 className="font-bold text-slate-900 mb-2">معرفی اجمالی</h3>
                    <p className="text-slate-600 leading-relaxed text-justify text-sm">
                        {product.description}
                    </p>
                </div>

                {/* Contact for Expert */}
                <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 p-4 rounded-2xl text-blue-800">
                    <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
                        <Phone size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <div className="font-bold text-sm">نیاز به مشاوره تخصصی دارید؟</div>
                        <div className="text-xs opacity-80 mt-1">تماس مستقیم با مهندسین فنی: <span className="dir-ltr font-mono font-bold">۰۹۱۵۴۲۵۶۴۵۸</span></div>
                    </div>
                </div>

            </div>
        </div>

        <Separator className="my-16" />

        {/* --- Tabs Section --- */}
        <Tabs defaultValue="specs" className="w-full">
            <div className="flex justify-center mb-8">
                <TabsList className="bg-slate-200/60 p-1 rounded-full h-auto">
                    <TabsTrigger value="specs" className="rounded-full px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-bold">مشخصات فنی</TabsTrigger>
                    <TabsTrigger value="desc" className="rounded-full px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-bold">توضیحات تکمیلی</TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-full px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-bold">نظرات کاربران</TabsTrigger>
                </TabsList>
            </div>
            
            <TabsContent value="specs" className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-2xl font-bold text-slate-900 mb-8 border-r-4 border-primary pr-4">جدول مشخصات کامل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    {[1,2,3,4,5,6].map((i) => (
                        <div key={i} className="flex justify-between py-4 border-b border-slate-100 hover:bg-slate-50 px-2 rounded-lg transition-colors">
                            <span className="text-slate-500">ویژگی فنی شماره {i}</span>
                            <span className="font-bold text-slate-800">مقداری برای تست</span>
                        </div>
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="desc" className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm">
                <div className="prose prose-slate max-w-none text-justify leading-loose">
                    <p>متن توضیحات طولانی و سئو شده درباره محصول در اینجا قرار می‌گیرد. این بخش می‌تواند شامل هدینگ‌های مختلف، لیست‌ها و تصاویر داخل متن باشد.</p>
                </div>
            </TabsContent>
             <TabsContent value="reviews" className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm">
                <p className="text-center text-slate-500">نظرات کاربران در اینجا بارگذاری می‌شود.</p>
            </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}