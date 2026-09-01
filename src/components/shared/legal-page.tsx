import Link from "next/link";
import { CalendarClock, FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
};

/** قالب مشترک صفحات حقوقی (قوانین، حریم خصوصی) با فهرست کناری. */
export function LegalPage({
  title,
  intro,
  updatedAt,
  sections,
}: {
  title: string;
  intro: string;
  updatedAt: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <Breadcrumbs items={[{ label: title }]} className="mb-8" />

        <header className="mb-12 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText size={30} />
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl leading-relaxed text-slate-500">{intro}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs text-slate-400 shadow-sm">
            <CalendarClock size={14} />
            آخرین به‌روزرسانی: {updatedAt}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* فهرست */}
          <nav
            aria-label="فهرست بندها"
            className="sticky top-32 hidden h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4 lg:block"
          >
            <h2 className="mb-4 text-sm font-bold text-slate-900">فهرست بندها</h2>
            <ol className="space-y-1 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex items-start gap-2 rounded-lg px-2 py-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary"
                  >
                    <span className="text-xs text-slate-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-relaxed">{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* متن */}
          <div className="lg:col-span-8">
            <div className="space-y-10 rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm md:p-12">
              {sections.map((section, i) => (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <h2 className="mb-4 flex items-start gap-3 text-xl font-black text-slate-900">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </h2>

                  <div className="space-y-4 pr-10">
                    {section.paragraphs?.map((p, j) => (
                      <p key={j} className="text-justify leading-loose text-slate-600">
                        {p}
                      </p>
                    ))}

                    {section.items && (
                      <ul className="space-y-2.5">
                        {section.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 leading-relaxed text-slate-600"
                          >
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <p className="mt-6 rounded-2xl bg-slate-100 p-5 text-center text-xs leading-relaxed text-slate-500">
              اگر درباره این متن پرسشی دارید، از طریق{" "}
              <Link href="/contact" className="font-bold text-primary hover:underline">
                صفحه تماس با ما
              </Link>{" "}
              با کارشناسان ما در ارتباط باشید.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
