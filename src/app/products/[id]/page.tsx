"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, ShieldCheck, Truck, Phone, ChevronLeft, 
  Minus, Plus, Heart, Share2, FileText, Zap, Ruler, 
  CheckCircle2, ArrowRight, ThumbsUp, HelpCircle, 
  RotateCcw, User, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- Mock Data ---

const product = {
  id: 1,
  title: "دستگاه اتو سیپپ ResMed AirSense 10 AutoSet",
  brand: "ResMed",
  price: "۴۵,۰۰۰,۰۰۰",
  oldPrice: "۴۸,۰۰۰,۰۰۰",
  rating: 4.8,
  reviewsCount: 124,
  sku: "RES-10-AUTO",
  description: "پیشرفته‌ترین دستگاه کمک تنفسی هوشمند با قابلیت تشخیص خودکار انسداد راه هوایی. دارای مرطوب‌کننده یکپارچه و قابلیت اتصال بی‌سیم جهت پایش داده‌های خواب بیمار. این دستگاه با الگوریتم AutoSet Response راحتی بیمار را در طول شب تضمین می‌کند.",
  features: [
    { icon: Zap, label: "میزان صدا", value: "26 dBA (بسیار کم‌صدا)" },
    { icon: Ruler, label: "وزن دستگاه", value: "1.2 kg" },
    { icon: ShieldCheck, label: "گارانتی", value: "۲ ساله شرکتی" },
    { icon: FileText, label: "مد کاری", value: "Auto CPAP / CPAP" },
  ],
  images: [
    "https://placehold.co/600x600/f1f5f9/1e293b?text=Main+Device",
    "https://placehold.co/600x600/f1f5f9/1e293b?text=Humidifier",
    "https://placehold.co/600x600/f1f5f9/1e293b?text=Mask+Fit",
    "https://placehold.co/600x600/f1f5f9/1e293b?text=Screen+UI",
  ]
};

const relatedProducts = [
    { id: 2, name: "ماسک تمام صورت F20", price: "۴,۵۰۰,۰۰۰ تومان", image: "https://placehold.co/400x400/f8fafc/1e293b?text=F20" },
    { id: 3, name: "لوله خرطومی ClimateLine", price: "۲,۸۰۰,۰۰۰ تومان", image: "https://placehold.co/400x400/f8fafc/1e293b?text=Tube" },
    { id: 4, name: "فیلتر هایپوآلرژنیک", price: "۳۵۰,۰۰۰ تومان", image: "https://placehold.co/400x400/f8fafc/1e293b?text=Filter" },
    { id: 5, name: "دستگاه BiPAP Lumis 150", price: "تماس بگیرید", image: "https://placehold.co/400x400/f8fafc/1e293b?text=Lumis" },
];

const reviews = [
    { id: 1, user: "علی محمدی", date: "۱۲ آذر ۱۴۰۳", rating: 5, text: "واقعاً دستگاه بیوصدایی هست. من قبلاً مدل‌های چینی داشتم ولی این اصلاً قابل مقایسه نیست. ممنون از مشاوره خوبتون." },
    { id: 2, user: "سارا احمدی", date: "۱۰ آذر ۱۴۰۳", rating: 4, text: "دستگاه عالیه ولی قیمتش یکم بالاست. البته با توجه به کیفیت خوابی که میده ارزشش رو داره." },
    { id: 3, user: "دکتر کمالی", date: "۵ آذر ۱۴۰۳", rating: 5, text: "به عنوان پزشک متخصص ریه، این مدل رو به تمام بیمارانم پیشنهاد میکنم. الگوریتم تشخیصش عالی عمل میکنه." },
];

