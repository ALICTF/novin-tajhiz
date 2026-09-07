import { siteConfig } from "@/lib/data/site";

/**
 * سازنده‌های داده ساخت‌یافته (JSON-LD).
 *
 * چرا یک ماژول مشترک؟ قبل از این، تنها دو صفحه داده ساخت‌یافته داشتند —
 * صفحه اصلی و صفحه محصول — و هر کدام JSON را دستی داخل خودشان می‌ساختند.
 * نتیجه‌اش این شد که مقالات وبلاگ، فروشگاه، درباره ما و تماس هیچ داده‌ای
 * نداشتند و مسیر راهنما (breadcrumb) هم هیچ‌جای سایت به گوگل معرفی نمی‌شد،
 * با اینکه کامپوننت بصری‌اش در همه‌جا بود.
 *
 * همه سازنده‌ها آدرس مطلق می‌سازند، چون گوگل در JSON-LD آدرس نسبی را
 * نمی‌پذیرد — برخلاف تگ‌های متادیتای نکست که metadataBase دارند.
 */

const ORG_ID = `${siteConfig.url}/#organization`;

/** آدرس مطلق از یک مسیر نسبی. */
export function abs(path: string): string {
  return path.startsWith("http") ? path : `${siteConfig.url}${path}`;
}

/** تگ آماده برای گذاشتن در JSX. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ---------------------------- مسیر راهنما ---------------------------- */

export type Crumb = { label: string; href?: string };

/**
 * مسیر راهنما برای گوگل.
 *
 * «خانه» همیشه اولین حلقه است چون کامپوننت بصری Breadcrumbs هم همین کار را
 * می‌کند و این دو باید با هم بخوانند؛ اگر داده ساخت‌یافته چیزی متفاوت از
 * آنچه کاربر می‌بیند بگوید، گوگل آن را نادیده می‌گیرد.
 */
export function breadcrumbJsonLd(items: Crumb[], currentPath: string) {
  const all: Crumb[] = [{ label: "خانه", href: "/" }, ...items];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      // آخرین حلقه صفحه جاری است و طبق مستندات گوگل نباید لینک داشته باشد.
      item: i === all.length - 1 ? abs(currentPath) : c.href ? abs(c.href) : undefined,
    })),
  };
}

/* ------------------------------- مقاله ------------------------------- */

export function articleJsonLd(a: {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: readonly string[] | string[];
}) {
  const url = abs(`/blog/${a.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: a.title.slice(0, 110), // گوگل عنوان بلندتر از ۱۱۰ نویسه را نادیده می‌گیرد
    description: a.excerpt,
    image: [abs(a.image)],
    datePublished: a.publishedAt,
    dateModified: a.publishedAt,
    articleSection: a.category,
    keywords: [...a.tags].join("، "),
    inLanguage: "fa-IR",
    author: { "@type": "Person", name: a.author },
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: abs(siteConfig.logo) },
    },
  };
}

/* --------------------------- فهرست صفحه‌ها --------------------------- */

/**
 * صفحه‌ای که فهرستی از چیزها را نشان می‌دهد (فروشگاه، وبلاگ).
 *
 * فقط ۲۰ قلم اول در ItemList می‌آید. گوگل سقف مشخصی اعلام نکرده، ولی فرستادن
 * صد قلم فقط حجم HTML را بالا می‌برد بی‌آنکه چیزی اضافه کند؛ کشف بقیه از
 * طریق sitemap.xml و لینک‌های داخلی انجام می‌شود.
 */
export function collectionJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  items: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${abs(opts.path)}#collection`,
    name: opts.name,
    description: opts.description,
    url: abs(opts.path),
    inLanguage: "fa-IR",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    publisher: { "@id": ORG_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.slice(0, 20).map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: abs(item.url),
      })),
    },
  };
}

/* -------------------------- صفحه‌های ساده -------------------------- */

/** صفحه‌های محتوایی: درباره ما، تماس، قوانین، حریم خصوصی. */
export function pageJsonLd(opts: {
  type: "AboutPage" | "ContactPage" | "WebPage";
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type,
    "@id": `${abs(opts.path)}#page`,
    name: opts.name,
    description: opts.description,
    url: abs(opts.path),
    inLanguage: "fa-IR",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

/* --------------------------- توضیحات متا --------------------------- */

/**
 * کوتاه کردن توضیحات متا روی مرز کلمه.
 *
 * گوگل توضیحات را حدود ۱۵۵ تا ۱۶۰ نویسه در نتایج نشان می‌دهد و بقیه را با
 * سه‌نقطه می‌بُرد. بریدن وسط کلمه در فارسی زشت‌تر از انگلیسی دیده می‌شود، پس
 * تا آخرین فاصله قبل از سقف عقب می‌رویم.
 *
 * سه‌نقطه فقط وقتی اضافه می‌شود که واقعاً چیزی حذف شده باشد.
 */
export function clampDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

/* ------------------------- هویت مؤسس و مجموعه ------------------------- */

/**
 * مؤسس مجموعه به‌عنوان یک «موجودیت» مستقل.
 *
 * چرا جدا از Organization؟
 *
 * موتورهای پاسخ‌محور (ChatGPT Search، Perplexity، AI Overviews گوگل) برای
 * جواب دادن به «نوین تجهیز کیست» یا «مدیر نوین تجهیز کیست» به موجودیت
 * ساخت‌یافته تکیه می‌کنند نه به پاراگراف‌های پراکنده. تا قبل از این، نام
 * مؤسس فقط متن ساده داخل HTML بود و هیچ‌جا گفته نشده بود که این رشته یک
 * *شخص* است، چه تخصصی دارد و چه نسبتی با مجموعه.
 *
 * `@id` پایدار است تا هر جای سایت که به این شخص اشاره می‌شود، به همین
 * موجودیت وصل شود و موتور دو نفر جدا نبیند.
 */
export function founderJsonLd(founder: {
  name: string;
  role: string;
  photo: string;
  intro: string;
  clinicalSince: number;
  credentials: readonly { title: string; subtitle: string }[];
  expertise: readonly string[];
  affiliations: readonly string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#founder`,
    name: founder.name,
    jobTitle: founder.role,
    description: founder.intro,
    image: abs(founder.photo),
    knowsAbout: [...founder.expertise],
    knowsLanguage: ["fa-IR", "en"],
    worksFor: { "@id": ORG_ID },
    affiliation: founder.affiliations.map((name) => ({
      "@type": "Organization",
      name,
    })),
    hasCredential: founder.credentials.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.title,
      description: c.subtitle,
    })),
  };
}
