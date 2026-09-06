import { formatNumber, toPersianDigits } from "@/lib/format";

/**
 * نمودار میله‌ای درآمد روزانه.
 *
 * عمداً بدون کتابخانه نمودار نوشته شده. یک کتابخانه‌ای مثل Recharts حدود ۱۰۰
 * کیلوبایت جاوااسکریپت به پنل اضافه می‌کرد، در حالی که این نمودار فقط چند
 * مستطیل است. نتیجه یک سرور کامپوننت خالص است که هیچ JS به مرورگر نمی‌فرستد؛
 * راهنمای هر ستون هم با CSS خالص (group-hover) نمایش داده می‌شود.
 */

export function RevenueChart({
  data,
}: {
  data: { date: string; total: number; count: number }[];
}) {
  const max = Math.max(...data.map((d) => d.total), 1);
  const hasAny = data.some((d) => d.total > 0);

  const dayFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Tehran",
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-40 items-end gap-1 sm:gap-2">
        {data.map((d) => {
          // ستون‌های صفر هم یک خط نازک می‌گیرند تا محور روز خالی نماند.
          const heightPercent = d.total > 0 ? Math.max(6, (d.total / max) * 100) : 2;

          return (
            <div
              key={d.date}
              className="group relative flex h-full flex-1 flex-col justify-end"
            >
              <div
                className={
                  d.total > 0
                    ? "w-full rounded-t-md bg-primary/85 transition-colors group-hover:bg-primary"
                    : "w-full rounded-t-md bg-slate-200"
                }
                style={{ height: `${heightPercent}%` }}
              />

              {/* راهنما — با CSS ظاهر می‌شود، بدون هیچ جاوااسکریپتی */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 flex-col items-center gap-0.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-center whitespace-nowrap text-white shadow-lg group-hover:flex">
                <span className="text-[11px] font-bold tabular-nums">
                  {formatNumber(d.total)} تومان
                </span>
                <span className="text-[10px] text-white/60">
                  {toPersianDigits(d.count)} سفارش ·{" "}
                  {dayFormatter.format(new Date(d.date))}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>{dayFormatter.format(new Date(data[0].date))}</span>
        {!hasAny && (
          <span className="text-slate-400">
            در این بازه سفارشی ثبت نشده است
          </span>
        )}
        <span>{dayFormatter.format(new Date(data[data.length - 1].date))}</span>
      </div>
    </div>
  );
}