const faqs = [
    { q: "آیا این دستگاه دارای کارت حافظه است؟", a: "بله، دستگاه دارای کارت SD برای ذخیره اطلاعات خواب تا یک سال می‌باشد." },
    { q: "آیا مرطوب‌کننده دستگاه جدا می‌شود؟", a: "خیر، در مدل AirSense 10 مرطوب‌کننده به صورت یکپارچه طراحی شده است اما مخزن آب قابل جدا شدن و شستشو است." },
    { q: "تفاوت مدل AutoSet با Elite چیست؟", a: "مدل AutoSet فشار را به صورت اتوماتیک بر اساس نیاز بیمار تنظیم می‌کند، اما مدل Elite روی فشار ثابت کار می‌کند." },
];

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* --- Breadcrumb --- */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
            <Link href="/" className="hover:text-primary transition-colors">خانه</Link>
            <ChevronLeft size={14} className="rtl:rotate-180" />
            <Link href="/products" className="hover:text-primary transition-colors">محصولات</Link>
            <ChevronLeft size={14} className="rtl:rotate-180" />
            <Link href="/products/cpap" className="hover:text-primary transition-colors">دستگاه‌های CPAP</Link>
            <ChevronLeft size={14} className="rtl:rotate-180" />
            <span className="text-slate-900 font-bold">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* --- Left Column: Gallery (Sticky) --- */}
            <div className="lg:col-span-7">
                <div className="sticky top-32 space-y-6">
                    {/* Main Image Stage */}
                    <div className="relative aspect-square w-full bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden group">
                        <Image 
                            src={product.images[selectedImage]} 
                            alt={product.title}
                            fill
                            className="object-contain p-12 transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                        />
                        <div className="absolute top-6 left-6 z-10">
                            <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-none px-3 py-1 text-sm font-bold shadow-md">
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
                                className={`relative aspect-square rounded-2xl border-2 overflow-hidden bg-white transition-all duration-300 ${selectedImage === idx ? 'border-primary ring-4 ring-primary/10 scale-95' : 'border-slate-100 hover:border-slate-300 hover:shadow-md'}`}
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
                        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star size={16} fill="currentColor" />
                            <span className="text-sm font-bold text-slate-700 pt-0.5">{product.rating}</span>
                            <span className="text-xs text-slate-400 pt-0.5 border-r border-slate-300 mr-2 pr-2">({product.reviewsCount} دیدگاه)</span>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                        {product.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono text-xs">SKU: {product.sku}</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                            <CheckCircle2 size={14} />
                            موجود و آماده ارسال
                        </span>
                    </div>
                </div>

                {/* Price & Actions Box */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl shadow-slate-200/40 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-primary" />
                    
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <span className="text-slate-400 text-sm line-through decoration-rose-500">{product.oldPrice}</span>
                            <div className="flex items-center gap-1">
                                <span className="text-3xl font-black text-slate-900">{product.price}</span>
                                <span className="text-sm text-slate-500 mb-1">تومان</span>
                            </div>
                        </div>
                        <div className="bg-rose-100 text-rose-600 px-3 py-1.5 rounded-xl text-xs font-bold animate-pulse">
                            ۵٪ تخفیف محدود
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
                        <Button className="flex-1 h-12 rounded-xl text-lg font-bold bg-slate-900 hover:bg-primary shadow-lg shadow-slate-900/20 text-white transition-all">
                            افزودن به سبد خرید
                        </Button>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                        <div className="flex flex-col items-center text-center gap-1">
                            <Truck size={20} className="text-slate-400" />
                            <span className="text-[10px] text-slate-500">ارسال رایگان</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-1 border-r border-slate-100">
                            <ShieldCheck size={20} className="text-slate-400" />
                            <span className="text-[10px] text-slate-500">ضمانت اصالت</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-1 border-r border-slate-100">
                            <RotateCcw size={20} className="text-slate-400" />
                            <span className="text-[10px] text-slate-500">۷ روز بازگشت</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 px-2">
                    <button className="flex items-center gap-2 hover:text-rose-500 transition-colors group">
                        <Heart size={18} className="group-hover:fill-rose-500" />
                        افزودن به علاقه‌مندی
                    </button>
                    <button className="flex items-center gap-2 hover:text-primary transition-colors">
                        <Share2 size={18} />
                        اشتراک‌گذاری
                    </button>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {product.features.map((feat, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm hover:border-primary/30 transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                                <feat.icon size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-xs text-slate-400 truncate">{feat.label}</div>
                                <div className="font-bold text-slate-900 dir-ltr text-right truncate text-sm">{feat.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact for Expert */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-2xl text-blue-900">
                    <div className="bg-white p-3 rounded-full shadow-sm shrink-0 text-primary">
                        <Phone size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-sm mb-1">نیاز به مشاوره تخصصی دارید؟</div>
                        <div className="text-xs text-slate-600">تماس مستقیم با مهندسین فنی (۸ صبح تا ۱۰ شب)</div>
                        <div className="dir-ltr font-mono font-bold text-lg text-primary mt-1">0915-425-6458</div>
                    </div>
                </div>

            </div>
        </div>

        <Separator className="my-20" />

        {/* --- Tabs Section --- */}
        <Tabs defaultValue="specs" className="w-full">
            <div className="flex justify-center mb-10">
                <TabsList className="bg-slate-100 p-1.5 rounded-full h-auto shadow-inner">
                    <TabsTrigger value="specs" className="rounded-full px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all font-bold text-slate-600">مشخصات فنی</TabsTrigger>
                    <TabsTrigger value="desc" className="rounded-full px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all font-bold text-slate-600">توضیحات و پرسش‌ها</TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-full px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all font-bold text-slate-600">نظرات کاربران ({product.reviewsCount})</TabsTrigger>
                </TabsList>
            </div>
            
            <TabsContent value="specs" className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-2xl font-bold text-slate-900 mb-8 border-r-4 border-primary pr-4">جدول مشخصات کامل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                    {[1,2,3,4,5,6,7,8].map((i) => (
                        <div key={i} className="flex justify-between py-4 border-b border-slate-100 hover:bg-slate-50 px-4 rounded-xl transition-colors">
                            <span className="text-slate-500 font-medium">ویژگی فنی شماره {i}</span>
                            <span className="font-bold text-slate-800">مقداری برای تست</span>
                        </div>
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="desc" className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 prose prose-slate max-w-none text-justify leading-loose">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">نقد و بررسی تخصصی</h3>
                        <p>{product.description}</p>
                        <p>این دستگاه با استفاده از موتور توربینی جدید خود، صدای بسیار کمی تولید می‌کند که برای خواب راحت بیمار و اطرافیان او حیاتی است. همچنین سیستم مرطوب‌کننده HumidAir به کار رفته در آن، از خشکی گلو و بینی جلوگیری می‌کند.</p>
                        <h4 className="font-bold mt-6 mb-2 text-slate-800">مزایای اصلی:</h4>
                        <ul className="list-disc list-inside space-y-2 marker:text-primary">
                            <li>تشخیص هوشمند رویدادهای تنفسی</li>
                            <li>شروع خودکار (SmartStart)</li>
                            <li>قابلیت کاهش فشار بازدمی (EPR)</li>
                        </ul>
                    </div>
                    
                    {/* FAQ Section inside Description Tab */}
                    <div className="bg-slate-50 p-6 rounded-3xl h-fit">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <HelpCircle className="text-primary" />
                            سوالات متداول
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="border-b-slate-200">
                                    <AccordionTrigger className="text-sm font-bold text-slate-700 hover:no-underline hover:text-primary text-right">{faq.q}</AccordionTrigger>
                                    <AccordionContent className="text-slate-600 text-sm leading-relaxed">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </TabsContent>

             <TabsContent value="reviews" className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Rating Summary */}
                    <div className="lg:col-span-4 bg-slate-50 p-8 rounded-3xl text-center h-fit">
                        <div className="text-6xl font-black text-slate-900 mb-2">{product.rating}</div>
                        <div className="flex justify-center gap-1 text-amber-400 mb-2">
                            {[1,2,3,4,5].map(i => <Star key={i} size={24} fill="currentColor" />)}
                        </div>
                        <p className="text-slate-500 text-sm mb-8">از مجموع {product.reviewsCount} نظر ثبت شده</p>
                        
                        <div className="space-y-3">
                            {[5,4,3,2,1].map(star => (
                                <div key={star} className="flex items-center gap-3 text-sm">
                                    <span className="w-3 font-bold">{star}</span>
                                    <Star size={12} className="text-slate-400" />
                                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-400 rounded-full" style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }} />
                                    </div>
                                    <span className="text-slate-400 text-xs w-8 text-left">{star === 5 ? '70%' : '...'}</span>
                                </div>
                            ))}
                        </div>
                        
                        <Button className="w-full mt-8 bg-slate-900 text-white rounded-xl">ثبت دیدگاه جدید</Button>
                    </div>

                    {/* Review List */}
                    <div className="lg:col-span-8 space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{review.user}</div>
                                            <div className="text-xs text-slate-400">{review.date}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-amber-600 text-sm font-bold">
                                        <span>{review.rating}</span>
                                        <Star size={12} fill="currentColor" />
                                    </div>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl rounded-tr-none">
                                    {review.text}
                                </p>
                                <div className="flex items-center gap-4 mt-3">
                                    <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-green-600 transition-colors">
                                        <ThumbsUp size={14} />
                                        مفید بود (۲)
                                    </button>
                                    <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                                        <MessageCircle size={14} />
                                        پاسخ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </TabsContent>
        </Tabs>

        {/* --- Related Products Section --- */}
        <div className="mt-24">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">محصولات مکمل و مشابه</h2>
                <Link href="/products" className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    مشاهده همه <ArrowRight size={16} />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((item) => (
                    <Link href={`/products/${item.id}`} key={item.id} className="group bg-white p-4 rounded-3xl border border-slate-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                        <div className="relative aspect-square mb-4 bg-slate-50 rounded-2xl overflow-hidden">
                            <Image src={item.image} alt={item.name} fill className="object-contain p-4 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                        <div className="text-slate-500 text-sm font-medium">{item.price}</div>
                    </Link>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}