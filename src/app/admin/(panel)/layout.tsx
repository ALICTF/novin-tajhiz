import { prisma } from "@/lib/db/client";
import { OPEN_ORDER_STATUSES } from "@/lib/db/types";
import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/admin/guard";

/**
 * پنل همیشه داده لحظه‌ای می‌خواهد؛ کش صفحه اینجا معنا ندارد چون ادمین باید
 * بلافاصله بعد از هر ویرایش نتیجه را ببیند.
 */
export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  const [openOrders, pendingReviews, unreadMessages] = await Promise.all([
    prisma.order.count({ where: { status: { in: OPEN_ORDER_STATUSES } } }),
    prisma.review.count({ where: { published: false } }),
    prisma.message.count({ where: { read: false } }),
  ]);

  return (
    <AdminShell counts={{ openOrders, pendingReviews, unreadMessages }}>
      {children}
    </AdminShell>
  );
}
