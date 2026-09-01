import { Star } from "lucide-react";
import { toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  size = 16,
  showValue = false,
  reviewsCount,
  className,
}: {
  value: number;
  size?: number;
  showValue?: boolean;
  reviewsCount?: number;
  className?: string;
}) {
  const rounded = Math.round(value);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div
        className="flex items-center gap-0.5 text-amber-400"
        role="img"
        aria-label={`امتیاز ${toPersianDigits(value)} از ۵`}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= rounded ? "fill-current" : "text-slate-200"}
            fill={i <= rounded ? "currentColor" : "none"}
          />
        ))}
      </div>
      {showValue && (
        <span className="pt-0.5 text-sm font-bold text-slate-700">
          {toPersianDigits(value)}
        </span>
      )}
      {reviewsCount != null && (
        <span className="pt-0.5 text-xs text-slate-400">
          ({toPersianDigits(reviewsCount)} دیدگاه)
        </span>
      )}
    </div>
  );
}
