"use client";

import { useState } from "react";
import Image from "next/image";
import { Wrench, Settings, Activity, ClipboardCheck, Truck, ShieldCheck, CheckCircle2, UploadCloud, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ServicesPage() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* --- 1. Hero Section --- */}
      <section className="relative bg-[#0F172A] text-white py-20 overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20 px-4 py-1.5">
                        <Settings className="w-3.5 h-3.5 mr-2 animate-spin-slow" />
                        مرکز تخصصی تعمیرات و کالیبراسیون
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black leading-tight">
                        دستگاه شما نیاز به <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">سرویس تخصصی</span> دارد؟
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                        تیم مهندسی نوین تجهیز با استفاده از قطعات اورجینال و دستگاه‌های کالیبراسیون دقیق، سلامت دستگاه تنفسی شما را تضمین می‌کند.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <ShieldCheck size={16} className="text-emerald-400" />
                            <span>۳ ماه گارانتی تعمیر</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <Truck size={16} className="text-blue-400" />
                            <span>دریافت و ارسال درب منزل</span>
                        </div>
                    </div>
                </div>
                
                {/* Hero Illustration (Abstract Device) */}
                <div className="flex-1 relative w-full max-w-md aspect-square">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 rounded-full blur-[100px]" />
                    <div className="relative bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <div className="text-xs font-mono text-slate-400">SYSTEM CHECK...</div>
                        </div>
                        <div className="space-y-4 font-mono text-sm text-emerald-400">
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span>Motor Status:</span>
                                <span>OK</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span>Pressure Sensor:</span>
                                <span>Calibrated</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span>Humidifier:</span>
                                <span>Clean</span>
                            </div>
                             <div className="flex justify-between pt-2 text-white font-bold">
                                <span>Total Health:</span>
                                <span>98%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 2. Services Grid --- */}
      <section className="py-16 container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { title: "تعمیرات برد و موتور", icon: Wrench, desc: "رفع اشکالات الکترونیکی و تعویض توربین با قطعات اصلی" },
                { title: "کالیبراسیون فشار", icon: Activity, desc: "تنظیم دقیق سنسورها با دستگاه‌های رفرنس آزمایشگاهی" },
                { title: "سرویس و جنرال", icon: ClipboardCheck, desc: "شستشوی اولتراسونیک مدار داخلی و تعویض فیلترها" },
                { title: "تست ریپورت", icon: Settings, desc: "استخراج داده‌های خواب و ارائه گزارش کامل به پزشک" },
            ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors mb-4">
                        <item.icon size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* --- 3. Request Form Section --- */}
      <section className="container mx-auto px-4 md:px-6 max-w-7xl mb-16">
        <div className="bg-white rounded-[40px] shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left: The Form */}
            <div className="lg:col-span-7 p-8 md:p-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">ثبت درخواست تعمیرات</h2>
                    <p className="text-slate-500 text-sm">
                        لطفاً فرم زیر را پر کنید. کارشناسان فنی ما در کمتر از ۳۰ دقیقه با شما تماس می‌گیرند.
                    </p>
                </div>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">نام و نام خانوادگی</label>
                            <Input placeholder="مثلا: رضا علوی" className="bg-slate-50 border-slate-200 rounded-xl h-12" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">شماره تماس</label>
                            <Input placeholder="091..." className="bg-slate-50 border-slate-200 rounded-xl h-12 dir-ltr text-right" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">نوع دستگاه</label>
                            <select className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option>انتخاب کنید...</option>
                                <option>CPAP / Auto CPAP</option>
                                <option>BiPAP / VPAP</option>
                                <option>اکسیژن ساز (Oxygen)</option>
                                <option>ونتیلاتور خانگی</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">برند (اختیاری)</label>
                            <Input placeholder="مثلا: ResMed" className="bg-slate-50 border-slate-200 rounded-xl h-12" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">شرح مشکل دستگاه</label>
                        <Textarea 
                            placeholder="توضیح دهید دستگاه چه خطایی می‌دهد یا چه مشکلی دارد..." 
                            className="bg-slate-50 border-slate-200 rounded-xl min-h-[120px] resize-none" 
                        />
                    </div>

                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-primary/50 transition-colors cursor-pointer group">
                        <UploadCloud className="w-8 h-8 mb-2 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium">آپلود عکس یا ویدیو از خطا (اختیاری)</span>
                    </div>

                    <Button className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
                        ثبت درخواست و دریافت مشاوره
                    </Button>
                </form>
            </div>

            {/* Right: Process Steps (Timeline) */}
            <div className="lg:col-span-5 bg-slate-50 p-8 md:p-12 border-r border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-8">روند کار چگونه است؟</h3>
                
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
                        <div key={item.step} className="relative flex items-start gap-4">
                            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm border-4 transition-all duration-500 ${
                                activeStep >= item.step 
                                ? "bg-primary text-white border-primary/30" 
                                : "bg-white text-slate-400 border-slate-200"
                            }`}>
                                {item.step}
                            </div>
                            <div className="pt-1">
                                <h4 className={`font-bold ${activeStep >= item.step ? "text-slate-900" : "text-slate-400"}`}>
                                    {item.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-800 leading-relaxed">
                        <span className="font-bold block mb-1">نکته مهم:</span>
                        در صورت نیاز به دستگاه جایگزین در طول مدت تعمیر، لطفاً در بخش توضیحات ذکر کنید.
                    </div>
                </div>
            </div>

        </div>
      </section>

    </div>
  );
}