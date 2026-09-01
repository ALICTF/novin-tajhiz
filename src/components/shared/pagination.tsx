"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

/** شماره صفحات با «…» برای فهرست‌های طولانی. */
function buildPages(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "gap")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("gap");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("gap");
  pages.push(total);

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="صفحه‌بندی" className={cn("flex justify-center", className)}>
      <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-2 shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          aria-label="صفحه قبلی"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-10 w-10 rounded-full p-0 text-slate-400 hover:text-primary"
        >
          <ChevronRight size={18} />
        </Button>

        {buildPages(currentPage, totalPages).map((page, i) =>
          page === "gap" ? (
            <span key={`gap-${i}`} className="w-8 text-center text-slate-300">
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="sm"
              aria-current={currentPage === page ? "page" : undefined}
              onClick={() => onPageChange(page)}
              className={cn(
                "h-10 w-10 rounded-full p-0",
                currentPage === page
                  ? "bg-primary text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {toPersianDigits(page)}
            </Button>
          ),
        )}

        <Button
          variant="ghost"
          size="sm"
          aria-label="صفحه بعدی"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-10 w-10 rounded-full p-0 text-slate-400 hover:text-primary"
        >
          <ChevronLeft size={18} />
        </Button>
      </div>
    </nav>
  );
}
