import { Check, X } from "lucide-react";
import { ORDER_STATUS_META, type OrderStatus } from "@/lib/db/types";
import { cn } from "@/lib/utils";

/**
 * خط زمانی وضعیت سفارش برای مشتری.
 *
 * سفارش لغوشده مسیر جداگانه‌ای دارد و نباید داخل همان چهار مرحله نشان داده
 * شود، وگرنه به‌نظر می‌رسد هنوز در حال پیشرفت است.
 *
 * سرور کامپوننت خالص — هیچ جاوااسکریپتی به مرورگر نمی‌فرستد.
 */

const STEPS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3.5 ring-1 ring-rose-200 ring-inset">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <X size={16} />
        </span>
        <div>
          <p className="text-sm font-bold text-rose-800">این سفارش لغو شده است</p>
          <p className="text-xs text-rose-600">
            برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:gap-2">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const isLast = i === STEPS.length - 1;

        return (
          <li key={step} className="flex flex-1 gap-3 sm:flex-col sm:gap-2">
            {/* نشانگر + خط اتصال */}
            <div className="flex flex-col items-center sm:w-full sm:flex-row">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
                  done ? "bg-primary text-white" : "bg-slate-200 text-slate-400",
                  isCurrent && "ring-4 ring-primary/15",
                )}
              >
                {done ? <Check size={14} /> : i + 1}
              </span>

              {!isLast && (
                <span
                  className={cn(
                    "w-0.5 flex-1 sm:h-0.5 sm:w-full sm:flex-1",
                    i < currentIndex ? "bg-primary" : "bg-slate-200",
                  )}
                />
              )}
            </div>

            <div className="pb-6 sm:pb-0">
              <p
                className={cn(
                  "text-xs font-bold",
                  done ? "text-slate-900" : "text-slate-400",
                )}
              >
                {ORDER_STATUS_META[step].label}
              </p>
              {isCurrent && (
                <p className="mt-0.5 text-[11px] text-primary">وضعیت فعلی</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
