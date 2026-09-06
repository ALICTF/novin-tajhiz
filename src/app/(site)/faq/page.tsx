import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { allFaqs, faqGroups } from "@/lib/data/faqs";
import { primaryPhone } from "@/lib/data/site";
import { toPersianDigits } from "@/lib/format";

export const metadata: Metadata = {
  title: "پرسش‌های متداول",
  description:
    "پاسخ پرسش‌های رایج درباره خرید، ارسال، گارانتی، بازگشت کالا و نگهداری تجهیزات تنفسی.",
  alternates: { canonical: "/faq" },
};

/** داده ساخت‌یافته تا گوگل پرسش‌ها را در نتایج جستجو نمایش دهد. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <JsonLd data={breadcrumbJsonLd([{ label: "پرسش‌های متداول" }], "/faq")} />

        <Breadcrumbs items={[{ label: "پرسش‌های متداول" }]} className="mb-8" />

        <header className="mb-14 text-center">
          <Badge
            variant="outline"
            className="mb-5 border-primary/20 bg-white px-4 py-1.5 text-primary shadow-sm"
          >
            {toPersianDigits(allFaqs.length)} پرسش پرتکرار
          </Badge>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            پرسش‌های متداول
          </h1>
          <p className="mx-auto max-w-xl leading-relaxed text-slate-500">
            پیش از تماس، شاید پاسخ سؤالتان همین‌جا باشد. اگر پیدا نکردید، ما در خدمتیم.
          </p>
        </header>

        <div className="space-y-10">
          {faqGroups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-32">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-900">
                <span className="h-5 w-1 rounded-full bg-primary" />
                {group.title}
              </h2>

              <Accordion type="single" collapsible className="w-full space-y-3">
                {group.items.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`${group.id}-${i}`}
                    className="rounded-2xl border border-slate-200 bg-white px-2 shadow-sm"
                  >
                    <AccordionTrigger className="px-4 text-right font-bold text-slate-800 hover:text-primary hover:no-underline">
                      <div className="flex items-start gap-3">
                        <HelpCircle size={18} className="mt-0.5 shrink-0 text-slate-400" />
                        <span>{faq.q}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pr-11 pb-4 leading-loose text-slate-600">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>

        {/* تماس */}
        <section className="mt-16 rounded-[2.5rem] border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageSquare size={30} />
          </div>
          <h2 className="mb-3 text-2xl font-black text-slate-900">
            پاسخ سؤالتان را پیدا نکردید؟
          </h2>
          <p className="mx-auto mb-8 max-w-lg leading-relaxed text-slate-500">
            کارشناسان فنی ما آماده پاسخ‌گویی به پرسش‌های تخصصی شما درباره انتخاب،
            تنظیم و نگهداری تجهیزات هستند.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="h-12 gap-2 rounded-xl px-6">
              <a href={`tel:${primaryPhone.tel}`}>
                <Phone size={18} />
                <span className="dir-ltr tabular-nums tracking-wide">{primaryPhone.number}</span>
              </a>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-xl px-6">
              <Link href="/contact">ارسال پیام متنی</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
