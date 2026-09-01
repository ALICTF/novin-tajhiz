"use client";

import * as React from "react";
import { Check, Link2, Send, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ShareButtons({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);
  const [url, setUrl] = React.useState("");

  React.useEffect(() => setUrl(window.location.href), []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("لینک مقاله کپی شد");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("کپی لینک ممکن نشد", {
        description: "می‌توانید آدرس را از نوار مرورگر بردارید.",
      });
    }
  };

  const nativeShare = async () => {
    if (!navigator.share) return copyLink();
    try {
      await navigator.share({ title, url });
    } catch {
      // کاربر پنجره اشتراک‌گذاری را بست — کاری لازم نیست.
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="ml-1 text-xs font-bold text-slate-400">اشتراک‌گذاری:</span>

      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noreferrer"
        aria-label="اشتراک در تلگرام"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:border-[#2AABEE] hover:bg-[#2AABEE] hover:text-white"
      >
        <Send size={16} />
      </a>

      <button
        type="button"
        onClick={copyLink}
        aria-label="کپی لینک مقاله"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:border-primary hover:bg-primary hover:text-white"
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
      </button>

      <button
        type="button"
        onClick={nativeShare}
        aria-label="اشتراک‌گذاری"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
      >
        <Share2 size={16} />
      </button>
    </div>
  );
}
