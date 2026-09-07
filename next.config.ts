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
    // بیشتر تصاویر سایت حداکثر ۱۶۰۰ پیکسل عرض دارند، ولی تصویر هیرو تمام‌عرض
    // است و روی مانیتور بزرگ تا ۲۵۶۰ پیکسل کشیده می‌شود. ۳۸۴۰ عمداً نیست چون
    // هیچ منبعی آن‌قدر بزرگ نیست و فقط پردازنده سرور را مشغول می‌کرد.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2560],
    // تصاویر محلی‌اند و با تغییر محتوا نام فایلشان عوض می‌شود؛ کش کوتاه
    // پیش‌فرض (۶۰ ثانیه) یعنی بهینه‌سازی مکرر و بی‌دلیل. یک ماه کش می‌گیرند.
    minimumCacheTTL: 2678400,
  },

  /*
    خروجی standalone فقط فایل‌های واقعاً لازم را کنار سرور می‌گذارد و
    node_modules را ردیابی می‌کند. ایمیج داکر به‌جای چند صد مگابایت، حدود
    ۱۵۰ مگابایت می‌شود و بالا آمدن کانتینر هم سریع‌تر است.
  */
  output: "standalone",

  poweredByHeader: false,

  /*
    هدرهای امنیتی.

    عمداً Content-Security-Policy کامل گذاشته نشده: نکست برای هیدریشن از
    اسکریپت‌های inline استفاده می‌کند و CSP سخت‌گیرانه بدون nonce سایت را
    می‌شکند. بقیه هدرها اثر واقعی دارند و هیچ ریسکی ندارند.
  */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // جلوگیری از نمایش سایت داخل iframe سایت دیگر (کلیک‌دزدی).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // مرورگر نوع فایل را حدس نزند.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // آدرس کامل صفحه به سایت‌های دیگر نشت نکند.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // سایت به دوربین، میکروفون و موقعیت مکانی کاری ندارد.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        /*
          پنل و مسیرهای شخصی هرگز نباید در نتایج جستجو یا کش میانی بمانند.

          `track` عمداً از این فهرست بیرون است. آن صفحه یک فرم عمومی است که
          راهنمای «کد پیگیری کجاست» و شرح وضعیت‌های سفارش را دارد، در
          sitemap آمده و تگ canonical می‌گیرد؛ اگر همین‌جا noindex هم
          می‌گرفت، دو سیگنال متناقض به گوگل می‌رفت. داده شخصی روی
          `/orders/*` نمایش داده می‌شود که همچنان noindex است.
        */
        source: "/:path(admin|orders)/:rest*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },

  // آیکون‌ها از lucide-react به‌صورت تک‌به‌تک import می‌شوند تا کل کتابخانه
  // وارد باندل نشود.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
