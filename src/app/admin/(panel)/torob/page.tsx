import Link from "next/link";
import { AlertTriangle, CheckCircle2, ExternalLink, PackageX } from "lucide-react";
import {
  getTorobExcluded,
  getTorobPage,
  getTorobStats,
  TOROB_PAGE_SIZE,
} from "@/lib/torob/feed";
import { siteConfig } from "@/lib/data/site";
import { formatNumber, toPersianDigits } from "@/lib/format";
import {
  Badge,
  PageHeader,
  StatCard,
  TableShell,
  Td,
  Th,
} from "@/components/admin/ui";
import { CopyField } from "@/components/admin/copy-field";

/**
 * وضعیت اتصال به ترب.
 *
 * ترب پنل مدیریتی روی سایت ما ندارد؛ خودش دوره‌ای فید را می‌خواند. پس کار این
 * صفحه این است که نشان دهد *چه چیزی* به ترب می‌رود و چه چیزی نمی‌رود و چرا —
 * وگرنه صاحب فروشگاه هیچ راهی ندارد بفهمد چرا محصولی در ترب دیده نمی‌شود.
 */

export default async function AdminTorobPage() {
  const [stats, excluded, preview] = await Promise.all([
    getTorobStats(),
    getTorobExcluded(20),
    getTorobPage(1),
  ]);

  const feedUrl = `${siteConfig.url}/api/torob/products`;

  return (
    <>
      <PageHeader
        title="ترب"
        description="وضعیت فید محصولات برای موتور مقایسه قیمت ترب"
      />

      {/* ------------------------------ آمار ------------------------------ */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="در فید ترب"
          value={toPersianDigits(stats.included)}
          hint={`از ${toPersianDigits(stats.total)} محصول`}
          icon={CheckCircle2}
        />
        <StatCard
          label="صفحات فید"
          value={toPersianDigits(stats.pages)}
          hint={`${toPersianDigits(TOROB_PAGE_SIZE)} محصول در هر صفحه`}
          icon={ExternalLink}
        />
        <StatCard
          label="بدون قیمت"
          value={toPersianDigits(stats.noPrice)}
          hint="به ترب نمی‌روند"
          icon={AlertTriangle}
          href="/admin/products"
        />
        <StatCard
          label="ناموجود"
          value={toPersianDigits(stats.outOfStock)}
          hint="با وضعیت outofstock"
          icon={PackageX}
          href="/admin/products?status=out-of-stock"
        />
      </div>

      {/* ---------------------------- آدرس فید ---------------------------- */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h3 className="mb-2 text-sm font-bold text-slate-900">آدرس فید</h3>
        <p className="mb-4 text-xs leading-relaxed text-slate-500">
          این آدرس را از طریق پنل پشتیبانی به ترب بدهید. ترب خودش دوره‌ای آن را
          می‌خواند و قیمت و موجودی محصولات را به‌روز می‌کند.
        </p>

        <CopyField value={feedUrl} />

        <div className="mt-4 flex flex-col gap-1.5 text-[11px] text-slate-400">
          <span>متد درخواست: POST (برای بررسی دستی، GET هم پاسخ می‌دهد)</span>
          <span>
            پارامترها: <span className="dir-ltr inline-block">page</span> ،
            <span className="dir-ltr inline-block">page_unique</span> ،
            <span className="dir-ltr inline-block">page_url</span>
          </span>
        </div>
      </section>

      {/* -------------------------- محصولات جامانده -------------------------- */}
      {excluded.length > 0 && (
        <section className="mt-6">
          <div className="mb-3 flex items-start gap-2.5 rounded-2xl bg-amber-50 px-4 py-3.5 ring-1 ring-amber-200 ring-inset">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed text-amber-800">
              <strong className="font-bold">
                {toPersianDigits(stats.noPrice)} محصول منتشرشده قیمت ندارند
              </strong>{" "}
              و به ترب فرستاده نمی‌شوند. ترب موتور مقایسه قیمت است و رکورد بدون
              قیمت را نمی‌پذیرد. برای دیده شدنشان، قیمت را در صفحه محصول وارد
              کنید.
            </p>
          </div>

          <TableShell>
            <thead>
              <tr>
                <Th>محصول</Th>
                <Th>برند</Th>
                <Th>کد کالا</Th>
                <Th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {excluded.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-slate-50">
                  <Td className="text-slate-800">{p.name}</Td>
                  <Td className="whitespace-nowrap text-xs text-slate-500">
                    {p.brand}
                  </Td>
                  <Td className="dir-ltr text-xs text-slate-400">{p.sku}</Td>
                  <Td>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/5"
                    >
                      افزودن قیمت
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        </section>
      )}

      {/* ---------------------------- پیش‌نمایش ---------------------------- */}
      <section className="mt-6">
        <h3 className="mb-3 text-sm font-bold text-slate-900">
          پیش‌نمایش خروجی — ۵ محصول اول
        </h3>

        <TableShell>
          <thead>
            <tr>
              <Th>شناسه</Th>
              <Th>عنوان</Th>
              <Th>قیمت</Th>
              <Th>موجودی</Th>
              <Th>دسته</Th>
            </tr>
          </thead>
          <tbody>
            {preview.products.slice(0, 5).map((p) => (
              <tr key={p.page_unique}>
                <Td className="dir-ltr text-xs tabular-nums text-slate-500">
                  {p.page_unique}
                </Td>
                <Td className="text-slate-800">
                  {p.title}
                  <a
                    href={p.page_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-0.5 block truncate text-[11px] text-slate-400 hover:text-primary"
                  >
                    {p.page_url}
                  </a>
                </Td>
                <Td className="whitespace-nowrap tabular-nums text-slate-700">
                  {formatNumber(Number(p.current_price))}
                  {p.old_price && (
                    <span className="mr-1.5 text-[11px] text-slate-400 line-through">
                      {formatNumber(Number(p.old_price))}
                    </span>
                  )}
                </Td>
                <Td>
                  {p.availability === "instock" ? (
                    <Badge tone="emerald">instock</Badge>
                  ) : (
                    <Badge tone="rose">outofstock</Badge>
                  )}
                </Td>
                <Td className="whitespace-nowrap text-xs text-slate-500">
                  {p.category_name}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>

        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
          محصولات به ترتیب آخرین ویرایش مرتب می‌شوند، همان‌طور که ترب می‌خواهد —
          یعنی هر محصولی که تازه اضافه یا ویرایش شود، در صفحه اول فید قرار
          می‌گیرد و زودتر به‌روز می‌شود.
        </p>
      </section>
    </>
  );
}
