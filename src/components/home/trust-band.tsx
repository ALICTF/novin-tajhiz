import Image from "next/image";
import { enamad, partners } from "@/lib/data/site";
import { cn } from "@/lib/utils";

/**
 * ردیف مراکز همکار — داخل خود هیرو رندر می‌شود، نه به‌عنوان یک بخش جدا.
 *
 * خریدار تجهیزات پزشکی پیش از قیمت، دنبال این است که بداند فروشنده کیست.
 * این بخش همان را با لوگوی مراکز درمانی‌ای که با مجموعه کار کرده‌اند جواب
 * می‌دهد. عمداً هیچ کادر، خط جداکننده یا پس‌زمینه‌ای ندارد تا با هیرو یکپارچه
 * دیده شود. (کادرهای آمار حذف شده‌اند؛ همان داده هنوز در صفحه «درباره ما» هست.)
 */
export function TrustBand({ tone = "light" }: { tone?: "light" | "dark" }) {
  const isDark = tone === "dark";

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl">
        <p
          className={cn(
            "mb-8 text-center text-xs font-medium sm:text-sm",
            isDark ? "text-white/70" : "text-slate-500",
          )}
        >
          تأمین‌کننده تجهیزات مراکز درمانی و کلینیک‌های خواب کشور
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12 md:gap-x-16">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className={cn(
                "group flex flex-col items-center gap-2.5 transition-opacity duration-500 hover:opacity-100",
                isDark ? "opacity-60" : "opacity-70",
              )}
              title={partner.name}
            >
              <div className="relative h-12 w-20 sm:h-14 sm:w-24">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  sizes="96px"
                  className={cn(
                    "object-contain transition-all duration-500",
                    // لوگوها تیره‌اند؛ روی زمینه تیره باید سفید شوند وگرنه محو می‌شوند.
                    isDark
                      ? "brightness-0 invert"
                      : "grayscale group-hover:grayscale-0",
                  )}
                />
              </div>
              <span
                className={cn(
                  "max-w-[8rem] text-center text-[10px] leading-snug sm:text-[11px]",
                  isDark ? "text-white/60" : "text-slate-500",
                )}
              >
                {partner.name}
              </span>
            </div>
          ))}

          {/*
            نماد اعتماد فقط وقتی نمایش داده می‌شود که نماد واقعی و لینک
            معتبر enamad.ir در site.ts تنظیم شده باشد.
          */}
          {enamad.enabled && enamad.href && (
            <a
              href={enamad.href}
              target="_blank"
              rel="noreferrer"
              className="relative h-16 w-16 shrink-0 transition-transform hover:scale-105 sm:h-20 sm:w-20"
            >
              <Image
                src={enamad.image}
                alt="نماد اعتماد الکترونیکی"
                fill
                sizes="80px"
                className="object-contain"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
