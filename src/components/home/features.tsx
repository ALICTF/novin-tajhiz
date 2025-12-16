"use client";

import { ShieldCheck, Truck, Headset, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ShieldCheck,
    title: "ضمانت اصالت کالا",
    desc: "تمامی قطعات و سنسورها اورجینال و با گارانتی معتبر شرکتی ارائه می‌شوند.",
  },
  {
    icon: Headset,
    title: "مشاوره تخصصی رایگان",
    desc: "مشاوره مستقیم با مهندسین پزشکی جهت خرید بهترین دستگاه متناسب با نیاز بیمار.",
  },
  {
    icon: Wrench,
    title: "تعمیرات سریع و تخصصی",
    desc: "عیب‌یابی و تعمیر تخصصی بردهای دستگاه‌های CPAP و BiPAP در کمتر از ۴۸ ساعت.",
  },
  {
    icon: Truck,
    title: "ارسال به سراسر کشور",
    desc: "بسته‌بندی ایمن پزشکی و ارسال سریع تجهیزات به تمام نقاط ایران با بیمه مرسوله.",
  },
];

export function Features() {
  return (
    <section className="relative py-16 md:py-24 bg-slate-50 border-t border-white shadow-inner w-full flex flex-col items-center">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 justify-center items-stretch">
          {features.map((item, i) => (
            <div 
                key={i} 
                className="group relative flex flex-col items-center text-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              <div className="mb-6 relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500 shadow-inner">
                <item.icon className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
                
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              </div>

              <h3 className="font-bold text-lg text-slate-800 mb-3 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              
              <p className="text-sm text-slate-500 leading-7 max-w-[260px] mx-auto opacity-90">
                {item.desc}
              </p>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-t-full group-hover:w-12 transition-all duration-300" />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}