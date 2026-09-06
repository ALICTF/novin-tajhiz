import { MessageSquare, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db/client";
import { toPersianDigits } from "@/lib/format";
import { formatRelative } from "@/lib/admin/format";
import { Badge, EmptyState, PageHeader } from "@/components/admin/ui";
import { deleteMessageAction, toggleMessageReadAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<string, string> = {
  contact: "فرم تماس",
  quote: "استعلام قیمت",
  newsletter: "خبرنامه",
};

export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: [{ read: "asc" }, { createdAt: "desc" }],
    take: 100,
  });

  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <PageHeader
        title="پیام‌ها"
        description={
          unread > 0
            ? `${toPersianDigits(unread)} پیام خوانده‌نشده`
            : "همه پیام‌ها خوانده شده‌اند"
        }
      />

      {messages.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="هنوز پیامی نرسیده"
          description="پیام‌های فرم تماس و درخواست‌های استعلام قیمت اینجا جمع می‌شوند."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <article
              key={m.id}
              className={cn(
                "rounded-2xl border bg-white p-4 sm:p-5",
                m.read ? "border-slate-200" : "border-primary/30 bg-primary/[0.02]",
              )}
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={m.read ? "slate" : "sky"}>
                    {KIND_LABEL[m.kind] ?? m.kind}
                  </Badge>
                  <span className="text-sm font-bold text-slate-900">
                    {m.name || "بدون نام"}
                  </span>
                  {m.phone && (
                    <a
                      href={`tel:${m.phone}`}
                      className="dir-ltr text-xs tabular-nums text-slate-500 hover:text-primary"
                    >
                      {toPersianDigits(m.phone)}
                    </a>
                  )}
                  {m.email && (
                    <span className="dir-ltr text-xs text-slate-400">{m.email}</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">
                    {formatRelative(m.createdAt.toISOString())}
                  </span>
                  <form action={toggleMessageReadAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <button
                      type="submit"
                      className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      {m.read ? "خوانده‌نشده" : "خوانده شد"}
                    </button>
                  </form>
                  <form action={deleteMessageAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <button
                      type="submit"
                      aria-label="حذف پیام"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </div>

              {m.subject && (
                <p className="mb-1.5 text-sm font-medium text-slate-800">
                  {m.subject}
                </p>
              )}
              {m.body && (
                <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-600">
                  {m.body}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
