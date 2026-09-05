import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * پارامتر مسیر را از حالت درصد-انکد بیرون می‌آورد.
 *
 * اسلاگ محصولات فارسی است و Next پارامترهای مسیر پویا را انکدشده تحویل می‌دهد
 * (`%D8%A7%D9%84-...`). در build مشکلی پیش نمی‌آید چون آنجا اسلاگ خام از
 * `generateStaticParams` می‌آید، ولی هر درخواستی که از پیش رندر نشده باشد —
 * حالت dev، محصول تازه‌اضافه‌شده، یا رندر on-demand — به «محصول یافت نشد»
 * می‌خورد. ورودی نامعتبر باعث پرتاب خطا نمی‌شود و دست‌نخورده برمی‌گردد.
 */
export function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
