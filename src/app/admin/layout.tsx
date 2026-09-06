import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  // پنل هرگز نباید در نتایج جستجو ظاهر شود.
  robots: { index: false, follow: false },
};

/**
 * لایه بیرونی پنل عمداً خالی است و هیچ نگهبانی ندارد، چون صفحه ورود هم زیر
 * همین مسیر است. محافظت در (panel)/layout.tsx انجام می‌شود که صفحه ورود داخلش
 * نیست — وگرنه ورود هم به ورود ریدایرکت می‌شد و حلقه بی‌نهایت می‌ساخت.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
