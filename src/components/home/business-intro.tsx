import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { contactInfo, founder, siteConfig } from "@/lib/data/site";
import { toPersianDigits } from "@/lib/format";

/**
 * معرفی کوتاه کسب‌وکار — بین هیرو و معرفی محصولات.
 *
 * چرا اینجا و چرا متن‌محور؟
 *
 * تا قبل از این، اولین متن جدی که خزنده گوگل بعد از هدر می‌خواند شعار ۵۸
 * کلمه‌ای هیرو بود. آن شعار «پلی‌سومنوگرافی» و «CPAP» را دارد ولی شهر، نوع
 * مشتری و خدمات را ندارد. گوگل به متن ابتدای صفحه وزن بیشتری می‌دهد و
 * تجهیزات پزشکی از دسته YMYL است، یعنی نشانه‌های سابقه و تخصص برایش
 * تعیین‌کننده‌اند.
 *
 * پس این بخش عمداً پاراگراف واقعی است نه شبکه‌ای از آیکن. همه اعداد و اسم‌ها
 * از src/lib/data/site.ts می‌آیند تا با صفحه «درباره ما» یکی بمانند و با
 * گذشت سال، دستی کهنه نشوند.
 */

/** سال جاری شمسی؛ مبنای محاسبه سابقه. */
const CURRENT_JALALI_YEAR = 1404;

export function BusinessIntro() {
  const yearsActive = CURRENT_JALALI_YEAR - siteConfig.foundedYear;
  const clinicalYears = CURRENT_JALALI_YEAR - founder.clinicalSince;

  return (
    <section className="reveal w-full border-b border-slate-100 bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-16">
          {/* ------------------------- متن معرفی ------------------------- */}
          <div>
            <Badge
              variant="outline"
              className="mb-6 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-primary"
            >
              <Building2 className="ml-2 h-3.5 w-3.5" />
              درباره نوین تجهیز
            </Badge>

            <h2 className="mb-6 text-3xl leading-[1.3] font-black tracking-tight text-slate-900 md:text-4xl">
              تأمین‌کننده تخصصی آزمایشگاه‌های خواب، از {toPersianDigits(siteConfig.foundedYear)}
            </h2>

            <div className="flex flex-col gap-5 leading-loose text-slate-600">
              <p>
                نوین تجهیز از سال {toPersianDigits(siteConfig.foundedYear)} در{" "}
                {contactInfo.city}، تجهیزات، اکسسوری و قطعات یدکی آزمایشگاه‌های
                خواب، کلینیک‌های پلی‌سومنوگرافی و مراکز درمانی را تأمین می‌کند.
                کار ما با فروش عمومی تجهیزات پزشکی فرق دارد: روی یک حوزه باریک
                تمرکز کرده‌ایم — تست خواب و درمان اختلالات تنفسی خواب — و همان
                را عمیق می‌شناسیم.
              </p>

              <p>
                از سنسور جریان هوا، نازال کانولا و پراب پالس اکسیمتر گرفته تا
                مین‌برد، موتور و مخزن آب دستگاه‌های <strong>CPAP</strong> و{" "}
                <strong>BiPAP</strong>، قطعاتی را موجود داریم که پیدا کردنشان در
                بازار ایران ساده نیست. مجموعه را یک مهندس پزشکی اداره می‌کند که
                خودش {toPersianDigits(clinicalYears)} سال تکنسین بالینی
                پلی‌سومنوگرافی بوده؛ برای همین وقتی می‌گوییم قطعه‌ای با دستگاه شما
                سازگار است، از روی کاتالوگ نمی‌گوییم.
              </p>

              <p>
                کلینیک‌های خواب و بیمارستان‌های {contactInfo.province} و
                استان‌های دیگر، اقلام مصرفی و قطعات یدکی‌شان را از ما تهیه
                می‌کنند و ارسال به سراسر کشور انجام می‌شود.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                داستان کامل مجموعه
                <ArrowLeft
                  size={17}
                  className="transition-transform group-hover:-translate-x-1"
                />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-6 py-3 text-sm font-bold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
              >
                مشاوره تخصصی رایگان
              </Link>
            </div>
          </div>

          {/* --------------------- کارنامه و مراکز همکار --------------------- */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                <Stethoscope size={16} className="text-primary" />
                مراکز درمانی همکار
              </h3>
              <ul className="flex flex-col gap-3">
                {founder.affiliations.map((place) => (
                  <li
                    key={place}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                    {place}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-sm font-bold text-slate-900">
                تخصص مدیریت مجموعه
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                {founder.intro}
              </p>
              <p className="text-xs text-slate-400">
                {founder.name} — {founder.role}
              </p>
            </div>

            <p className="flex items-start gap-2 px-2 text-xs leading-relaxed text-slate-500">
              <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
              {contactInfo.address} — {toPersianDigits(yearsActive)} سال فعالیت
              تخصصی در حوزه تجهیزات خواب و تنفس.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
