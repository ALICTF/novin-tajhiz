import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { CompareBar } from "@/components/shared/compare-bar";

/**
 * پوسته سایت عمومی: هدر، فوتر و کانتکست‌های سبد/علاقه‌مندی/مقایسه.
 *
 * این‌ها عمداً از layout ریشه بیرون کشیده شده‌اند تا پنل مدیریت — که زیر
 * /admin و بیرون این گروه است — نه هدر و فوتر سایت را بگیرد و نه
 * جاوااسکریپت کانتکست‌ها و نوار مقایسه را دانلود کند.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:rounded-xl focus:bg-slate-900 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        پرش به محتوای اصلی
      </a>

      <Header />

      <main id="main-content" className="flex w-full flex-1 flex-col">
        {children}
      </main>

      <Footer />
      <ScrollToTop />
      <CompareBar />
    </Providers>
  );
}
