import type { LucideIcon } from "lucide-react";
import { Instagram, Send } from "lucide-react";

/**
 * منبع واحد اطلاعات هویتی و تماس سایت.
 * مقادیر از سایت رسمی novintajhiz.org گرفته شده‌اند.
 */

/*
  آدرس سایت از متغیر محیطی خوانده می‌شود، نه ثابت.

  این آدرس در فید ترب، sitemap، تگ‌های OpenGraph و داده ساخت‌یافته گوگل
  به‌کار می‌رود. اگر ثابت بماند، روی هر محیطی غیر از دامنه نهایی — مثل
  زیردامنه لیارا یا محیط تست — همه این‌ها به آدرس اشتباه اشاره می‌کنند و
  خزنده ترب هم محصولات را پیدا نمی‌کند.

  NEXT_PUBLIC_ است چون در کامپوننت‌های کلاینت هم لازم می‌شود.
*/
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://novintajhiz.org"
).replace(/\/$/, "");

export const siteConfig = {
  name: "نوین تجهیز",
  nameEn: "Novin Tajhiz",
  tagline: "مرجع تخصصی پلی‌سومنوگرافی و تست خواب",
  description:
    "مهندسی پزشکی نوین تجهیز، مرجع تخصصی تجهیزات و اکسسوری پلی‌سومنوگرافی (تست خواب)، الکترودهای نوار مغز و قطعات دستگاه‌های کمک تنفسی CPAP و BiPAP در سراسر کشور.",
  shortDescription: "مرجع تخصصی پلی‌سومنوگرافی تست خواب",
  url: siteUrl,
  domain: siteUrl.replace(/^https?:\/\//, ""),
  locale: "fa_IR",
  foundedYear: 1393,
  logo: "/images/logo.png",
  ogImage: "/images/og-image.jpg",
} as const;

/** تعهد کلی مجموعه — روی همه محصولات اعمال می‌شود. */
export const warrantyStatement = "ضمانت اصالت کالا و پشتیبانی فنی";

export type PhoneEntry = {
  label: string;
  /** شکل نمایشی با ارقام فارسی — فقط برای نمایش، نه برای شماره‌گیری. */
  number: string;
  /** شکل قابل شماره‌گیری با ارقام لاتین، برای href=tel: */
  tel: string;
  hint?: string;
};

export const phones: PhoneEntry[] = [
  {
    label: "مشاوره و فروش",
    number: "۰۹۱۵-۴۲۵-۶۴۵۸",
    tel: "09154256458",
    hint: "پاسخگویی در ساعات کاری",
  },
  {
    label: "پشتیبانی فنی",
    number: "۰۹۳۰-۰۰۲-۸۹۳۲",
    tel: "09300028932",
    hint: "هماهنگی سرویس و تعمیرات",
  },
  {
    label: "خط ثابت دفتر",
    number: "۰۵۱-۳۸۷۹-۹۸۶۴",
    tel: "05138799864",
    hint: "شنبه تا چهارشنبه",
  },
];

/** شماره‌ای که همه‌جا به‌عنوان شماره اصلی نمایش داده می‌شود. */
export const primaryPhone = phones[0];

export const contactInfo = {
  email: "Novintajhiz.med@gmail.com",
  supportEmail: "Novintajhiz.med@gmail.com",
  address: "مشهد، پیروزی ۶، نوکاریزی ۷، پلاک ۱۶، واحد ۵",
  addressShort: "مشهد، بلوار پیروزی",
  city: "مشهد",
  province: "خراسان رضوی",
  workingHours: "شنبه تا چهارشنبه ۹ تا ۱۸ • پنجشنبه ۹ تا ۱۳",
  mapLinks: {
    neshan: "https://neshan.org/maps/search/نوین%20تجهیز%20مشهد",
    balad: "https://balad.ir/search?q=نوین%20تجهیز%20مشهد",
  },
} as const;

export type SocialLink = {
  name: string;
  href: string;
  handle: string;
  icon: LucideIcon;
  /** کلاس رنگ hover مخصوص همان شبکه */
  hoverClass: string;
};

export const socialLinks: SocialLink[] = [
  {
    name: "اینستاگرام",
    href: "https://instagram.com/novintajhiz_med",
    handle: "@novintajhiz_med",
    icon: Instagram,
    hoverClass: "hover:bg-[#E1306C] hover:text-white hover:border-transparent",
  },
  {
    name: "تلگرام",
    href: "https://t.me/polysomnography",
    handle: "@polysomnography",
    icon: Send,
    hoverClass: "hover:bg-[#2AABEE] hover:text-white hover:border-transparent",
  },
  {
    name: "تلگرام پشتیبانی",
    href: "https://t.me/Alice_polysomnography",
    handle: "@Alice_polysomnography",
    icon: Send,
    hoverClass: "hover:bg-[#2AABEE] hover:text-white hover:border-transparent",
  },
];

export type NavItem = {
  title: string;
  href: string;
  description?: string;
};

export const mainNav: NavItem[] = [
  { title: "صفحه اصلی", href: "/" },
  { title: "محصولات", href: "/products" },
  { title: "مقالات", href: "/blog" },
  { title: "درباره ما", href: "/about" },
  { title: "ارتباط با ما", href: "/contact" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "دسترسی سریع",
    items: [
      { title: "صفحه اصلی", href: "/" },
      { title: "فروشگاه", href: "/products" },
      { title: "مقالات", href: "/blog" },
      { title: "درباره ما", href: "/about" },
    ],
  },
  {
    title: "دسته‌بندی محصولات",
    items: [
      { title: "پلی‌سومنوگرافی", href: "/products?category=polysomnography" },
      { title: "مصرفی کلینیک خواب", href: "/products?category=consumables" },
      { title: "نوار مغز و نوروفیدبک", href: "/products?category=eeg" },
      { title: "دستگاه‌های تنفسی", href: "/products?category=pap" },
      { title: "مراقبت سلامت", href: "/products?category=health-care" },
    ],
  },
  {
    title: "راهنما و پشتیبانی",
    items: [
      { title: "پیگیری سفارش", href: "/track" },
      { title: "پرسش‌های متداول", href: "/faq" },
      { title: "ارتباط با ما", href: "/contact" },
      { title: "علاقه‌مندی‌ها", href: "/wishlist" },
      { title: "قوانین و مقررات", href: "/terms" },
      { title: "حریم خصوصی", href: "/privacy" },
    ],
  },
];

/** مراکز درمانی که مجموعه با آن‌ها همکاری داشته است. */
export const partners = [
  { name: "بیمارستان مسیح دانشوری", logo: "/images/site/masih-daneshvari.png" },
  { name: "بیمارستان نجمیه", logo: "/images/site/Najmieh-hospital.png" },
  { name: "بیمارستان بقیةالله الاعظم", logo: "/images/site/IMG_9023.png" },
  { name: "کلینیک خواب", logo: "/images/site/logo_clinic_sleep_320-1.png" },
];

/** معرفی مدیریت مجموعه — بر اساس معرفی‌نامه سایت رسمی. */
export const founder = {
  name: "مهندس سید محمدرضا حاجی‌میرزایی",
  shortName: "مهندس حاجی‌میرزایی",
  role: "مدیریت و مؤسس",
  photo: "/images/boss.jpg",
  /** سال شروع فعالیت بالینی در حوزه پلی‌سومنوگرافی. */
  clinicalSince: 1390,
  intro:
    "کارشناس ارشد مهندسی پزشکی و تکنسین بالینی پلی‌سومنوگرافی؛ کسی که هم پشت میز طراحی نشسته و هم شب‌های زیادی را کنار تخت بیمار در آزمایشگاه خواب گذرانده است.",
  bio: [
    "متولد ۱۳۷۱، فارغ‌التحصیل کارشناسی ارشد مهندسی پزشکی گرایش بیوالکتریک از دانشگاه امام رضا مشهد و کارشناسی الکترونیک از دانشگاه خاوران مشهد.",
    "از سال ۱۳۹۰ به‌عنوان تکنسین بالینی پلی‌سومنوگرافی فعالیت می‌کند و در کنار آن، تعمیرات تخصصی دستگاه‌های تست خواب و تجهیزات کمک تنفسی را بر عهده دارد.",
    "همین ترکیب — شناخت مهندسی از دل مدار و تجربه بالینی از بالین بیمار — دلیل اصلی آن است که قطعات پیشنهادی نوین تجهیز واقعاً با دستگاه شما کار می‌کنند.",
  ],
  credentials: [
    {
      title: "کارشناسی ارشد مهندسی پزشکی",
      subtitle: "بیوالکتریک — دانشگاه امام رضا مشهد",
    },
    {
      title: "کارشناسی مهندسی الکترونیک",
      subtitle: "دانشگاه خاوران مشهد",
    },
    {
      title: "ثبت اختراع و مقاله",
      subtitle: "چند اختراع ثبت‌شده و مقالات چاپ‌شده در حوزه تجهیزات پزشکی",
    },
    {
      title: "تکنسین بالینی پلی‌سومنوگرافی",
      subtitle: "از سال ۱۳۹۰ تا امروز",
    },
  ],
  expertise: [
    "Embedded Systems Design",
    "Bio Sensor",
    "Polysomnography",
    "Sleep & Respiratory Care",
  ],
  /** مراکزی که سابقه همکاری با آن‌ها وجود دارد. */
  affiliations: [
    "بیمارستان امام رضا مشهد",
    "کلینیک خواب رویا مشهد",
    "کلینیک خواب آرامش مشهد",
  ],
} as const;

/** دستاوردهایی که مجموعه در سایت رسمی خود به آن‌ها اشاره کرده است. */
export const certificates = [
  { name: "ثبت اختراع", description: "چندین ثبت اختراع در حوزه اکسسوری پلی‌سومنوگرافی" },
  { name: "مقالات علمی", description: "انتشار مقاله در سطح ملی و بین‌المللی" },
  { name: "طراحی و تولید", description: "طراحی و ساخت اکسسوری تخصصی تست خواب" },
];

/**
 * نماد اعتماد الکترونیکی.
 *
 * ⚠️ عمداً خاموش است. تصویری که در `public/images/site` هست یک لوگوی عمومی
 * دانلودشده از یک سایت PNG رایگان است (۲ کیلوبایت)، نه نماد اختصاصی مجموعه.
 * نماد واقعی باید به پروفایل شما در enamad.ir لینک شود؛ نمایش لوگوی عمومی
 * بدون آن لینک، ادعای گواهی‌ای است که تأیید نشده.
 *
 * برای فعال‌سازی: از پنل enamad.ir کد اختصاصی را بگیرید، تصویر واقعی را در
 * `public/images/site/enamad.png` بگذارید، `href` را با آدرس پروفایل خودتان
 * پر کنید و `enabled` را `true` بگذارید.
 */
export const enamad = {
  enabled: false,
  href: "",
  image: "/images/site/enamad.png",
};

export const companyStats = [
  { label: "سال فعالیت تخصصی", value: "+۱۰" },
  { label: "قلم کالای تخصصی", value: "+۸۵" },
  { label: "مرکز درمانی طرف قرارداد", value: "+۳۰" },
  { label: "ثبت اختراع و مقاله", value: "چندین" },
];
