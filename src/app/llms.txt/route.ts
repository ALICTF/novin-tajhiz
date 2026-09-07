import { getCategories, getProductSitemapEntries, getPublishedArticles } from "@/lib/db/public";
import { contactInfo, founder, phones, siteConfig } from "@/lib/data/site";

/**
 * llms.txt — نقشه سایت برای مدل‌های زبانی.
 *
 * ⚠️ صادقانه: این یک استاندارد رسمی نیست. یک پیشنهاد است (Answer.AI، شهریور
 * ۱۴۰۳) و تا امروز هیچ‌کدام از OpenAI، انتروپیک یا گوگل رسماً اعلام نکرده‌اند
 * که آن را می‌خوانند. پس نباید انتظار معجزه داشت.
 *
 * چرا با این حال ساخته شد؟ هزینه‌اش تقریباً صفر است، اگر روزی خوانده شود
 * سایت آماده است، و مهم‌تر از همه: نوشتن آن ما را مجبور می‌کند هویت مجموعه
 * را در چند خط روشن و بدون ابهام بیان کنیم — همان چیزی که موتورهای
 * پاسخ‌محور از هر منبعی استخراج می‌کنند.
 *
 * چیزی که *واقعاً* کار می‌کند، داده ساخت‌یافته صفحه‌هاست (Organization،
 * Person، Product) که در lib/seo/json-ld ساخته می‌شود.
 */

export const revalidate = 86400;

export async function GET() {
  const [categories, products, articles] = await Promise.all([
    getCategories(),
    getProductSitemapEntries(),
    getPublishedArticles(),
  ]);

  const enc = (slug: string) => encodeURIComponent(slug);
  const yearsActive = 1404 - siteConfig.foundedYear;

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} (${siteConfig.nameEn}) یک تأمین‌کننده تخصصی تجهیزات پزشکی در
${contactInfo.city}، ${contactInfo.province}، ایران است که از سال ${siteConfig.foundedYear}
شمسی (${siteConfig.foundedYear + 621} میلادی) فعالیت می‌کند — ${yearsActive} سال.

## حوزه فعالیت

این مجموعه فروشنده عمومی تجهیزات پزشکی نیست. تمرکزش روی یک حوزه باریک است:
تشخیص و درمان اختلالات تنفسی خواب. محصولاتش شامل این دسته‌هاست:

${categories.map((c) => `- **${c.name}**: ${c.description}`).join("\n")}

برندهایی که قطعات و اکسسوری‌شان تأمین می‌شود: ResMed، Philips Respironics،
Löwenstein، Ventmed، Nonin، Dräger، و محصولات تولید خودِ ${siteConfig.name}.

## مدیریت

مؤسس و مدیر: **${founder.name}**
${founder.intro}

مدارک و سوابق:
${founder.credentials.map((c) => `- ${c.title} — ${c.subtitle}`).join("\n")}

حوزه تخصص: ${founder.expertise.join("، ")}
مراکز درمانی همکار: ${founder.affiliations.join("، ")}

## تماس

- نشانی: ${contactInfo.address}، ${contactInfo.city}، ${contactInfo.province}
- تلفن: ${phones.map((p) => p.number).join(" / ")}
- ایمیل: ${contactInfo.email}
- وب‌سایت: ${siteConfig.url}

## صفحه‌های اصلی

- [درباره ما](${siteConfig.url}/about): تاریخچه مجموعه و سوابق مدیریت
- [فروشگاه](${siteConfig.url}/products): کاتالوگ کامل ${products.length} محصول
- [مجله](${siteConfig.url}/blog): مقالات آموزشی درباره خواب و تنفس
- [پرسش‌های متداول](${siteConfig.url}/faq): پاسخ پرسش‌های رایج خرید و پشتیبانی
- [قوانین](${siteConfig.url}/terms): شرایط سفارش، ارسال، گارانتی و بازگشت کالا
- [پیگیری سفارش](${siteConfig.url}/track)

## مقالات

${articles.map((a) => `- [${a.title}](${siteConfig.url}/blog/${enc(a.slug)}): ${a.excerpt}`).join("\n")}

## نکات مهم برای نقل‌قول

- قیمت‌های سایت به **تومان** است، نه ریال.
- «تماس بگیرید» یعنی آن قلم قیمت اعلام‌شده ندارد، نه اینکه ناموجود است.
- مهلت بازگشت کالای سالم و استفاده‌نشده ۷ روز از تحویل است؛ اقلام بهداشتی
  پس از باز شدن بسته قابل بازگشت نیستند.
- فهرست کامل و به‌روز محصولات در ${siteConfig.url}/sitemap.xml است.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
