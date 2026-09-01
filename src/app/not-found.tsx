import Link from "next/link";
import { Home, Package, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { primaryPhone } from "@/lib/data/site";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-32 pb-20">
      <div className="w-full max-w-2xl text-center">
        <div className="relative mb-8">
          <span className="text-[120px] leading-none font-black text-slate-200 select-none md:text-[180px]">
            ۴۰۴
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-xl">
              <Search size={36} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-black text-slate-900 md:text-4xl">
          این صفحه پیدا نشد
        </h1>
        <p className="mx-auto mb-10 max-w-md leading-relaxed text-slate-500">
          ممکن است نشانی را اشتباه وارد کرده باشید، یا صفحه‌ای که دنبالش بودید جابه‌جا
          شده باشد. از مسیرهای زیر ادامه دهید.
        </p>

        <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { href: "/", icon: Home, title: "صفحه اصلی", desc: "بازگشت به خانه" },
            { href: "/products", icon: Package, title: "فروشگاه", desc: "مرور محصولات" },
            { href: "/search", icon: Search, title: "جستجو", desc: "پیدا کردن مطلب" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-primary group-hover:text-white">
                <item.icon size={20} />
              </div>
              <div className="text-sm font-bold text-slate-800">{item.title}</div>
              <div className="mt-1 text-[11px] text-slate-400">{item.desc}</div>
            </Link>
          ))}
        </div>

        <Button asChild variant="outline" className="h-12 gap-2 rounded-xl px-6">
          <a href={`tel:${primaryPhone.tel}`}>
            <Phone size={18} />
            تماس با پشتیبانی:{" "}
            <span className="dir-ltr tabular-nums tracking-wide">{primaryPhone.number}</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
