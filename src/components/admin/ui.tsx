import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/format";
import { ORDER_STATUS_META, type OrderStatus } from "@/lib/db/types";

/**
 * قطعات مشترک پنل. همه سرور کامپوننت‌اند و هیچ‌کدام جاوااسکریپتی به مرورگر
 * نمی‌فرستند — پنل باید سبک بماند.
 */

/* ------------------------------ کارت آمار ------------------------------ */

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  change,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  href?: string;
  /** درصد تغییر نسبت به دوره قبل؛ null یعنی قابل محاسبه نبوده. */
  change?: number | null;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon size={17} />
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-black text-slate-900 tabular-nums">
          {value}
        </span>
        {typeof change === "number" && (
          <span
            className={cn(
              "text-xs font-bold tabular-nums",
              change >= 0 ? "text-emerald-600" : "text-rose-600",
            )}
          >
            {change >= 0 ? "+" : "−"}
            {toPersianDigits(Math.abs(change))}٪
          </span>
        )}
      </div>

      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </>
  );

  const className =
    "flex flex-col rounded-2xl border border-slate-200 bg-white p-4 transition-colors sm:p-5";

  return href ? (
    <Link href={href} className={cn(className, "hover:border-primary/40")}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

/* ------------------------------ نشان وضعیت ------------------------------ */

const TONES = {
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  sky: "bg-sky-50 text-sky-700 ring-sky-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
  teal: "bg-teal-50 text-teal-700 ring-teal-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
} as const;

export function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ring-1 ring-inset",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

/* ------------------------------ حالت خالی ------------------------------ */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon size={22} />
      </span>
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

/* ------------------------------ سربرگ صفحه ------------------------------ */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-black text-slate-900 sm:text-xl">{title}</h2>
        {description && (
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* -------------------------------- جدول -------------------------------- */

/** پوسته جدول — روی موبایل به‌جای شکستن صفحه، خودش افقی اسکرول می‌شود. */
export function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-[11px] font-bold whitespace-nowrap text-slate-500",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("border-b border-slate-100 px-4 py-3 align-middle", className)}>
      {children}
    </td>
  );
}
