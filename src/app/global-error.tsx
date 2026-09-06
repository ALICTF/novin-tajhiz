"use client";

import * as React from "react";

/**
 * آخرین خط دفاع.
 *
 * وقتی خطا در خودِ layout ریشه رخ بدهد — مثلاً فونت بارگذاری نشود یا متغیر
 * محیطی حیاتی نباشد — هیچ‌کدام از error.tsx های پایین‌تر فرصت اجرا پیدا
 * نمی‌کنند و کاربر صفحه سفید می‌بیند. این فایل جای همان layout را می‌گیرد،
 * پس باید خودش html و body داشته باشد.
 *
 * استایل عمداً inline است، نه Tailwind: در این حالت ممکن است فایل CSS هم
 * بارگذاری نشده باشد و صفحه‌ای که برای نمایش خطا ساخته شده، خودش نباید به
 * چیزی وابسته باشد که شاید خراب است.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="fa" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          color: "#0f172a",
          fontFamily: "Vazirmatn, system-ui, -apple-system, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "480px", textAlign: "center" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 24px",
              borderRadius: "18px",
              background: "#fff1f2",
              color: "#e11d48",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h1
            style={{
              margin: "0 0 12px",
              fontSize: "26px",
              fontWeight: 900,
              lineHeight: 1.4,
            }}
          >
            سایت موقتاً در دسترس نیست
          </h1>
          <p
            style={{
              margin: "0 0 32px",
              fontSize: "15px",
              lineHeight: 2,
              color: "#64748b",
            }}
          >
            مشکلی در بارگذاری سایت پیش آمده است. چند لحظه دیگر دوباره تلاش کنید؛
            اگر ادامه داشت با ما تماس بگیرید.
          </p>

          {error.digest && (
            <p
              dir="ltr"
              style={{
                margin: "0 0 28px",
                display: "inline-block",
                padding: "8px 16px",
                borderRadius: "12px",
                background: "#fff",
                border: "1px solid #e2e8f0",
                fontFamily: "ui-monospace, monospace",
                fontSize: "11px",
                color: "#94a3b8",
              }}
            >
              {error.digest}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                height: "48px",
                padding: "0 28px",
                borderRadius: "12px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              تلاش دوباره
            </button>
            {/*
              عمداً <a> ساده است نه <Link>: این صفحه وقتی نشان داده می‌شود که
              layout ریشه شکسته باشد، و در آن حالت ناوبری سمت کلاینت هم ممکن
              است کار نکند. بارگذاری کامل صفحه مطمئن‌ترین راه بیرون آمدن است.
            */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                height: "48px",
                padding: "0 28px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#475569",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              صفحه اصلی
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
