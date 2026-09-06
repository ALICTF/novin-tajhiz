import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowLeft, Building2, Clock, Headphones, Mail,
  MapPin, MessageSquare, Navigation, Map, Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { breadcrumbJsonLd, JsonLd, pageJsonLd } from "@/lib/seo/json-ld";
import { contactInfo, phones, socialLinks } from "@/lib/data/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "تماس با ما",
  description:
    "شماره تماس، نشانی دفتر مرکزی در مشهد، ساعات کاری و فرم ارتباط مستقیم با کارشناسان نوین تجهیز.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const [support, sales, landline] = phones;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <JsonLd
          data={pageJsonLd({
            type: "ContactPage",
            name: "تماس با نوین تجهیز",
            description:
              "شماره تماس، نشانی دفتر مرکزی در مشهد، ساعات کاری و فرم ارتباط مستقیم با کارشناسان نوین تجهیز.",
            path: "/contact",
          })}
        />
        <JsonLd data={breadcrumbJsonLd([{ label: "تماس با ما" }], "/contact")} />

        <Breadcrumbs items={[{ label: "تماس با ما" }]} className="mb-6" />
      </div>

      {/* ------------------------------ سربرگ ------------------------------ */}
      <section className="relative container mx-auto px-4 pb-16 text-center">
        <div className="flex flex-col items-center space-y-4">
          <Badge
            variant="outline"
            className="border-primary/20 bg-white px-4 py-1.5 text-primary shadow-sm backdrop-blur-sm"
          >
            همیشه پاسخگو هستیم
          </Badge>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            ارتباط با{" "}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              نوین تجهیز
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-500">
            چه برای مشاوره خرید و چه برای خدمات پس از فروش، تیم متخصص ما آماده شنیدن
            صدای گرم شماست.
          </p>
        </div>
      </section>

      <div className="relative z-20 container mx-auto max-w-7xl px-4 md:px-6">
        {/* ----------------------------- کارت‌ها ----------------------------- */}
        <div className="mb-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* فروش */}
          <div className="group h-full rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <Building2 size={28} />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">واحد فروش و مشاوره</h2>
            <p className="mb-8 text-sm text-slate-500">
              برای استعلام قیمت و مشاوره خرید دستگاه
            </p>

            <div className="space-y-4">
              {[landline, sales].map((p) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  className="group/item flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-blue-200"
                >
                  <div className="flex items-center gap-3">
                    <Phone
                      size={18}
                      className="text-slate-400 group-hover/item:text-blue-600"
                    />
                    <span className="text-sm font-bold text-slate-700">{p.label}</span>
                  </div>
                  <span className="dir-ltr font-bold tabular-nums tracking-wide text-slate-900">
                    {p.number}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* پشتیبانی */}
          <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[2rem] border border-slate-800 bg-[#0f172a] p-8 text-white shadow-2xl shadow-slate-900/20 transition-transform duration-500 hover:-translate-y-2 lg:-mt-6 lg:mb-6">
            <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full glow [--glow-color:rgba(37,99,235,.26)]" />

            <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full border border-white/5 bg-white/10 px-3 py-1 backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] font-medium text-emerald-400">آنلاین</span>
            </div>

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-white/10 text-primary backdrop-blur-sm">
              <Headphones size={32} />
            </div>

            <h2 className="mb-2 text-2xl font-bold text-white">پشتیبانی فنی</h2>
            <p className="mb-8 text-sm text-slate-400">
              ویژه بیماران اورژانسی و تعمیرات فوری (۲۴ ساعته)
            </p>

            <div className="mb-auto space-y-4">
              <a
                href={`tel:${support.tel}`}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/20 p-2 text-primary">
                    <Phone size={18} />
                  </div>
                  <span className="text-sm font-medium">شماره مستقیم</span>
                </div>
                <span className="dir-ltr text-lg font-bold tabular-nums tracking-wider">
                  {support.number}
                </span>
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/10 pt-6 text-xs text-slate-400">
              <Clock size={14} className="text-primary" />
              <span>{support.hint}</span>
            </div>
          </div>

          {/* شبکه‌های اجتماعی */}
          <div className="group h-full rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-600 group-hover:text-white">
              <MessageSquare size={28} />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">فضای مجازی</h2>
            <p className="mb-8 text-sm text-slate-500">ما را در شبکه‌های اجتماعی دنبال کنید</p>

            <div className="flex flex-col gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link flex items-center gap-4 rounded-2xl border border-transparent p-3 transition-colors hover:border-slate-100 hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm">
                    <s.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800">{s.name}</div>
                    <div className="dir-ltr text-right text-[10px] text-slate-400">
                      {s.handle}
                    </div>
                  </div>
                  <ArrowLeft
                    size={16}
                    className="text-slate-300 transition-colors group-hover/link:text-primary"
                  />
                </a>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
              >
                <Mail size={16} />
                <span className="dir-ltr">{contactInfo.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* --------------------------- فرم و نقشه --------------------------- */}
        <div className="grid grid-cols-1 gap-8 rounded-[3rem] border border-slate-100 bg-white p-2 shadow-xl lg:grid-cols-2">
          <div className="p-6 md:p-10">
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-black text-slate-900">ارسال پیام متنی</h2>
              <p className="text-sm text-slate-500">
                انتقادات، پیشنهادات و پیام‌های شما مستقیماً توسط مدیریت بررسی می‌شود.
              </p>
            </div>

            <ContactForm />
          </div>

          {/* نقشه */}
          <div className="group relative min-h-[500px] overflow-hidden rounded-[2.5rem] bg-slate-100">
            {/* تصویر محلی دفتر — هیچ منبع بیرونی بارگذاری نمی‌شود.
                مسیریابی از طریق دکمه‌های نشان و بلد در کارت زیر انجام می‌گیرد. */}
            <Image
              src="/images/site/IMG_0323-rotated-1.jpeg"
              alt="دفتر مرکزی نوین تجهیز در مشهد"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

            <div className="absolute right-6 bottom-6 left-6 rounded-3xl border border-white/50 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-2xl border border-rose-100 bg-rose-50 p-3.5 text-rose-600">
                  <MapPin size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-bold text-slate-900">دفتر مرکزی</h3>
                  <p className="text-sm leading-relaxed font-medium text-slate-600">
                    {contactInfo.address}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">{contactInfo.workingHours}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-10 gap-2 rounded-xl border-slate-200 bg-slate-50 text-slate-700 transition-all hover:border-blue-400 hover:bg-white hover:text-blue-600"
                    >
                      <a href={contactInfo.mapLinks.neshan} target="_blank" rel="noreferrer">
                        <Navigation size={16} />
                        مسیریابی با نشان
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-10 gap-2 rounded-xl border-slate-200 bg-slate-50 text-slate-700 transition-all hover:border-blue-400 hover:bg-white hover:text-blue-600"
                    >
                      <a href={contactInfo.mapLinks.balad} target="_blank" rel="noreferrer">
                        <Map size={16} />
                        مسیریابی با بلد
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
