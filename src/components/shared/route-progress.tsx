"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * نوار پیشرفت ناوبری، برای کل سایت.
 *
 * مسئله‌ای که حل می‌کند: در App Router فایل loading.tsx فقط وقتی نشان داده
 * می‌شود که سگمنت مقصد واقعاً معلق شود. برای صفحه‌های کش‌شده یا سریع، کاربر
 * بین کلیک تا رندر شدن صفحه بعد هیچ بازخوردی نمی‌گیرد و حس می‌کند کلیکش کار
 * نکرده — مخصوصاً روی اینترنت کند.
 *
 * این کامپوننت به‌محض کلیک روی لینک داخلی نوار را نشان می‌دهد و وقتی مسیر
 * واقعاً عوض شد پنهانش می‌کند.
 *
 * چرا شنیدن رویداد کلیک، نه یک هوک آماده؟ نکست هوکی برای «وضعیت ناوبری
 * سراسری» ندارد؛ useLinkStatus فقط داخل خود هر Link کار می‌کند و برای یک
 * نوار مشترک بالای صفحه به درد نمی‌خورد.
 */

/** اگر ناوبری به هر دلیلی کامل نشد، نوار نباید برای همیشه بماند. */
const SAFETY_TIMEOUT_MS = 10_000;

/** زیر این مدت، نوار اصلاً نشان داده نمی‌شود تا چشمک نزند. */
const SHOW_DELAY_MS = 120;

function RouteProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [visible, setVisible] = React.useState(false);
  const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = React.useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    showTimer.current = null;
    safetyTimer.current = null;
    setVisible(false);
  }, []);

  const start = React.useCallback(() => {
    if (showTimer.current || safetyTimer.current) return;

    // ناوبری‌های آنی نباید باعث پرش نوار شوند.
    showTimer.current = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    safetyTimer.current = setTimeout(stop, SAFETY_TIMEOUT_MS);
  }, [stop]);

  /* --------------------- شروع: کلیک روی لینک داخلی --------------------- */
  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // کلیک با ctrl/cmd/shift یعنی باز کردن در تب جدید — ناوبری‌ای رخ نمی‌دهد.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // لینک بیرونی، دانلود، یا باز شدن در تب جدید.
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (/^(mailto|tel|sms|https?):/i.test(href) && !href.startsWith(location.origin)) {
        return;
      }

      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return;

      // فقط تغییر لنگر در همان صفحه — ناوبری واقعی نیست.
      if (url.pathname === location.pathname && url.search === location.search) {
        return;
      }

      start();
    };

    // فاز capture تا حتی اگر کامپوننتی جلوی انتشار رویداد را بگیرد، باز هم برسد.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [start]);

  /* ------------------ شروع: دکمه بازگشت و جلوی مرورگر ------------------ */
  React.useEffect(() => {
    window.addEventListener("popstate", start);
    return () => window.removeEventListener("popstate", start);
  }, [start]);

  /* ------------------------ پایان: مسیر عوض شد ------------------------ */
  React.useEffect(() => {
    stop();
    // فقط با تغییر واقعی مسیر یا کوئری اجرا می‌شود.
  }, [pathname, searchParams, stop]);

  // پاک‌سازی تایمرها هنگام unmount
  React.useEffect(() => stop, [stop]);

  if (!visible) return null;

  return (
    <span className="loading-bar" role="status" aria-label="در حال بارگذاری صفحه" />
  );
}

export function RouteProgress() {
  /*
    useSearchParams کل درخت را تا نزدیک‌ترین Suspense به رندر سمت کلاینت
    می‌برد. چون این کامپوننت در layout ریشه است، بدون این مرز همه صفحه‌های
    استاتیک سایت از حالت استاتیک خارج می‌شدند.
  */
  return (
    <React.Suspense fallback={null}>
      <RouteProgressInner />
    </React.Suspense>
  );
}
