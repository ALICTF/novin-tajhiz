"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, SlidersHorizontal, ChevronDown, Search, ShoppingCart, Eye, LayoutGrid, List, Check, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"; // فرض بر وجود کامپوننت Sheet
import { cn } from "@/lib/utils";

// --- Types ---
interface Product {
  id: number;
  name: string;
  price: string;
  rawPrice: number;
  image: string;
  brand: string;
  category: string;
  categoryId: string;
  isNew: boolean;
}

// --- Mock Data ---
const categories = [
  { id: "mask", name: "ماسک‌های تنفسی", count: 12 },
  { id: "cpap", name: "دستگاه‌های CPAP", count: 5 },
  { id: "bipap", name: "دستگاه‌های BiPAP", count: 3 },
  { id: "accessories", name: "لوازم جانبی", count: 24 },
  { id: "diagnostic", name: "تجهیزات تست خواب", count: 8 },
];

const brands = ["ResMed", "Philips", "BMC", "Lowenstein", "Natus"];

const initialProducts: Product[] = [
  { id: 1, name: "ماسک تمام صورت AirFit F20", price: "۴,۵۰۰,۰۰۰ تومان", rawPrice: 4500000, image: "https://placehold.co/500x500/f8fafc/1e293b?text=AirFit+F20", brand: "ResMed", category: "ماسک‌های تنفسی", categoryId: "mask", isNew: true },
  { id: 2, name: "دستگاه اتو سیپپ DreamStation 2", price: "تماس بگیرید", rawPrice: 0, image: "https://placehold.co/500x500/f8fafc/1e293b?text=DreamStation", brand: "Philips", category: "دستگاه‌های CPAP", categoryId: "cpap", isNew: false },
  { id: 3, name: "الکترودهای مصرفی PSG", price: "۱,۲۰۰,۰۰۰ تومان", rawPrice: 1200000, image: "https://placehold.co/500x500/f8fafc/1e293b?text=Electrodes", brand: "Natus", category: "لوازم جانبی", categoryId: "accessories", isNew: false },
  { id: 4, name: "لوله خرطومی گرمکن‌دار", price: "۳,۸۰۰,۰۰۰ تومان", rawPrice: 3800000, image: "https://placehold.co/500x500/f8fafc/1e293b?text=Heated+Tube", brand: "ResMed", category: "لوازم جانبی", categoryId: "accessories", isNew: false },
  { id: 5, name: "ماسک بینی N20", price: "۳,۹۰۰,۰۰۰ تومان", rawPrice: 3900000, image: "https://placehold.co/500x500/f8fafc/1e293b?text=N20+Mask", brand: "ResMed", category: "ماسک‌های تنفسی", categoryId: "mask", isNew: false },
  { id: 6, name: "فیلتر آنتی باکتریال", price: "۱۵۰,۰۰۰ تومان", rawPrice: 150000, image: "https://placehold.co/500x500/f8fafc/1e293b?text=Filter", brand: "BMC", category: "لوازم جانبی", categoryId: "accessories", isNew: false },
  { id: 7, name: "دستگاه BiPAP S/T", price: "۵۵,۰۰۰,۰۰۰ تومان", rawPrice: 55000000, image: "https://placehold.co/500x500/f8fafc/1e293b?text=BiPAP", brand: "BMC", category: "دستگاه‌های BiPAP", categoryId: "bipap", isNew: true },
  { id: 8, name: "ماسک نازال DreamWear", price: "۴,۱۰۰,۰۰۰ تومان", rawPrice: 4100000, image: "https://placehold.co/500x500/f8fafc/1e293b?text=DreamWear", brand: "Philips", category: "ماسک‌های تنفسی", categoryId: "mask", isNew: false },
];

