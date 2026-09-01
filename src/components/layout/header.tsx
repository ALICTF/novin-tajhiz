"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, ShoppingBag, Menu, Phone,
  Activity, Mail, Heart, LogIn, X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
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
import { CartSheet } from "@/components/shared/cart-sheet";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { categories } from "@/lib/data/products";
import { contactInfo, phones, siteConfig, socialLinks } from "@/lib/data/site";
import { toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

/** لینک‌های زیرمنوی محصولات — از دسته‌بندی‌های واقعی کاتالوگ ساخته می‌شود. */
const productMenu = categories.slice(0, 6).map((c) => ({
  title: c.name,
  href: `/products?category=${c.id}`,
  description: c.description,
}));

const navLinks = [
  { title: "صفحه اصلی", href: "/" },
  { title: "وبلاگ", href: "/blog" },
  { title: "درباره ما", href: "/about" },
  { title: "تماس با ما", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const router = useRouter();
  const pathname = usePathname();
  const { count: cartCount, setOpen: setCartOpen, hydrated: cartHydrated } = useCart();
  const { count: wishCount, hydrated: wishHydrated } = useWishlist();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // با تغییر مسیر، منوی موبایل بسته می‌شود.
  React.useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setQuery("");
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 z-50 mx-auto flex w-full max-w-[1440px] justify-center px-4 transition-all duration-500",
          isScrolled ? "top-2" : "top-4 md:top-6",
        )}
      >
        <header
          className={cn(
            "relative flex w-full items-center justify-between rounded-2xl border px-4 transition-all duration-500 md:px-6",
            "border-white/40 bg-white/80 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-white/60",
            isScrolled ? "h-16 bg-white/90 shadow-xl" : "h-20",
          )}
        >
          {/* ------------------------------ لوگو ------------------------------ */}
          <Link
            href="/"
            aria-label={`${siteConfig.name} — صفحه اصلی`}
            className="group flex shrink-0 items-center gap-3"
          >
            <Image
              src={siteConfig.logo}
              alt={siteConfig.nameEn}
              width={550}
              height={326}
              priority
              className={cn(
                "w-auto object-contain transition-all duration-500 group-hover:scale-105",
                isScrolled ? "h-9" : "h-11 md:h-12",
              )}
            />
            <span className="mt-0.5 hidden text-[10px] leading-tight font-medium tracking-wide text-slate-500 opacity-80 xl:block">
              مرجع تخصصی
              <br />
              پلی‌سومنوگرافی
            </span>
          </Link>

          {/* ------------------------- منوی دسکتاپ ------------------------- */}
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <NavigationMenu dir="rtl">
              <NavigationMenuList className="gap-1 rounded-full border border-slate-200/50 bg-slate-100/50 p-1">
                <NavigationMenuItem>
                  <Link
                    href="/"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-9 rounded-full bg-transparent text-slate-600 hover:bg-white hover:text-primary",
                      isActive("/") && "bg-white text-primary",
                    )}
                  >
                    صفحه اصلی
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "h-9 rounded-full bg-transparent text-slate-600 hover:bg-white hover:text-primary",
                      isActive("/products") && "bg-white text-primary",
                    )}
                  >
                    محصولات
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[500px] gap-3 rounded-2xl bg-white/95 p-4 ring-1 ring-slate-200 backdrop-blur-3xl md:w-[620px] md:grid-cols-2 lg:w-[720px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-xl border border-slate-200 p-6 no-underline outline-none select-none focus:shadow-md"
                            href="/products"
                          >
                            <Image
                              src="/images/cpap.png"
                              alt="تجهیزات تنفسی"
                              fill
                              sizes="340px"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                            <div className="relative z-10">
                              <div className="mb-2 flex items-center gap-2 text-lg font-bold text-white">
                                <Activity className="text-primary" size={24} />
                                فروشگاه تخصصی
                              </div>
                              <p className="text-sm leading-tight font-medium text-slate-200">
                                مرجع تخصصی خرید و اجاره دستگاه‌های کمک تنفسی با گارانتی رسمی.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>

                      {productMenu.map((item) => (
                        <ListItem key={item.href} title={item.title} href={item.href}>
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {navLinks.slice(1).map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "h-9 rounded-full bg-transparent text-slate-600 hover:bg-white hover:text-primary",
                        isActive(link.href) && "bg-white text-primary",
                      )}
                    >
                      {link.title}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* ------------------------- بخش سمت چپ ------------------------- */}
          <div className="flex shrink-0 items-center">
            <div className="hidden items-center gap-3 text-slate-500 xl:flex">
              <div className="flex flex-col items-end text-[10px] leading-tight font-medium opacity-80 transition-opacity hover:opacity-100">
                {phones.slice(0, 2).map((p) => (
                  <a
                    key={p.tel}
                    href={`tel:${p.tel}`}
                    className="dir-ltr tabular-nums tracking-wide hover:text-primary"
                  >
                    {p.number}
                  </a>
                ))}
              </div>
              <div className="flex gap-2">
                {socialLinks.slice(0, 2).map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="transition-colors hover:text-primary"
                  >
                    <s.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="mx-6 hidden h-8 bg-slate-300 xl:block"
            />

            <div className="flex items-center gap-2 md:gap-3">
              {/* جستجو */}
              <form
                onSubmit={submitSearch}
                className={cn(
                  "relative hidden items-center transition-all duration-300 lg:flex",
                  searchOpen ? "w-[220px]" : "w-9",
                )}
              >
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearchOpen(false)}
                  placeholder="جستجوی محصول یا مقاله..."
                  aria-label="جستجو در سایت"
                  className={cn(
                    "h-9 rounded-full border-slate-200 bg-slate-50 pr-9 pl-2 text-xs transition-all focus:bg-white",
                    !searchOpen && "pointer-events-none opacity-0",
                  )}
                />
                <button
                  type={searchOpen ? "submit" : "button"}
                  aria-label="جستجو"
                  onClick={() => !searchOpen && setSearchOpen(true)}
                  className="absolute right-0 z-10 flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                >
                  <Search size={18} />
                </button>
              </form>

              {/* علاقه‌مندی‌ها */}
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="relative hidden h-9 w-9 rounded-full text-slate-700 hover:bg-slate-100 sm:flex"
              >
                <Link href="/wishlist" aria-label="علاقه‌مندی‌ها">
                  <Heart size={20} />
                  {wishHydrated && wishCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white ring-2 ring-white">
                      {toPersianDigits(wishCount)}
                    </span>
                  )}
                </Link>
              </Button>

              {/* سبد خرید */}
              <Button
                variant="ghost"
                size="icon"
                aria-label={`سبد خرید (${cartCount} قلم)`}
                onClick={() => setCartOpen(true)}
                className="relative h-9 w-9 rounded-full text-slate-700 hover:bg-slate-100"
              >
                <ShoppingBag size={20} />
                {cartHydrated && cartCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white ring-2 ring-white">
                    {toPersianDigits(cartCount)}
                  </span>
                )}
              </Button>
            </div>

            {/* منوی موبایل */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="باز کردن منو"
                  className="mr-1 -ml-2 text-slate-800 lg:hidden"
                >
                  <Menu size={26} />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="flex w-[85%] flex-col border-l border-white/20 bg-white/95 p-0 backdrop-blur-xl sm:w-[400px] [&>button]:right-auto [&>button]:left-4"
              >
                <SheetHeader className="border-b border-slate-100 bg-slate-50/50 p-5 text-right">
                  <SheetTitle className="flex items-center gap-3">
                    <Image
                      src={siteConfig.logo}
                      alt={siteConfig.nameEn}
                      width={550}
                      height={326}
                      className="h-10 w-auto object-contain"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-bold text-slate-800">
                        {siteConfig.name}
                      </span>
                      <span className="text-xs font-normal text-slate-500">
                        منوی دسترسی سریع
                      </span>
                    </div>
                  </SheetTitle>
                  <SheetDescription className="sr-only">منوی ناوبری موبایل</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4">
                  <form onSubmit={submitSearch} className="relative mb-6">
                    <Search className="absolute top-3.5 right-3 h-4 w-4 text-slate-400" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="جستجوی محصول یا مقاله..."
                      aria-label="جستجو"
                      className="h-11 rounded-xl border-transparent bg-slate-100 pr-10 focus:bg-white"
                    />
                    {query && (
                      <button
                        type="button"
                        aria-label="پاک کردن"
                        onClick={() => setQuery("")}
                        className="absolute top-3.5 left-3 text-slate-400"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </form>

                  <Accordion type="single" collapsible className="w-full space-y-1">
                    <Link
                      href="/"
                      className="flex items-center rounded-xl px-3 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      صفحه اصلی
                    </Link>

                    <AccordionItem value="products" className="border-none">
                      <AccordionTrigger className="rounded-xl px-3 py-3 text-slate-700 hover:bg-slate-100 hover:no-underline">
                        محصولات
                      </AccordionTrigger>
                      <AccordionContent className="pt-1 pb-2 pl-2">
                        <div className="mr-3 flex flex-col gap-1 border-r-2 border-slate-200 pr-4">
                          <Link
                            href="/products"
                            className="rounded-lg px-3 py-2.5 text-sm font-bold text-primary hover:bg-primary/5"
                          >
                            همه محصولات
                          </Link>
                          {productMenu.map((p) => (
                            <Link
                              key={p.href}
                              href={p.href}
                              className="rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-all hover:bg-primary/5 hover:text-primary"
                            >
                              {p.title}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {navLinks.slice(1).map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center rounded-xl px-3 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        {link.title}
                      </Link>
                    ))}

                    <Separator className="my-2" />

                    <Link
                      href="/wishlist"
                      className="flex items-center justify-between rounded-xl px-3 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <span className="flex items-center gap-2">
                        <Heart size={16} className="text-rose-500" />
                        علاقه‌مندی‌ها
                      </span>
                      {wishHydrated && wishCount > 0 && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-600">
                          {toPersianDigits(wishCount)}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/cart"
                      className="flex items-center justify-between rounded-xl px-3 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <span className="flex items-center gap-2">
                        <ShoppingBag size={16} className="text-primary" />
                        سبد خرید
                      </span>
                      {cartHydrated && cartCount > 0 && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                          {toPersianDigits(cartCount)}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/faq"
                      className="flex items-center rounded-xl px-3 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      پرسش‌های متداول
                    </Link>
                  </Accordion>
                </div>

                <div className="space-y-4 border-t bg-slate-50 p-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    {phones.slice(0, 2).map((p) => (
                      <a
                        key={p.tel}
                        href={`tel:${p.tel}`}
                        className="flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:border-primary/50"
                      >
                        <Phone size={16} className="text-primary" />
                        <span className="dir-ltr text-[10px] font-bold tabular-nums tracking-wide">
                          {p.number}
                        </span>
                      </a>
                    ))}
                  </div>

                  <div className="flex items-center justify-between px-2">
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="flex items-center gap-2 text-xs text-slate-600 transition-colors hover:text-primary"
                    >
                      <Mail size={14} />
                      <span>ایمیل پشتیبانی</span>
                    </a>
                    <div className="flex gap-3">
                      {socialLinks.map((s) => (
                        <a
                          key={s.name}
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={s.name}
                          className="text-slate-400 transition-colors hover:text-primary"
                        >
                          <s.icon size={18} />
                        </a>
                      ))}
                    </div>
                  </div>

                  <Button
                    asChild
                    className="mt-2 h-11 w-full gap-2 rounded-xl bg-slate-900 text-base text-white shadow-lg shadow-primary/20 hover:bg-primary"
                  >
                    <Link href="/contact">
                      <LogIn size={18} />
                      درخواست مشاوره رایگان
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
      </div>

      <CartSheet />
    </>
  );
}

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        ref={ref}
        href={href ?? "#"}
        className={cn(
          "group block space-y-1 rounded-xl p-3 leading-none no-underline transition-all outline-none select-none hover:bg-slate-100 hover:shadow-sm focus:bg-slate-100",
          className,
        )}
        {...props}
      >
        <div className="text-sm leading-none font-bold text-slate-800 transition-colors group-hover:text-primary">
          {title}
        </div>
        {children && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {children}
          </p>
        )}
      </Link>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";
