import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data/site";

/**
 * robots.txt
 *
 * علاوه بر قاعده عمومی، خزنده‌های هوش مصنوعی **صریحاً** نام برده و مجاز
 * شده‌اند. با اینکه `User-Agent: *` از قبل شاملشان می‌شد، نام بردن صریح دو
 * فایده دارد: تصمیم عمدی است و بعداً کسی فکر نمی‌کند از قلم افتاده، و اگر
 * روزی خواستید یکی را ببندید، جایش آماده است.
 *
 * تفکیک مهم بین دو نوع خزنده:
 *
 *  • خزنده‌های *پاسخ‌محور* (OAI-SearchBot، PerplexityBot، ClaudeBot) سایت را
 *    می‌خوانند تا در جواب کاربر به آن **ارجاع** بدهند. اینها ترافیک
 *    می‌آورند و بستنشان یعنی نامرئی شدن در جست‌وجوی هوش مصنوعی.
 *
 *  • خزنده‌های *آموزش مدل* (GPTBot، CCBot، Google-Extended) محتوا را برای
 *    آموزش برمی‌دارند و لزوماً ارجاعی نمی‌دهند.
 *
 * اینجا هر دو گروه باز گذاشته شده‌اند چون هدف دیده شدن است. اگر روزی
 * نخواستید محتوایتان صرف آموزش مدل شود، فقط گروه دوم را Disallow کنید —
 * گروه اول باید باز بماند.
 */

/** مسیرهایی که برای هیچ خزنده‌ای ارزش ندارند. */
const PRIVATE_PATHS = [
  "/cart",
  "/checkout",
  "/wishlist",
  "/compare",
  "/search",
  "/orders",
  "/admin",
  "/api/",
];

const AI_CRAWLERS = [
  // پاسخ‌محور — ارجاع می‌دهند
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "Applebot-Extended",
  // آموزش مدل
  "GPTBot",
  "Google-Extended",
  "CCBot",
  "meta-externalagent",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
