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
  },

  poweredByHeader: false,
};

export default nextConfig;
