import Link from "next/link";
import { Home, Package, Phone, Search } from "lucide-react";
import { ErrorScreen, ErrorLinks } from "@/components/shared/error-screen";
import { primaryPhone } from "@/lib/data/site";

/**
 * ۴۰۴ ریشه.
 *
 * برای نشانی‌هایی که به هیچ بخشی از سایت نمی‌خورند (مثل /aaa-bbb). بدون این
 * فایل، نکست صفحه پیش‌فرض انگلیسی خودش را نشان می‌داد:
 * «404: This page could not be found».
 *
 * عمداً هدر و فوتر سایت را ندارد، چون layout ریشه آن‌ها را شامل نمی‌شود و
 * این صفحه ممکن است برای مسیرهای بیرون از گروه (site) هم رندر شود.
 */
export default function RootNotFound() {
  return (
    <ErrorScreen
      code="۴۰۴"
      icon={Search}
      title="این صفحه پیدا نشد"
      description="ممکن است نشانی را اشتباه وارد کرده باشید یا صفحه جابه‌جا شده باشد."
    >
      <ErrorLinks
        items={[
          { href: "/", icon: Home, title: "صفحه اصلی", desc: "بازگشت به خانه" },
          { href: "/products", icon: Package, title: "فروشگاه", desc: "مرور محصولات" },
          { href: "/search", icon: Search, title: "جستجو", desc: "پیدا کردن مطلب" },
        ]}
      />

      <Link
        href={`tel:${primaryPhone.tel}`}
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Phone size={16} />
        تماس با پشتیبانی
        <span className="dir-ltr tabular-nums tracking-wide">
          {primaryPhone.number}
        </span>
      </Link>
    </ErrorScreen>
  );
}
