import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // چک‌های بیلد عمداً روشن هستند: خطای تایپ یا لینت نباید بی‌صدا وارد
  // نسخه production شود.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },

  images: {
    // هیچ دامنه بیرونی مجاز نیست — تمام تصاویر سایت به‌صورت محلی زیر
    // public/images نگهداری می‌شوند.
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    // عرض هیچ تصویر منبعی بیش از ۱۶۰۰ پیکسل نیست، پس ساختن نسخه‌های ۱۹۲۰ و
    // ۲۰۴۸ و ۳۸۴۰ فقط پردازنده سرور را مشغول می‌کند بدون آن‌که کیفیتی اضافه شود.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    // تصاویر محلی‌اند و با تغییر محتوا نام فایلشان عوض می‌شود؛ کش کوتاه
    // پیش‌فرض (۶۰ ثانیه) یعنی بهینه‌سازی مکرر و بی‌دلیل. یک ماه کش می‌گیرند.
    minimumCacheTTL: 2678400,
  },

  poweredByHeader: false,

  // آیکون‌ها از lucide-react به‌صورت تک‌به‌تک import می‌شوند تا کل کتابخانه
  // وارد باندل نشود.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
