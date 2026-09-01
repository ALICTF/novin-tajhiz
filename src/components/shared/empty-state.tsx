import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center",
        className,
      )}
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-700">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      )}
      {children && <div className="flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
