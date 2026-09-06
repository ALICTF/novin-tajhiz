import type { Metadata } from "next";
import { BlogClient } from "./blog-client";

export const metadata: Metadata = {
  title: "مجله تخصصی خواب و تنفس",
  description:
    "مقالات علمی و راهنماهای کاربردی درباره آپنه خواب، دستگاه‌های CPAP و BiPAP، نگهداری تجهیزات و سلامت خواب.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <BlogClient />;
}
