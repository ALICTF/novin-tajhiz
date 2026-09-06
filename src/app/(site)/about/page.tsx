import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Users, Target, History, Award, CheckCircle2, Mail,
  ShieldCheck, Quote, MapPin, GraduationCap, Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { breadcrumbJsonLd, JsonLd, pageJsonLd } from "@/lib/seo/json-ld";
import { certificates, companyStats, contactInfo, founder, socialLinks } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "داستان نوین تجهیز؛ مرکز تخصصی مهندسی پزشکی در مشهد با بیش از یک دهه تجربه در تأمین، تنظیم و تعمیر تجهیزات تنفسی و خواب.",
  alternates: { canonical: "/about" },
};

const statIcons = [History, Users, Target, Award];
const certificateIcons = [Award, ShieldCheck, CheckCircle2];
/** آیکون هر مدرک مدیریت، به ترتیب فهرست founder.credentials. */
const credentialIcons = [GraduationCap, GraduationCap, Award, Stethoscope];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* --- 1. Hero Section (Introduction) --- */}
      {/* تغییر: پترن مربعی حذف شد و فقط رنگ پس‌زمینه و حباب‌های محو باقی ماندند */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 text-slate-900">
        
        {/* Blob Decoration (حباب‌های رنگی محو برای زیبایی) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full glow [--glow-color:rgba(59,130,246,.10)] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full glow [--glow-color:rgba(37,99,235,.10)] translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
            <JsonLd
              data={pageJsonLd({
                type: "AboutPage",
                name: "درباره نوین تجهیز",
                description:
                  "داستان نوین تجهیز؛ مرکز تخصصی مهندسی پزشکی در مشهد در حوزه تجهیزات پلی‌سومنوگرافی و دستگاه‌های کمک تنفسی.",
                path: "/about",
              })}
            />
            <JsonLd data={breadcrumbJsonLd([{ label: "درباره ما" }], "/about")} />

            <Breadcrumbs items={[{ label: "درباره ما" }]} className="mb-8" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
            <Badge variant="outline" className="mb-6 text-primary border-primary/20 bg-white/50 backdrop-blur px-4 py-1.5 shadow-sm">
                داستان نوین تجهیز
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                ما <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-primary">مهندسانی</span> هستیم که<br/>
                به کیفیت خواب شما اهمیت می‌دهیم
            </h1>
            
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
                از سال ۱۳۹۳، مأموریت ما پر کردن شکاف بین «تکنولوژی پزشکی» و «آرامش بیمار» بوده است. ما فقط دستگاه نمی‌فروشیم؛ ما راهکار مهندسی برای سلامتی ارائه می‌دهیم.
            </p>
        </div>
      </section>

      {/* --- 2. Stats Section --- */}
      <section className="py-12 bg-transparent -mt-8 relative z-20 container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-x-reverse divide-slate-100 p-2">
            {companyStats.map((stat, idx) => {
                const Icon = statIcons[idx] ?? Award;
                return (
                    <div key={stat.label} className="flex flex-col items-center text-center p-4">
                        <Icon className="w-8 h-8 text-primary mb-3 opacity-80" />
                        <div className="text-4xl font-black text-slate-800 mb-1">{stat.value}</div>
                        <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                    </div>
                );
            })}
        </div>
      </section>

      {/* --- 3. Management Team (Single Profile) --- */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">مدیریت مجموعه</h2>
                <p className="text-slate-500">تعهد به کیفیت، تحت نظارت مستقیم متخصصین</p>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 lg:grid-cols-5">
                {/* تصویر و هویت */}
                <div className="group overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-xl lg:col-span-2">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
                        <Image
                            src={founder.photo}
                            alt={founder.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                        <div className="absolute right-6 bottom-6 left-6 text-right">
                            <h3 className="mb-1 text-xl leading-tight font-black text-white">
                                {founder.name}
                            </h3>
                            <p className="text-sm font-bold text-blue-300">{founder.role}</p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-3 p-5">
                        {socialLinks.map((social) => (
                            <Button
                                key={social.href}
                                asChild
                                size="icon"
                                variant="outline"
                                className={`rounded-full border-slate-200 text-slate-500 transition-colors ${social.hoverClass}`}
                            >
                                <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.name}>
                                    <social.icon size={18} />
                                </a>
                            </Button>
                        ))}
                        <Button asChild size="icon" variant="outline" className="rounded-full border-slate-200 text-slate-500 transition-colors hover:border-red-600 hover:bg-red-50 hover:text-red-600">
                            <a href={`mailto:${contactInfo.email}`} aria-label="ارسال ایمیل">
                                <Mail size={18} />
                            </a>
                        </Button>
                    </div>
                </div>

                {/* زندگی‌نامه و سوابق */}
                <div className="space-y-5 lg:col-span-3">
                    <div className="relative rounded-[2rem] border border-slate-100 bg-slate-50 p-7">
                        <Quote className="absolute top-6 left-6 h-8 w-8 text-primary/20" fill="currentColor" />
                        <div className="space-y-4 text-justify leading-loose text-slate-600">
                            {founder.bio.map((para, i) => (
                                <p key={i} className={i === 0 ? "font-medium text-slate-800" : undefined}>
                                    {para}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {founder.credentials.map((cred, i) => {
                            const Icon = credentialIcons[i] ?? Award;
                            return (
                                <div
                                    key={cred.title}
                                    className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                        <Icon size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="mb-1 text-sm leading-snug font-bold text-slate-900">
                                            {cred.title}
                                        </h4>
                                        <p className="text-xs leading-relaxed text-slate-500">
                                            {cred.subtitle}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <p className="mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase">
                            حوزه تخصصی
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {founder.expertise.map((item) => (
                                <span
                                    key={item}
                                    className="dir-ltr rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-600"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 4. Our Mission & Vision --- */}
      <section className="py-16 md:py-24 bg-slate-50 container mx-auto px-4 md:px-6 max-w-7xl rounded-[2rem] md:rounded-[3rem] my-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8 order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                    چرا پزشکان متخصص<br/>
                    <span className="text-primary">نوین تجهیز</span> را پیشنهاد می‌کنند؟
                </h2>
                <p className="text-slate-500 leading-7 text-justify">
                    برخلاف فروشگاه‌های عمومی، تمام اعضای تیم ما فارغ‌التحصیلان رشته مهندسی پزشکی هستند. ما زبان پزشک را می‌فهمیم و نیاز بیمار را درک می‌کنیم. هر دستگاهی که از ما تهیه می‌کنید، حاصل ساعت‌ها تست فنی و کنترل کیفی دقیق است.
                </p>
                
                <ul className="space-y-4">
                    {[
                        "نمایندگی رسمی برندهای ResMed و Philips",
                        "واحد فنی تخصصی تعمیرات با قطعات اورجینال",
                        "آموزش رایگان نصب و راه‌اندازی در منزل",
                        "گارانتی تعویض بی قید و شرط ۶ ماهه"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <div className="bg-green-100 p-1 rounded-full text-green-600">
                                <CheckCircle2 size={16} />
                            </div>
                            <span className="text-slate-700 font-medium">{item}</span>
                        </li>
                    ))}
                </ul>
                
                <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg" className="rounded-full bg-slate-900 px-8 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800">
                        <Link href="/contact">دریافت مشاوره رایگان</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                        <Link href="/products">مشاهده محصولات</Link>
                    </Button>
                </div>
            </div>

            <div className="relative order-1 lg:order-2">
                <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                    <Image
                        src="/images/site/IMG_0319-rotated-1.jpeg"
                        alt="کارگاه فنی و تجهیزات پلی‌سومنوگرافی نوین تجهیز"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                    />
                </div>
                {/* Floating Location Card */}
                <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
                    <div className="bg-rose-100 p-3 rounded-full text-rose-600">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-800">شعبه مرکزی</div>
                        <div className="text-xs text-slate-500">{contactInfo.addressShort}</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 5. Certificates (Logo Strip) --- */}
      <section className="py-16 border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">
                دارای گواهینامه‌های معتبر بین‌المللی
            </p>
            <div className="flex flex-wrap justify-center gap-10 md:gap-16">
                {certificates.map((cert, i) => {
                    const Icon = certificateIcons[i] ?? Award;
                    return (
                        <div
                            key={cert.name}
                            className="group flex flex-col items-center gap-1 opacity-60 transition-opacity duration-500 hover:opacity-100"
                        >
                            <div className="flex items-center gap-2 text-2xl font-black text-slate-800">
                                <Icon className="text-slate-500 transition-colors group-hover:text-primary" />
                                {cert.name}
                            </div>
                            <span className="text-xs text-slate-400">{cert.description}</span>
                        </div>
                    );
                })}
            </div>
        </div>
      </section>

    </div>
  );
}