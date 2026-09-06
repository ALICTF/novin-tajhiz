import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/data/site";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

const defaultTitle = `${siteConfig.name} | ${siteConfig.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "پلی سومنوگرافی",
    "تست خواب",
    "اکسسوری پلی سومنوگرافی",
    "الکترود نوار مغز",
    "EEG",
    "کمربند افورت",
    "پراب پالس اکسیمتر",
    "ترمیستور تست خواب",
    "نازال کانولا",
    "CPAP",
    "BiPAP",
    "سی پپ",
    "بای پپ",
    "قطعات دستگاه تنفسی",
    "تعمیر CPAP",
    "کلینیک خواب",
    "آپنه خواب",
    "تجهیزات پزشکی مشهد",
    "نوین تجهیز",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "تجهیزات پزشکی",
  alternates: {
    canonical: "/",
    languages: { "fa-IR": "/" },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      {/* افزونه‌های مرورگر (مثل ColorZilla با ویژگی cz-shortcut-listen یا
          Grammarly) پیش از بارگذاری React ویژگی‌هایی به <html> و <body>
          اضافه می‌کنند و باعث hydration mismatch می‌شوند. این پرچم فقط
          اختلافِ ویژگی‌های همین دو تگ را نادیده می‌گیرد و روی فرزندان
          اثری ندارد، بنابراین ناهماهنگی واقعی در کامپوننت‌ها همچنان
          گزارش می‌شود. */}
      <body
        suppressHydrationWarning
        className={`${vazir.className} flex min-h-screen flex-col bg-slate-50 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
