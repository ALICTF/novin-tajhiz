import "server-only";

import { redirect } from "next/navigation";
import { isSignedIn } from "@/lib/admin/auth";

/**
 * نگهبان صفحه‌ها و اکشن‌های پنل.
 *
 * middleware جلوی *ناوبری* بدون نشست را می‌گیرد، ولی Server Action ها با
 * درخواست POST مستقیم هم قابل صدا زدن‌اند. پس هر اکشنی که چیزی می‌نویسد باید
 * جداگانه اینجا را صدا بزند — تکیه کردن فقط به middleware کافی نیست.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isSignedIn())) {
    redirect("/admin/login");
  }
}
