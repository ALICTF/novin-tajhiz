import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { ProductShowcase } from "@/components/home/product-showcase";
import { AboutSummary } from "@/components/home/about-summary";
import { BlogSection } from "@/components/home/blog-section";
import { contactInfo, phones, siteConfig, socialLinks } from "@/lib/data/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** داده ساخت‌یافته کسب‌وکار محلی برای نتایج جستجوی گوگل. */
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalEquipmentStore",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  alternateName: siteConfig.nameEn,
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}${siteConfig.logo}`,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  foundingDate: "2014",
  telephone: phones.map((p) => `+98${p.tel.slice(1)}`),
  email: contactInfo.email,
  priceRange: "$$",
  currenciesAccepted: "IRR",
  address: {
    "@type": "PostalAddress",
    streetAddress: contactInfo.address,
    addressLocality: contactInfo.city,
    addressRegion: contactInfo.province,
    addressCountry: "IR",
  },
  areaServed: { "@type": "Country", name: "ایران" },
  /*
    knowsAbout یک خاصیت رسمی Organization است و حوزه تخصص مجموعه را به گوگل
    می‌شناساند. برخلاف «لینک دادن به سایت بیمارستان‌ها»، این واقعاً به درک
    موتور جستجو از هویت و تخصص دامنه کمک می‌کند.
  */
  knowsAbout: [
    "پلی‌سومنوگرافی",
    "تست خواب",
    "آپنه خواب",
    "اکسسوری و قطعات یدکی دستگاه تست خواب",
    "الکترود و اکسسوری نوار مغز",
    "دستگاه‌های کمک تنفسی CPAP و BiPAP",
    "تعمیر و سرویس تجهیزات پزشکی",
  ],
  sameAs: socialLinks.map((s) => s.href),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Thursday",
      opens: "09:00",
      closes: "13:00",
    },
  ],
};

/** داده ساخت‌یافته سایت — امکان نمایش کادر جستجو در نتایج گوگل. */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  inLanguage: "fa-IR",
  publisher: { "@id": `${siteConfig.url}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <HeroSection />
      <CategoriesSection />
      <ProductShowcase />
      <AboutSummary />
      <BlogSection />
    </>
  );
}
