"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatNumber, toPersianDigits } from "@/lib/format";

/**
 * نمودارهای پنل مدیریت، روی Recharts.
 *
 * این فایل عمداً فقط در مسیرهای /admin استفاده می‌شود. Recharts حدود ۱۰۰
 * کیلوبایت جاوااسکریپت است و اگر جایی از سایت عمومی import شود، همان حجم به
 * باندل مشترک همه صفحه‌ها اضافه می‌شود. پنل پشت لاگین است و تک‌کاربره، پس
 * آنجا این هزینه در برابر خوانایی نمودارها قابل قبول است.
 *
 * نکته راست‌به‌چپ: Recharts محور را از چپ می‌چیند. با reversed روی XAxis
 * ترتیب خواندن فارسی می‌شود — قدیمی‌ترین روز سمت راست، جدیدترین سمت چپ.
 */

/** میلیون و میلیارد، تا محور عمودی با عددهای ده رقمی شلوغ نشود. */
function compactToman(value: number): string {
  if (value >= 1_000_000_000) {
    return `${toPersianDigits((value / 1_000_000_000).toFixed(1))} میلیارد`;
  }
  if (value >= 1_000_000) {
    return `${toPersianDigits(Math.round(value / 1_000_000))} م`;
  }
  return toPersianDigits(value);
}

const dayLabel = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  day: "numeric",
  month: "short",
  timeZone: "Asia/Tehran",
});

/* --------------------------- روند درآمد --------------------------- */

export type RevenuePoint = { date: string; total: number; count: number };

const revenueConfig = {
  total: { label: "درآمد", color: "var(--color-primary)" },
} satisfies ChartConfig;

export function RevenueAreaChart({ data }: { data: RevenuePoint[] }) {
  const points = React.useMemo(
    () =>
      data.map((d) => ({
        ...d,
        label: dayLabel.format(new Date(`${d.date}T00:00:00`)),
      })),
    [data],
  );

  const hasAny = points.some((p) => p.total > 0);

  return (
    <ChartContainer config={revenueConfig} className="aspect-auto h-[260px] w-full">
      <AreaChart data={points} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-total)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-total)" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />

        <XAxis
          dataKey="label"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          minTickGap={24}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
        />
        <YAxis
          orientation="right"
          tickLine={false}
          axisLine={false}
          width={62}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickFormatter={(v: number) => compactToman(v)}
        />

        <ChartTooltip
          cursor={{ stroke: "var(--border)" }}
          content={
            <ChartTooltipContent
              labelKey="label"
              formatter={(value, _name, item) => (
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold tabular-nums">
                    {formatNumber(Number(value))} تومان
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {toPersianDigits(Number(item?.payload?.count ?? 0))} سفارش
                  </span>
                </div>
              )}
            />
          }
        />

        <Area
          dataKey="total"
          type="monotone"
          stroke="var(--color-total)"
          strokeWidth={2}
          fill="url(#revenueFill)"
          // نقطه‌ها فقط وقتی داده کم است مفیدند؛ در ۹۰ روز شلوغی می‌سازند.
          dot={points.length <= 14 && hasAny ? { r: 3 } : false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

/* ----------------------- توزیع وضعیت سفارش ----------------------- */

export type StatusSlice = { label: string; value: number; color: string };

export function StatusDonut({ data }: { data: StatusSlice[] }) {
  const slices = data.filter((d) => d.value > 0);
  const total = slices.reduce((sum, d) => sum + d.value, 0);

  const config = React.useMemo(
    () =>
      Object.fromEntries(
        data.map((d) => [d.label, { label: d.label, color: d.color }]),
      ) satisfies ChartConfig,
    [data],
  );

  if (total === 0) {
    return (
      <p className="py-16 text-center text-xs text-slate-400">
        در این بازه سفارشی ثبت نشده است
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
      <ChartContainer config={config} className="aspect-auto h-[190px] w-[190px] shrink-0">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                nameKey="label"
                hideLabel
                formatter={(value, name) => (
                  <span className="flex items-center gap-2">
                    <span className="text-slate-500">{name}</span>
                    <span className="font-bold tabular-nums">
                      {toPersianDigits(Number(value))}
                    </span>
                  </span>
                )}
              />
            }
          />
          <Pie
            data={slices}
            dataKey="value"
            nameKey="label"
            innerRadius={52}
            outerRadius={82}
            paddingAngle={2}
            strokeWidth={0}
          >
            {slices.map((slice) => (
              <Cell key={slice.label} fill={slice.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* راهنما به‌صورت فهرست، چون برچسب‌های فارسی داخل دونات جا نمی‌شوند */}
      <ul className="flex w-full flex-col gap-2.5">
        {data.map((slice) => (
          <li key={slice.label} className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: slice.color }}
            />
            <span className="flex-1 text-xs text-slate-600">{slice.label}</span>
            <span className="text-xs font-bold tabular-nums text-slate-900">
              {toPersianDigits(slice.value)}
            </span>
            <span className="w-10 text-left text-[11px] tabular-nums text-slate-400">
              {toPersianDigits(Math.round((slice.value / total) * 100))}٪
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------- میله‌های افقی ------------------------- */

export type RankedItem = { label: string; value: number; hint?: string };

const rankedConfig = {
  value: { label: "مقدار", color: "var(--color-primary)" },
} satisfies ChartConfig;

export function RankedBarChart({
  data,
  unit = "تومان",
  emptyText = "داده‌ای برای نمایش نیست",
}: {
  data: RankedItem[];
  unit?: string;
  emptyText?: string;
}) {
  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return <p className="py-16 text-center text-xs text-slate-400">{emptyText}</p>;
  }

  return (
    <ChartContainer
      config={rankedConfig}
      // ارتفاع با تعداد ردیف‌ها رشد می‌کند تا میله‌ها له نشوند.
      style={{ height: Math.max(160, data.length * 42) }}
      className="aspect-auto w-full"
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 12, left: 12, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          orientation="right"
          tickLine={false}
          axisLine={false}
          width={130}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)" }}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, _n, item) => (
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold tabular-nums">
                    {formatNumber(Number(value))} {unit}
                  </span>
                  {item?.payload?.hint && (
                    <span className="text-[11px] text-muted-foreground">
                      {item.payload.hint}
                    </span>
                  )}
                </div>
              )}
            />
          }
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={[6, 0, 0, 6]} />
      </BarChart>
    </ChartContainer>
  );
}
