import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/admin/ui";

/**
 * ۴۰۴ داخل پنل.
 *
 * مثلاً وقتی ادمین لینک یک محصول حذف‌شده را باز کند. عمداً از EmptyState خود
 * پنل استفاده می‌کند تا داخل همان ساید‌بار و هدر بنشیند — ۴۰۴ سایت عمومی
 * اینجا بی‌ربط بود.
 */
export default function AdminNotFound() {
  return (
    <EmptyState
      icon={FileQuestion}
      title="این مورد پیدا نشد"
      description="ممکن است حذف شده باشد یا نشانی اشتباه باشد."
      action={
        <Link
          href="/admin"
          className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary/90"
        >
          بازگشت به نمای کلی
        </Link>
      }
    />
  );
}
