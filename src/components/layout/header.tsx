"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, ShoppingBag, Menu, Phone, Stethoscope,
  Activity, BedDouble, Wrench, Mail, Instagram, Send,
  User, LogIn, PhoneCall
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// --- داده‌های منو ---
const products = [
  { title: "سنسورهای پلی‌سومنوگرافی", href: "/products/sensors", description: "سنسورهای حرارتی، تنفسی و تلاش تنفسی دقیق." },
  { title: "الکترودهای نوار مغز (EEG)", href: "/products/electrodes", description: "گاپ الکترود گلد، اسنپ و چسب‌های رسانا." },
  { title: "دستگاه‌های کمک تنفسی", href: "/products/cpap-bipap", description: "جدیدترین دستگاه‌های CPAP و BiPAP." },
  { title: "لوازم جانبی خواب", href: "/products/accessories", description: "ماسک‌ها، لوله‌ها و فیلترهای آنتی‌باکتریال." },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  // --- منطق سبد خرید (Mock) ---
  // در آینده این عدد را از Context یا Redux بخوانید
  const cartCount = 2; 

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* --- Floating Header Container --- */}
      <div className={cn(
        "fixed inset-x-0 mx-auto z-50 flex justify-center px-4 transition-all duration-500 w-full max-w-[1440px]",
        isScrolled ? "top-2" : "top-4 md:top-6"
      )}>
        <header
          className={cn(
            "w-full rounded-2xl transition-all duration-500 border flex items-center justify-between px-4 md:px-6 relative",
            // استایل شیشه‌ای (Glassmorphism)
            "bg-white/80 backdrop-blur-xl shadow-lg border-white/40 supports-[backdrop-filter]:bg-white/60",
            isScrolled ? "h-16 shadow-xl bg-white/90" : "h-20"
          )}
        >

          {/* بخش راست: لوگو */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
              <Stethoscope size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-800 leading-none group-hover:text-primary transition-colors">
                Novin Tajhiz
              </span>
              <span className="hidden md:block text-[10px] font-medium text-slate-500 mt-0.5 tracking-wide opacity-80">
                مرکز تخصصی مهندسی پزشکی
              </span>
            </div>
          </Link>

          {/* بخش وسط: منو (دسکتاپ) */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <NavigationMenu dir="rtl">
              <NavigationMenuList className="gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">

                <NavigationMenuItem>
                  <Link href="/" className={cn(navigationMenuTriggerStyle(), "bg-transparent h-9 rounded-full text-slate-600 hover:text-primary hover:bg-white")}>
                    صفحه اصلی
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent h-9 rounded-full text-slate-600 hover:text-primary hover:bg-white">
                    محصولات
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[500px] gap-3 p-4 md:w-[600px] md:grid-cols-2 lg:w-[700px] bg-white/95 backdrop-blur-3xl rounded-2xl ring-1 ring-slate-200">

                      {/* --- کارت بزرگ سمت راست --- */}
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-xl p-6 no-underline outline-none focus:shadow-md relative overflow-hidden group border border-slate-200"
                            href="/products"
                          >
                            <Image
                              src="/images/cpap.png"
                              alt="تجهیزات تنفسی"
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                            <div className="relative z-10">
                              <div className="mb-2 text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="text-primary" size={24} />
                                فروشگاه تخصصی
                              </div>
                              <p className="text-sm leading-tight text-slate-200 font-medium">
                                مرجع تخصصی خرید و اجاره دستگاه‌های کمک تنفسی با گارانتی رسمی.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>

                      {products.map((product) => (
                        <ListItem key={product.title} title={product.title} href={product.href}>
                          {product.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/services" className={cn(navigationMenuTriggerStyle(), "bg-transparent h-9 rounded-full text-slate-600 hover:text-primary hover:bg-white")}>
                    خدمات فنی
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/blog" className={cn(navigationMenuTriggerStyle(), "bg-transparent h-9 rounded-full text-slate-600 hover:text-primary hover:bg-white")}>
                    وبلاگ
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/about" className={cn(navigationMenuTriggerStyle(), "bg-transparent h-9 rounded-full text-slate-600 hover:text-primary hover:bg-white")}>
                    درباره ما
                  </Link>
                </NavigationMenuItem>

                {/* --- دکمه تماس با ما اضافه شد --- */}
                <NavigationMenuItem>
                  <Link href="/contact" className={cn(navigationMenuTriggerStyle(), "bg-transparent h-9 rounded-full text-slate-600 hover:text-primary hover:bg-white")}>
                    تماس با ما
                  </Link>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* بخش چپ: اطلاعات تماس + دکمه‌ها */}
          <div className="flex items-center shrink-0">

            {/* اطلاعات تماس (فقط دسکتاپ بزرگ) */}
            <div className="hidden xl:flex items-center gap-3 text-slate-500">
              <div className="flex flex-col items-end text-[10px] leading-tight font-medium opacity-80 hover:opacity-100 transition-opacity">
                <a href="tel:09154256458" className="hover:text-primary dir-ltr">0915-425-6458</a>
                <a href="tel:09300028932" className="hover:text-primary dir-ltr">0930-002-8932</a>
              </div>
              <div className="flex gap-2">
                <a href="#" className="hover:text-pink-500 transition-colors"><Instagram size={16} /></a>
                <a href="#" className="hover:text-blue-400 transition-colors"><Send size={16} /></a>
              </div>
            </div>

            {/* خط جداکننده */}
            <Separator orientation="vertical" className="h-8 hidden xl:block bg-slate-300 mx-6" />

            {/* دکمه‌های عملکردی */}
            <div className="flex items-center gap-5 md:gap-6">

              {/* Search Box */}
              <div className={cn(
                "hidden lg:flex items-center relative transition-all duration-300",
                isScrolled ? "w-9" : "w-9 hover:w-[180px] focus-within:w-[180px]"
              )}>
                <div className="absolute right-0 w-full">
                  <Input
                    type="search"
                    placeholder="جستجو..."
                    className={cn(
                      "w-full bg-slate-50 border-slate-200 rounded-full pr-9 pl-2 h-9 text-xs focus:bg-white transition-all opacity-0 pointer-events-none",
                      !isScrolled && "opacity-100 pointer-events-auto group-hover:opacity-100"
                    )}
                  />
                </div>
                <Button variant="ghost" size="icon" className="absolute right-0 w-9 h-9 hover:bg-slate-100 rounded-full z-10">
                  <Search size={18} className="text-slate-600" />
                </Button>
              </div>

              {/* دکمه‌های آیکونی */}
              <div className="flex items-center gap-3">
                
                {/* --- Shopping Cart with Logic --- */}
                <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-full text-slate-700 w-9 h-9">
                  <ShoppingBag size={20} />
                  {/* نمایش بج فقط اگر تعداد بیشتر از 0 باشد */}
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white ring-2 ring-white animate-in zoom-in duration-300">
                        {cartCount}
                    </span>
                  )}
                </Button>

                <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-slate-100 rounded-full text-slate-700 w-9 h-9" title="ورود">
                  <User size={20} />
                </Button>
              </div>
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-slate-800 -ml-2 mr-2">
                  <Menu size={26} />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[85%] sm:w-[400px] p-0 border-l border-white/20 bg-white/95 backdrop-blur-xl flex flex-col [&>button]:right-auto [&>button]:left-4"
              >

                <SheetHeader className="p-5 border-b border-slate-100 bg-slate-50/50 text-right">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                      <Stethoscope size={24} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-lg text-slate-800">نوین تجهیز</span>
                      <span className="text-xs text-slate-500 font-normal">منوی دسترسی سریع</span>
                    </div>
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    منوی ناوبری موبایل
                  </SheetDescription>
                </SheetHeader>

                {/* محتوای منوی موبایل */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="relative mb-6">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                    <Input placeholder="جستجوی محصول..." className="pr-10 bg-slate-100 border-transparent h-11 rounded-xl focus:bg-white" />
                  </div>

                  <Accordion type="single" collapsible className="w-full space-y-1">
                    <Link href="/" className="flex items-center py-3 px-3 font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                      صفحه اصلی
                    </Link>

                    <AccordionItem value="products" className="border-none">
                      <AccordionTrigger className="px-3 hover:bg-slate-100 rounded-xl py-3 hover:no-underline text-slate-700">محصولات</AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1 pl-2">
                        <div className="flex flex-col gap-1 pr-4 border-r-2 border-slate-200 mr-3">
                          {products.map((p) => (
                            <Link key={p.href} href={p.href} className="py-2.5 px-3 text-sm text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                              {p.title}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <Link href="/services" className="flex items-center py-3 px-3 font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                      خدمات فنی
                    </Link>

                    <Link href="/blog" className="flex items-center py-3 px-3 font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                      وبلاگ آموزشی
                    </Link>

                    <Link href="/about" className="flex items-center py-3 px-3 font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                      درباره ما
                    </Link>

                    {/* لینک تماس با ما در موبایل */}
                    <Link href="/contact" className="flex items-center py-3 px-3 font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                      تماس با ما
                    </Link>

                  </Accordion>
                </div>

                <div className="p-4 border-t bg-slate-50 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <a href="tel:09154256458" className="bg-white border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors">
                      <Phone size={16} className="text-primary" />
                      <span className="text-[10px] font-bold dir-ltr">0915-425-6458</span>
                    </a>
                    <a href="tel:09300028932" className="bg-white border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors">
                      <Phone size={16} className="text-primary" />
                      <span className="text-[10px] font-bold dir-ltr">0930-002-8932</span>
                    </a>
                  </div>

                  <div className="flex justify-between items-center px-2">
                    <a href="#" className="flex items-center gap-2 text-xs text-slate-600 hover:text-primary transition-colors">
                      <Mail size={14} />
                      <span>ایمیل پشتیبانی</span>
                    </a>
                    <div className="flex gap-3">
                      <a href="#" className="text-slate-400 hover:text-pink-600 transition-colors"><Instagram size={18} /></a>
                      <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors"><Send size={18} /></a>
                    </div>
                  </div>

                  <Button className="w-full gap-2 h-11 text-base rounded-xl shadow-lg shadow-primary/20 bg-slate-900 hover:bg-primary text-white mt-2">
                    <LogIn size={18} />
                    ورود به حساب کاربری
                  </Button>
                </div>

              </SheetContent>
            </Sheet>
          </div>
        </header>
      </div>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref as any}
          href={href || "#"}
          className={cn(
            "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 group hover:shadow-sm",
            className
          )}
          {...props}
        >
          <div className="text-sm font-bold leading-none text-slate-800 group-hover:text-primary transition-colors">
            {title}
          </div>
          {children && (
            <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 mt-1.5">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem";