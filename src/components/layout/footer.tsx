import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Github, MessageCircle,
  Smartphone, Code2, Copyright, MapPin, Phone, Mail,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import {
  contactInfo,
  footerNav,
  phones,
  siteConfig,
  socialLinks,
} from "@/lib/data/site";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#0B1120] text-slate-300">
      {/* لایه پس‌زمینه — محصور تا اسکرول افقی ایجاد نکند */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full glow [--glow-color:rgba(37,99,235,.10)]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full glow [--glow-color:rgba(37,99,235,.10)]" />
      </div>

      <div className="relative z-10 pt-24 pb-8">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          {/*
            چیدمان ستون‌ها:
            • موبایل  → یک ستون، وسط‌چین
            • ≥sm    → دو ستون؛ برند تمام‌عرض می‌شود تا چهار بخش بعدی دقیقاً ۲×۲ پر شوند
            • ≥lg    → ۱۲ ستونی: برند ۳ + سه گروه لینک ۲ (=۶) + خبرنامه ۳ = ۱۲
              (اگر به footerNav گروهی اضافه شد، این جمع باید دوباره تنظیم شود)
          */}
          <div className="mb-16 grid grid-cols-1 gap-10 text-center sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:text-right">
            {/* ستون برند */}
            <div className="flex flex-col items-center space-y-6 sm:col-span-2 lg:col-span-3 lg:items-start">
              <Link
                href="/"
                aria-label={`${siteConfig.name} — صفحه اصلی`}
                className="group flex items-center gap-3"
              >
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.nameEn}
                  width={550}
                  height={326}
                  className="h-14 w-auto object-contain brightness-0 invert transition-transform duration-500 group-hover:scale-105"
                />
                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                  Medical
                  <br />
                  Engineering
                </span>
              </Link>

              <p className="max-w-md text-sm leading-7 font-light text-slate-400 lg:text-right">
                {siteConfig.description}
              </p>

              <ul className="w-full max-w-md space-y-3 text-sm text-slate-400">
                <li className="flex items-start justify-center gap-2.5 lg:justify-start">
                  <MapPin size={16} className="mt-1 shrink-0 text-primary" />
                  <span className="leading-relaxed">{contactInfo.address}</span>
                </li>
                <li className="flex items-center justify-center gap-2.5 lg:justify-start">
                  <Phone size={16} className="shrink-0 text-primary" />
                  <a
                    href={`tel:${phones[0].tel}`}
                    className="dir-ltr tabular-nums tracking-wide hover:text-white"
                  >
                    {phones[0].number}
                  </a>
                </li>
                <li className="flex items-center justify-center gap-2.5 lg:justify-start">
                  <Mail size={16} className="shrink-0 text-primary" />
                  <a href={`mailto:${contactInfo.email}`} className="dir-ltr hover:text-white">
                    {contactInfo.email}
                  </a>
                </li>
              </ul>

              <div className="flex gap-3 pt-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all ${s.hoverClass}`}
                  >
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* ستون‌های لینک */}
            {footerNav.map((group, i) => (
              <div key={group.title} className="space-y-6 lg:col-span-2">
                <h3 className="flex items-center justify-center gap-2 text-lg font-bold text-white lg:justify-start">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      ["bg-primary", "bg-blue-500", "bg-rose-500"][i] ?? "bg-primary"
                    }`}
                  />
                  {group.title}
                </h3>
                <ul className="space-y-4 text-sm">
                  {group.items.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center justify-center gap-2 text-slate-400 transition-all hover:text-white lg:justify-start"
                      >
                        <ArrowLeft
                          size={12}
                          className="-translate-x-2 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        />
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* خبرنامه */}
            <div className="space-y-6 lg:col-span-3">
              <h3 className="flex items-center justify-center gap-2 text-lg font-bold text-white lg:justify-start">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                عضویت در خبرنامه
              </h3>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="mb-4 text-xs leading-relaxed text-slate-400 lg:text-right">
                  برای اطلاع از مطالب تازه و تخفیف‌ها، ایمیل خود را وارد کنید.
                </p>
                <NewsletterForm variant="dark" />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:text-right">
                <p className="mb-1 text-xs font-bold text-white">ساعات کاری</p>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {contactInfo.workingHours}
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-white/5" />

          {/* پایین فوتر */}
          <div className="flex flex-col items-center justify-between gap-6 py-8 text-xs text-slate-500 md:flex-row">
            <div className="order-2 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center md:order-1 md:justify-start">
              <Copyright size={14} className="shrink-0" />
              <span>۱۴۰۴</span>
              <span aria-hidden className="text-slate-700">|</span>
              <span>
                تمامی حقوق برای{" "}
                <strong className="font-bold text-slate-300">{siteConfig.name}</strong>{" "}
                محفوظ است.
              </span>
            </div>

            {/* امضای توسعه‌دهنده */}
            <div className="group relative order-1 md:order-2">
              <div className="flex cursor-default items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 transition-all hover:border-white/10">
                <span className="opacity-70">Design &amp; Dev by</span>
                <span className="relative bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text font-bold text-transparent">
                  Mostafa Khajenezhad
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
                </span>
                <Code2 size={14} className="text-emerald-400" />
              </div>

              <div className="invisible absolute bottom-full left-1/2 z-50 mb-4 w-72 -translate-x-1/2 translate-y-4 rounded-2xl border border-white/10 bg-[#1e293b]/95 p-5 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 p-[2px]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0f172a] text-lg font-bold text-white">
                      MK
                    </div>
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white">Mostafa Khajenezhad</h4>
                    <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                      Full Stack Developer
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <a
                    href="https://github.com/ALICTF"
                    target="_blank"
                    rel="noreferrer"
                    className="group/link flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Github size={16} className="text-slate-400 group-hover/link:text-white" />
                      <span className="text-xs text-slate-300">GitHub</span>
                    </div>
                    <ArrowLeft size={12} className="-rotate-45 text-slate-500" />
                  </a>

                  <a
                    href="https://t.me/moskha"
                    target="_blank"
                    rel="noreferrer"
                    className="group/link flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle size={16} className="text-blue-400" />
                      <span className="text-xs text-slate-300">Telegram</span>
                    </div>
                    <ArrowLeft size={12} className="-rotate-45 text-slate-500" />
                  </a>

                  <a
                    href="tel:09157152958"
                    className="group/link flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone size={16} className="text-emerald-400" />
                      <span className="text-xs text-slate-300">0915-715-2958</span>
                    </div>
                    <ArrowLeft size={12} className="-rotate-45 text-slate-500" />
                  </a>
                </div>

                <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-white/10 bg-[#1e293b]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