export default function ProductsPage() {
  // --- States ---
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000000 });
  const [sortOption, setSortOption] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Mobile Filter Sheet State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const itemsPerPage = 6;

  // --- Logic Hooks ---
  const filteredProducts = useMemo(() => {
    let result = initialProducts;

    // 1. Search
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 2. Categories
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.categoryId));
    }

    // 3. Brands
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // 4. Price (Ignoring "Call for price" which is 0)
    result = result.filter(p => {
        if (p.rawPrice === 0) return true; // Always show "Call for price"
        return p.rawPrice >= priceRange.min && p.rawPrice <= priceRange.max;
    });

    // 5. Sorting
    return result.sort((a, b) => {
      if (sortOption === "price-asc") {
         if (a.rawPrice === 0) return 1; // Put "Call for price" at end
         if (b.rawPrice === 0) return -1;
         return a.rawPrice - b.rawPrice;
      }
      if (sortOption === "price-desc") return b.rawPrice - a.rawPrice;
      if (sortOption === "newest") return (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1;
      return 0;
    });
  }, [searchQuery, selectedCategories, selectedBrands, sortOption, priceRange]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Handlers ---
  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    setCurrentPage(1);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 100000000 });
    setSearchQuery("");
    setCurrentPage(1);
  };

  // --- Sub-Component: Filter Content (Reused for Desktop & Mobile) ---
  const FilterContent = () => (
    <div className="space-y-6">
        {/* Active Filters Reset */}
        {(selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange.min > 0) && (
            <Button variant="outline" onClick={clearFilters} className="w-full justify-center text-rose-500 hover:text-rose-600 border-dashed border-rose-200 hover:bg-rose-50 h-10">
                <X size={16} className="mr-2" />
                حذف تمام فیلترها
            </Button>
        )}

        {/* Categories */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <List size={18} className="text-primary" />
                دسته‌بندی‌ها
            </h3>
            <ul className="space-y-3">
                {categories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                        <li key={cat.id}>
                            <label className="flex items-center justify-between cursor-pointer group select-none" onClick={() => toggleCategory(cat.id)}>
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                        isSelected ? "bg-primary border-primary" : "border-slate-300 group-hover:border-primary"
                                    )}>
                                        {isSelected && <Check size={12} className="text-white" />}
                                    </div>
                                    <span className={cn("text-sm transition-colors", isSelected ? "text-primary font-bold" : "text-slate-600 group-hover:text-primary")}>
                                        {cat.name}
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-mono">{cat.count}</span>
                            </label>
                        </li>
                    );
                })}
            </ul>
        </div>

        {/* Brands */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Filter size={18} className="text-primary" />
                برندها
            </h3>
            <div className="space-y-3">
                {brands.map((brand, idx) => {
                    const isSelected = selectedBrands.includes(brand);
                    return (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group select-none" onClick={() => toggleBrand(brand)}>
                            <div className={cn(
                                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                isSelected ? "bg-slate-800 border-slate-800" : "border-slate-300 group-hover:border-slate-800"
                            )}>
                                {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            <span className={cn("text-sm transition-colors", isSelected ? "text-slate-900 font-bold" : "text-slate-600 group-hover:text-slate-900")}>
                                {brand}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>

        {/* Price Range (Real Inputs) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-primary" />
                محدوده قیمت (تومان)
            </h3>
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Input 
                        type="number" 
                        placeholder="حداقل" 
                        value={priceRange.min || ''}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        className="h-9 text-xs text-center pr-1 pl-1"
                    />
                </div>
                <span className="text-slate-400">-</span>
                <div className="relative flex-1">
                    <Input 
                        type="number" 
                        placeholder="حداکثر" 
                        value={priceRange.max === 100000000 ? '' : priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 100000000 }))}
                        className="h-9 text-xs text-center pr-1 pl-1"
                    />
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* --- Page Header --- */}
      <div className="bg-white border-b border-slate-200 pt-32 pb-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                        فروشگاه محصولات
                    </h1>
                    <p className="text-slate-500 text-sm">
                        نمایش <span className="font-bold text-slate-900">{filteredProducts.length}</span> محصول
                    </p>
                </div>
                
                <div className="relative w-full md:w-96">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input 
                        placeholder="جستجو نام محصول..." 
                        className="pr-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* --- Desktop Sidebar --- */}
            <aside className="hidden lg:block lg:col-span-1 sticky top-32 h-fit overflow-y-auto pr-1">
                <FilterContent />
            </aside>

            {/* --- Main Content --- */}
            <div className="lg:col-span-3">
                
                {/* Active Filters Bar (Chips) */}
                {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {selectedCategories.map(catId => {
                            const cat = categories.find(c => c.id === catId);
                            return (
                                <Badge key={catId} variant="secondary" className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 gap-2 hover:bg-slate-50">
                                    {cat?.name}
                                    <X size={14} className="cursor-pointer text-slate-400 hover:text-rose-500" onClick={() => toggleCategory(catId)} />
                                </Badge>
                            )
                        })}
                        {selectedBrands.map(brand => (
                            <Badge key={brand} variant="secondary" className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 gap-2 hover:bg-slate-50">
                                {brand}
                                <X size={14} className="cursor-pointer text-slate-400 hover:text-rose-500" onClick={() => toggleBrand(brand)} />
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Toolbar & Mobile Filter Trigger */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm sticky top-20 z-30 lg:relative lg:top-0 lg:z-0">
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
                        
                        {/* Mobile Filter Button */}
                        <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="lg:hidden gap-2 border-slate-200">
                                    <Filter size={16} />
                                    فیلترها
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                                <SheetHeader className="mb-6 text-right">
                                    <SheetTitle>فیلتر محصولات</SheetTitle>
                                </SheetHeader>
                                <FilterContent />
                                <div className="mt-8 pt-4 border-t sticky bottom-0 bg-white">
                                    <Button className="w-full h-12 bg-primary hover:bg-primary/90" onClick={() => setIsMobileFilterOpen(false)}>
                                        مشاهده {filteredProducts.length} محصول
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 hidden sm:inline">مرتب‌سازی:</span>
                            <select 
                                className="bg-slate-50 text-sm font-medium text-slate-700 border-none rounded-lg p-2 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                                value={sortOption}
                                // @ts-ignore
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="newest">جدیدترین‌ها</option>
                                <option value="price-asc">ارزان‌ترین</option>
                                <option value="price-desc">گران‌ترین</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-2 border-r border-slate-100 pr-4 mr-auto sm:mr-0">
                        <Button 
                            variant="ghost" size="icon" 
                            className={viewMode === 'grid' ? "bg-slate-100 text-slate-900" : "text-slate-400"}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={18} />
                        </Button>
                        <Button 
                            variant="ghost" size="icon" 
                            className={viewMode === 'list' ? "bg-slate-100 text-slate-900" : "text-slate-400"}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} />
                        </Button>
                    </div>
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <Search size={48} className="text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">محصولی یافت نشد</h3>
                        <p className="text-slate-500 text-sm mb-6">لطفاً فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید.</p>
                        <Button onClick={clearFilters} variant="outline">پاک کردن فیلترها</Button>
                    </div>
                ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        {currentProducts.map((product) => (
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
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                        <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                            <Button 
                                variant="ghost" size="sm" 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className="rounded-full w-10 h-10 p-0 text-slate-400 hover:text-primary"
                            >
                                قبلی
                            </Button>
                            
                            {[...Array(totalPages)].map((_, i) => (
                                <Button 
                                    key={i}
                                    variant={currentPage === i + 1 ? "default" : "ghost"} 
                                    size="sm" 
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`rounded-full w-10 h-10 p-0 ${currentPage === i + 1 ? "bg-primary text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
                                >
                                    {i + 1}
                                </Button>
                            ))}

                            <Button 
                                variant="ghost" size="sm" 
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className="rounded-full w-10 h-10 p-0 text-slate-400 hover:text-primary"
                            >
                                بعدی
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
}