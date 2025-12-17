"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, SlidersHorizontal, ChevronDown, Search, ShoppingCart, Eye, LayoutGrid, List, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// --- Mock Data ---
const categories = [
  { id: "mask", name: "ماسک‌های تنفسی", count: 12 },
  { id: "cpap", name: "دستگاه‌های CPAP", count: 5 },
  { id: "bipap", name: "دستگاه‌های BiPAP", count: 3 },
  { id: "accessories", name: "لوازم جانبی و مصرفی", count: 24 },
  { id: "diagnostic", name: "تجهیزات تست خواب", count: 8 },
];

const brands = ["ResMed", "Philips Respironics", "BMC", "Lowenstein", "Fisher & Paykel"];

const products = [
  {
    id: 1,
    name: "ماسک تمام صورت AirFit F20",
    price: "۴,۵۰۰,۰۰۰ تومان",
    image: "https://placehold.co/500x500/f8fafc/1e293b?text=AirFit+F20",
    brand: "ResMed",
    category: "ماسک‌های تنفسی",
    isNew: true,
  },
  {
    id: 2,
    name: "دستگاه اتو سیپپ DreamStation 2",
    price: "تماس بگیرید",
    image: "https://placehold.co/500x500/f8fafc/1e293b?text=DreamStation",
    brand: "Philips",
    category: "دستگاه‌های CPAP",
    isNew: false,
  },
  {
    id: 3,
    name: "الکترودهای مصرفی PSG",
    price: "۱,۲۰۰,۰۰۰ تومان",
    image: "https://placehold.co/500x500/f8fafc/1e293b?text=Electrodes",
    brand: "Natus",
    category: "لوازم جانبی",
    isNew: false,
  },
  {
    id: 4,
    name: "لوله خرطومی گرمکن‌دار",
    price: "۳,۸۰۰,۰۰۰ تومان",
    image: "https://placehold.co/500x500/f8fafc/1e293b?text=Heated+Tube",
    brand: "ResMed",
    category: "لوازم جانبی",
    isNew: false,
  },
  {
    id: 5,
    name: "ماسک بینی N20",
    price: "۳,۹۰۰,۰۰۰ تومان",
    image: "https://placehold.co/500x500/f8fafc/1e293b?text=N20+Mask",
    brand: "ResMed",
    category: "ماسک‌های تنفسی",
    isNew: false,
  },
  {
    id: 6,
    name: "فیلتر آنتی باکتریال",
    price: "۱۵۰,۰۰۰ تومان",
    image: "https://placehold.co/500x500/f8fafc/1e293b?text=Filter",
    brand: "BMC",
    category: "لوازم جانبی",
    isNew: false,
  },
];

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* --- Page Header --- */}
      {/* تغییر: استفاده از pt-32 برای فاصله گرفتن از هدر سایت */}
      <div className="bg-white border-b border-slate-200 pt-32 pb-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                        فروشگاه محصولات
                    </h1>
                    <p className="text-slate-500 text-sm">
                        نمایش <span className="font-bold text-slate-900">۱۲</span> محصول از <span className="font-bold text-slate-900">۵۴</span> محصول موجود
                    </p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input 
                        placeholder="جستجو در بین محصولات..." 
                        className="pr-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* --- Sidebar Filters (Sticky) --- */}
            <aside className="hidden lg:block lg:col-span-1 sticky top-24 space-y-6 h-fit overflow-y-auto pr-1">
                
                {/* Categories */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <List size={18} className="text-primary" />
                        دسته‌بندی‌ها
                    </h3>
                    <ul className="space-y-3">
                        {categories.map((cat) => (
                            <li key={cat.id}>
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded border border-slate-300 group-hover:border-primary group-hover:bg-primary/10 transition-colors flex items-center justify-center text-primary">
                                            {/* چک باکس کاستوم */}
                                        </div>
                                        <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{cat.name}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">{cat.count}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Brands */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Filter size={18} className="text-primary" />
                        برندها
                    </h3>
                    <div className="space-y-3">
                        {brands.map((brand, idx) => (
                            <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                <div className="w-4 h-4 rounded border border-slate-300 group-hover:border-primary transition-colors" />
                                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <SlidersHorizontal size={18} className="text-primary" />
                        محدوده قیمت
                    </h3>
                    
                    <div className="h-2 bg-slate-100 rounded-full mb-4 relative">
                        <div className="absolute right-0 left-1/2 h-full bg-primary rounded-full opacity-50" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow border-2 border-white cursor-pointer hover:scale-110 transition-transform" />
                        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow border-2 border-white cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono dir-ltr">
                        <span>0</span>
                        <span>50,000,000</span>
                    </div>
                </div>

            </aside>

            {/* --- Main Content --- */}
            <div className="lg:col-span-3">
                
                {/* Toolbar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 ml-2">مرتب‌سازی:</span>
                        <Button variant="ghost" size="sm" className="font-normal text-slate-900 hover:bg-slate-100">
                            پربازدیدترین
                            <ChevronDown size={14} className="mr-2" />
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 border-r border-slate-100 pr-4 mr-auto sm:mr-0">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={viewMode === 'grid' ? "bg-slate-100 text-slate-900" : "text-slate-400"}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={18} />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={viewMode === 'list' ? "bg-slate-100 text-slate-900" : "text-slate-400"}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} />
                        </Button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {products.map((product) => (
                        <div 
                            key={product.id} 
                            className={`group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-500 ${viewMode === 'list' ? 'flex flex-row items-center p-4 gap-6' : 'flex flex-col'}`}
                        >
                            {/* Image Section */}
                            <div className={`relative bg-slate-50 overflow-hidden ${viewMode === 'list' ? 'w-48 h-48 rounded-2xl shrink-0' : 'aspect-square w-full p-8'}`}>
                                <Image 
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                                />
                                {product.isNew && (
                                    <Badge className="absolute top-3 right-3 bg-blue-500 hover:bg-blue-600 border-none shadow-sm z-10">
                                        جدید
                                    </Badge>
                                )}
                                
                                {/* Quick Actions (Grid Mode) */}
                                {viewMode === 'grid' && (
                                    <div className="absolute inset-x-4 bottom-4 flex gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                        <Button className="flex-1 bg-slate-900 hover:bg-primary text-white h-10 rounded-xl text-xs gap-2 shadow-lg cursor-pointer">
                                            <ShoppingCart size={14} />
                                            افزودن
                                        </Button>
                                        <Link href={`/products/${product.id}`} className="contents">
                                            <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl bg-white text-slate-700 shadow-lg cursor-pointer">
                                                <Eye size={16} />
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className={`flex flex-col ${viewMode === 'list' ? 'flex-1 py-2 items-start text-right' : 'p-5 items-center text-center'}`}>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    {product.brand}
                                </div>
                                <h3 className={`font-bold text-slate-900 group-hover:text-primary transition-colors ${viewMode === 'list' ? 'text-xl mb-2' : 'text-base mb-4 line-clamp-2 min-h-[3rem]'}`}>
                                    <Link href={`/products/${product.id}`}>
                                        {product.name}
                                    </Link>
                                </h3>
                                
                                {viewMode === 'list' && (
                                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 max-w-lg">
                                        این محصول با جدیدترین تکنولوژی روز دنیا ساخته شده است و دارای گارانتی معتبر شرکتی می‌باشد. برای اطلاعات بیشتر صفحه جزئیات را مشاهده کنید.
                                    </p>
                                )}

                                <div className={`mt-auto ${viewMode === 'list' ? 'flex items-center gap-4 w-full' : 'w-full pt-4 border-t border-slate-50'}`}>
                                    <div className={`font-bold rounded-lg ${product.price.includes("تماس") ? "text-slate-500 bg-slate-100 px-3 py-1 text-xs" : "text-slate-900 text-lg"}`}>
                                        {product.price}
                                    </div>
                                    
                                    {viewMode === 'list' && (
                                        <div className="mr-auto flex gap-3">
                                            <Link href={`/products/${product.id}`}>
                                                <Button size="icon" variant="outline" className="rounded-xl">
                                                    <Eye size={18} />
                                                </Button>
                                            </Link>
                                            <Button className="rounded-xl px-6 bg-slate-900 hover:bg-primary text-white">
                                                افزودن به سبد خرید
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                        <Button variant="ghost" size="sm" disabled className="rounded-full w-10 h-10 p-0 text-slate-400">قبلی</Button>
                        <Button variant="default" size="sm" className="rounded-full w-10 h-10 p-0 bg-primary text-white shadow-md">1</Button>
                        <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 text-slate-600 hover:bg-slate-100">2</Button>
                        <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 text-slate-600 hover:bg-slate-100">3</Button>
                        <span className="text-slate-400 px-2">...</span>
                        <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 text-slate-600 hover:bg-slate-100">بعدی</Button>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}