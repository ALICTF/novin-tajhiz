import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="مسیر صفحه" className={cn("w-full", className)}>
      <ol className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2 text-sm whitespace-nowrap text-slate-500">
        <li className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 transition-colors hover:text-primary"
          >
            <Home size={14} />
            خانه
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              <ChevronLeft size={14} className="shrink-0 text-slate-300" />
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="max-w-[16rem] truncate font-bold text-slate-900"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
