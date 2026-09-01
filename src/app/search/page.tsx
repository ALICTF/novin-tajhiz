import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchClient } from "./search-client";

export const metadata: Metadata = {
  title: "جستجو",
  description: "جستجو در محصولات فروشگاه و مقالات مجله نوین تجهیز.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="h-56 animate-pulse rounded-[2rem] border border-slate-200 bg-white" />
          </div>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
