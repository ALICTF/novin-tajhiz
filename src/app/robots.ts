import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // صفحات شخصی و فرآیند خرید ارزش نمایه‌سازی ندارند.
      disallow: ["/cart", "/checkout", "/wishlist", "/compare", "/search"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
