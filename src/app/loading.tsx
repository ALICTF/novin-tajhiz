/**
 * لودینگ واحد کل سایت.
 *
 * مسیرهای محصولات (`/products` و `/products/[id]`) اسکلتون اختصاصی خودشان را
 * دارند و این فایل برای بقیه صفحات استفاده می‌شود.
 *
 * نکته عملکردی: این کامپوننت عمداً پوشش تمام‌صفحه با backdrop-blur نیست.
 * در App Router محتوای loading جای children داخل <main> می‌نشیند، پس هدر و
 * فوتر سر جایشان می‌مانند و نیازی به لایه شناور روی کل صفحه نیست.
 */
export default function Loading() {
  return (
    <>
      {/* نوار باریک بالای صفحه — انیمیشنش فقط transform است */}
      <span className="loading-bar" aria-hidden />

      <div className="flex min-h-[55vh] w-full flex-col items-center justify-center gap-4 px-4">
        <span
          aria-hidden
          className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary [animation-duration:0.7s] motion-reduce:animate-none"
        />
        <p
          role="status"
          aria-live="polite"
          className="text-sm font-medium text-slate-400"
        >
          در حال بارگذاری…
        </p>
      </div>
    </>
  );
}
