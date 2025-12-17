"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Wrench, Settings, Activity, ClipboardCheck, Truck, ShieldCheck, 
  CheckCircle2, UploadCloud, AlertCircle, Cpu, Microscope, FileJson, 
  ChevronDown, HelpCircle, PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ServicesPage() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    // تغییر: pt-32 برای فاصله گرفتن از هدر و جلوگیری از تداخل
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      
      {/* --- 1. Hero Section --- */}
      <section className="relative overflow-hidden mb-20">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                
                {/* Text Content */}
                <div className="flex-1 space-y-8 text-center lg:text-right">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                        <Settings className="w-3.5 h-3.5 mr-2 animate-spin-slow" />
                        مرکز تخصصی تعمیرات و کالیبراسیون
                    </Badge>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.2]">
                        احیای دقیق <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">تجهیزات حیاتی</span> شما
                    </h1>
                    
                    <p className="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                        تیم مهندسی نوین تجهیز با بهره‌گیری از دستگاه‌های آنالایزر دقیق و قطعات اورجینال، عملکرد دستگاه تنفسی شما را به استانداردهای کارخانه باز می‌گرداند.
                    </p>
                    
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
                            <ShieldCheck size={18} className="text-emerald-500" />
                            <span>۳ ماه گارانتی تعمیر</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
                            <Truck size={18} className="text-blue-500" />
                            <span>دریافت و ارسال درب منزل</span>
                        </div>
                    </div>
                </div>
                
                {/* Hero Graphic (System Monitor) */}
                <div className="flex-1 w-full max-w-md lg:max-w-lg">
                    <div className="relative bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl border-4 border-slate-100 ring-1 ring-slate-200/50">
                        {/* Status Bar */}
                        <div className="flex items-center justify-between mb-8 px-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="text-xs font-mono text-slate-400">DIAGNOSTIC MODE</div>
                        </div>

                        {/* Data Visualization */}
                        <div className="space-y-4 font-mono text-sm">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center text-emerald-400">
                                <span className="text-slate-400">Motor Turbine:</span>
                                <span className="flex items-center gap-2">
                                    <Activity size={14} className="animate-pulse" />
                                    Running
                                </span>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center text-blue-400">
                                <span className="text-slate-400">Pressure:</span>
                                <span>12.5 cmH2O</span>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center text-yellow-400">
                                <span className="text-slate-400">Filter Status:</span>
                                <span>Check Required</span>
                            </div>
                            
                            <div className="pt-4 border-t border-slate-700 flex justify-between text-white font-bold text-lg">
                                <span>System Health:</span>
                                <span>98%</span>
                            </div>
                        </div>

                        {/* Floating Tool Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-xl text-primary">
                                <Microscope size={24} />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 font-bold">دقت کالیبراسیون</div>
                                <div className="text-sm font-black text-slate-900">0.1 cmH2O</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 2. Services Grid --- */}
      <section className="py-12 container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { title: "تعمیرات برد و موتور", icon: Wrench, desc: "رفع اشکالات الکترونیکی و تعویض توربین با قطعات اصلی" },
                { title: "کالیبراسیون فشار", icon: Activity, desc: "تنظیم دقیق سنسورها با دستگاه‌های رفرنس آزمایشگاهی" },
                { title: "سرویس جنرال", icon: ClipboardCheck, desc: "شستشوی اولتراسونیک مدار داخلی و تعویض فیلترها" },
                { title: "تست ریپورت", icon: FileJson, desc: "استخراج داده‌های خواب و ارائه گزارش کامل به پزشک" },
            ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group cursor-default">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors mb-5">
                        <item.icon size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* --- 3. Request Form & Process --- */}
      <section className="container mx-auto px-4 md:px-6 max-w-7xl mb-24">
        <div className="bg-white rounded-[40px] shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left: The Form */}
            <div className="lg:col-span-7 p-8 md:p-12 order-2 lg:order-1">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
                        <Cpu className="text-primary" />
                        ثبت درخواست تعمیرات
                    </h2>
                    <p className="text-slate-500 text-sm">
                        مشخصات دستگاه و مشکل آن را وارد کنید. کارشناسان ما جهت هماهنگی با شما تماس می‌گیرند.
                    </p>
                </div>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">نام و نام خانوادگی</label>
                            <Input placeholder="مثلا: رضا علوی" className="bg-slate-50 border-slate-200 rounded-xl h-12 focus:bg-white transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">شماره تماس</label>
                            <Input placeholder="091..." className="bg-slate-50 border-slate-200 rounded-xl h-12 dir-ltr text-right focus:bg-white transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">نوع دستگاه</label>
                            <select className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                                <option>انتخاب کنید...</option>
                                <option>CPAP / Auto CPAP</option>
                                <option>BiPAP / VPAP</option>
                                <option>اکسیژن ساز (Oxygen)</option>
                                <option>ونتیلاتور خانگی</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">برند (اختیاری)</label>
                            <Input placeholder="مثلا: ResMed" className="bg-slate-50 border-slate-200 rounded-xl h-12 focus:bg-white transition-all" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">شرح مشکل دستگاه</label>
                        <Textarea 
                            placeholder="توضیح دهید دستگاه چه خطایی می‌دهد یا چه صدایی دارد..." 
                            className="bg-slate-50 border-slate-200 rounded-xl min-h-[120px] resize-none focus:bg-white transition-all" 
                        />
                    </div>

                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-primary/50 transition-colors cursor-pointer group">
                        <UploadCloud className="w-10 h-10 mb-3 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium">آپلود عکس یا ویدیو از خطا (اختیاری)</span>
                        <span className="text-xs text-slate-300 mt-1">حداکثر ۱۰ مگابایت</span>
                    </div>

                    <Button className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-primary rounded-xl shadow-lg shadow-slate-900/20 transition-all">
                        ثبت درخواست و دریافت مشاوره
                    </Button>
                </form>
            </div>

            {/* Right: Process Steps (Timeline) */}
            <div className="lg:col-span-5 bg-slate-50/80 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-200 order-1 lg:order-2">
                <h3 className="text-xl font-bold text-slate-900 mb-8">روند تعمیرات</h3>
                
                <div className="space-y-8 relative">
                    {/* Vertical Line */}
                    <div className="absolute top-2 bottom-2 right-[19px] w-0.5 bg-slate-200" />

                    {[
                        { step: 1, title: "ثبت درخواست", desc: "پر کردن فرم یا تماس تلفنی" },
                        { step: 2, title: "ارسال دستگاه", desc: "تحویل حضوری یا پیک رایگان" },
                        { step: 3, title: "عیب‌یابی رایگان", desc: "اعلام هزینه تعمیر در ۲۴ ساعت" },
                        { step: 4, title: "تعمیر و تست QC", desc: "تست نهایی با دستگاه آنالایزر" },
                        { step: 5, title: "تحویل و گارانتی", desc: "ارسال فاکتور رسمی و ضمانت" },
                    ].map((item) => (
                        <div key={item.step} className="relative flex items-start gap-4 group">
                            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm border-4 transition-all duration-500 ${
                                activeStep >= item.step 
                                ? "bg-primary text-white border-primary/30 shadow-lg shadow-primary/20" 
                                : "bg-white text-slate-400 border-slate-200 group-hover:border-primary/50"
                            }`}>
                                {item.step}
                            </div>
                            <div className="pt-1">
                                <h4 className={`font-bold text-base ${activeStep >= item.step ? "text-slate-900" : "text-slate-500"}`}>
                                    {item.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-1 leading-snug">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-800 leading-relaxed">
                        <span className="font-bold block mb-1">نیاز به دستگاه جایگزین دارید؟</span>
                        در صورت طولانی شدن زمان تعمیر، امکان دریافت دستگاه امانی (اجاره‌ای) وجود دارد. لطفاً در توضیحات ذکر کنید.
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* --- 4. FAQ Section (Why Us + Questions) --- */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">سوالات متداول تعمیرات</h2>
            <p className="text-slate-500">پاسخ به پرسش‌های رایج شما درباره روند سرویس و گارانتی</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
            {[
                { q: "هزینه عیب‌یابی چقدر است؟", a: "عیب‌یابی اولیه در نوین تجهیز کاملاً رایگان است. پس از بررسی، هزینه تعمیر به شما اعلام می‌شود و در صورت تایید شما، کار انجام خواهد شد." },
                { q: "مدت زمان تعمیر چقدر طول می‌کشد؟", a: "معمولاً بین ۲۴ تا ۴۸ ساعت کاری. در موارد خاص که نیاز به قطعه خاصی باشد، زمان دقیق به شما اعلام می‌گردد." },
                { q: "آیا تعمیرات گارانتی دارد؟", a: "بله، تمام خدمات تعمیراتی ما شامل ۳ ماه گارانتی بی‌قید و شرط روی همان قطعه یا بخش تعمیر شده می‌باشد." },
                { q: "آیا دستگاه جایگزین می‌دهید؟", a: "بله، برای بیمارانی که وابستگی شدید به دستگاه دارند، دستگاه جایگزین با هزینه جزئی (یا رایگان در شرایط خاص) در اختیارشان قرار می‌گیرد." },
            ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-white border border-slate-200 rounded-2xl px-2">
                    <AccordionTrigger className="px-4 text-slate-800 font-bold hover:no-underline hover:text-primary text-right">
                        <div className="flex items-center gap-3">
                            <HelpCircle size={18} className="text-slate-400" />
                            {faq.q}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-slate-600 leading-relaxed pr-11">
                        {faq.a}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 bg-slate-900 rounded-3xl p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative z-10 flex flex-col items-center">
                <h3 className="text-xl font-bold mb-4">هنوز سوالی دارید؟</h3>
                <div className="flex items-center gap-2 text-2xl font-black dir-ltr font-mono mb-4">
                    <PhoneCall size={24} className="text-primary" />
                    0915-425-6458
                </div>
                <p className="text-slate-400 text-sm">مشاوره مستقیم با مهندس فنی (۹ صبح تا ۹ شب)</p>
            </div>
        </div>
      </section>

    </div>
  );
}