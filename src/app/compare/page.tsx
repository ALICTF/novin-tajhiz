import type { Metadata } from "next";
import { CompareClient } from "./compare-client";

export const metadata: Metadata = {
  title: "مقایسه محصولات",
  description: "مقایسه مشخصات فنی، قیمت و امتیاز محصولات در کنار یکدیگر.",
  robots: { index: false, follow: true },
};

export default function ComparePage() {
  return <CompareClient />;
}
