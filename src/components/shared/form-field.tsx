"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * پوشش مشترک فیلدهای فرم: برچسب، محتوا و پیام خطا.
 * `htmlFor` را به فرزند وصل نمی‌کند؛ id را خودتان روی ورودی بگذارید.
 */
export function FormField({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const errorId = `${id}-error`;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="mr-1">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </Label>

      {children}

      {hint && !error && <p className="mr-1 text-[11px] text-slate-400">{hint}</p>}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mr-1 flex items-center gap-1.5 text-xs font-medium text-rose-600"
        >
          <AlertCircle size={13} />
          {error}
        </p>
      )}
    </div>
  );
}
