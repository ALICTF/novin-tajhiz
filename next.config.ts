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

  // آیکون‌ها از lucide-react به‌صورت تک‌به‌تک import می‌شوند تا کل کتابخانه
  // وارد باندل نشود.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
