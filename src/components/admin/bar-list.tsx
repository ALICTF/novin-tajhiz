import { cn } from "@/lib/utils";
import { formatNumber, toPersianDigits } from "@/lib/format";

/**
 * فهرست میله‌ای افقی — برای «فروش بر اساس دسته»، «شهرهای برتر» و مانند آن.
 *
 * بدون کتابخانه نمودار نوشته شده: هر ردیف یک div با عرض درصدی است. یک
 * کتابخانه‌ای مثل Recharts حدود ۱۰۰ کیلوبایت جاوااسکریپت به پنل اضافه می‌کرد
 * برای چیزی که چند مستطیل است. نتیجه سرور کامپوننت خالص است.
 */

export type BarItem = {
  label: string;
  value: number;
  /** متن کوچک زیر یا کنار برچسب. */
  hint?: string;
};

export function BarList({
  items,
  emptyText = "داده‌ای برای نمایش نیست",
  unit = "تومان",
  tone = "primary",
}: {
  items: BarItem[];
  emptyText?: string;
  /** واحد مقدار؛ برای شمارش‌ها می‌شود «عدد» یا خالی. */
  unit?: string;
  tone?: "primary" | "slate";
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  const hasAny = items.some((i) => i.value > 0);

  if (items.length === 0 || !hasAny) {
    return (
      <p className="py-8 text-center text-xs text-slate-400">{emptyText}</p>
    );
  }

  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((item) => {
        // میله‌های خیلی کوچک باید دیده شوند، وگرنه ردیف خالی به‌نظر می‌رسد.
        const percent = item.value > 0 ? Math.max(2, (item.value / max) * 100) : 0;

        return (
          <li key={item.label} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-xs font-medium text-slate-700">
                {item.label}
                {item.hint && (
                  <span className="mr-1.5 text-[11px] font-normal text-slate-400">
                    {item.hint}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-xs font-bold tabular-nums text-slate-900">
                {formatNumber(item.value)}
                {unit && (
                  <span className="mr-1 text-[10px] font-normal text-slate-400">
                    {unit}
                  </span>
                )}
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  "h-full rounded-full",
                  tone === "primary" ? "bg-primary" : "bg-slate-400",
                )}
                style={{ width: `${percent}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * نوار توزیع وضعیت — همه وضعیت‌ها در یک خط، با رنگ هرکدام.
 * برای دیدن «چند سفارش در چه مرحله‌ای است» سریع‌تر از جدول است.
 */
export function StackedBar({
  segments,
}: {
  segments: { label: string; value: number; className: string }[];
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  if (total === 0) {
    return <p className="py-6 text-center text-xs text-slate-400">سفارشی ثبت نشده</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <div
              key={s.label}
              className={s.className}
              style={{ width: `${(s.value / total) * 100}%` }}
              title={`${s.label}: ${toPersianDigits(s.value)}`}
            />
          ))}
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-1.5">
            <span className={cn("h-2.5 w-2.5 shrink-0 rounded-sm", s.className)} />
            <span className="text-[11px] text-slate-500">{s.label}</span>
            <span className="text-[11px] font-bold tabular-nums text-slate-800">
              {toPersianDigits(s.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
