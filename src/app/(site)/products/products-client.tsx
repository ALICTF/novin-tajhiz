"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductCard } from "@/components/shared/product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import {
  sortOptions,
  type Category,
  type ProductSummary,
  type SortOption,
} from "@/lib/data/catalog-meta";
import { filterProducts } from "@/lib/catalog/filter";
import { formatNumber, toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 9;

export type ProductsClientProps = {
  products: ProductSummary[];
  categories: Category[];
  brands: string[];
  categoryCounts: Record<string, number>;
  brandCounts: Record<string, number>;
  priceBounds: { min: number; max: number };
};

export function ProductsClient({
  products,
  categories,
  brands,
  categoryCounts,
  brandCounts,
  priceBounds,
}: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ------------------- وضعیت از روی پارامترهای آدرس ------------------- */

  const query = searchParams.get("q") ?? "";
  const selectedCategories = searchParams.getAll("category");
  const selectedBrands = searchParams.getAll("brand");
  const minPrice = Number(searchParams.get("min") ?? 0) || 0;
  const maxPrice = Number(searchParams.get("max") ?? 0) || priceBounds.max;
  const inStockOnly = searchParams.get("stock") === "1";
  const sort = (searchParams.get("sort") as SortOption) ?? "newest";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState(query);

  // اگر آدرس از بیرون تغییر کند (مثلاً کلیک روی منو)، ورودی جستجو هم‌گام شود.
  React.useEffect(() => setSearchInput(query), [query]);

  /** پارامترهای آدرس را به‌روز می‌کند؛ هر تغییر فیلتر صفحه را به ۱ برمی‌گرداند. */
  const updateParams = React.useCallback(
    (mutate: (params: URLSearchParams) => void, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      if (resetPage) params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
    },
    [router, searchParams],
  );

  const toggleValue = (key: string, value: string) =>
    updateParams((params) => {
      const current = params.getAll(key);
      params.delete(key);
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      next.forEach((v) => params.append(key, v));
    });

  const setParam = (key: string, value: string | null) =>
    updateParams(
      (params) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      },
      // تغییر خود «صفحه» نباید صفحه را ریست کند.
      key !== "page",
    );

  const clearFilters = () => router.replace("/products", { scroll: false });

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    !!query ||
    inStockOnly ||
    minPrice > 0 ||
    maxPrice < priceBounds.max;

  /* --------------------------- محاسبه نتایج --------------------------- */

  const filtered = React.useMemo(
    () =>
      filterProducts(products, {
        query,
        categories: selectedCategories,
        brands: selectedBrands,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice < priceBounds.max ? maxPrice : undefined,
        inStockOnly,
        sort,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, query, selectedCategories.join(), selectedBrands.join(), minPrice, maxPrice, inStockOnly, sort],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /* --------------------------- پنل فیلترها --------------------------- */

  const FilterPanel = () => (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="h-10 w-full justify-center border-dashed border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
        >
          <X size={16} />
          حذف تمام فیلترها
        </Button>
      )}

      {/* دسته‌بندی */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
          <List size={18} className="text-primary" />
          دسته‌بندی‌ها
        </h3>
        <ul className="space-y-3">
          {categories.map((cat) => {
            const id = `cat-${cat.id}`;
            return (
              <li key={cat.id} className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <Checkbox
                    id={id}
                    checked={selectedCategories.includes(cat.id)}
                    onCheckedChange={() => toggleValue("category", cat.id)}
                  />
                  <Label
                    htmlFor={id}
                    className={cn(
                      "cursor-pointer truncate text-sm font-normal transition-colors",
                      selectedCategories.includes(cat.id)
                        ? "font-bold text-primary"
                        : "text-slate-600 hover:text-primary",
                    )}
                  >
                    {cat.shortName}
                  </Label>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400">
                  {toPersianDigits(categoryCounts[cat.id] ?? 0)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* برند */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
          <Filter size={18} className="text-primary" />
          برندها
        </h3>
        <ul className="space-y-3">
          {brands.map((brand) => {
            const id = `brand-${brand}`;
            return (
              <li key={brand} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={id}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleValue("brand", brand)}
                  />
                  <Label
                    htmlFor={id}
                    className={cn(
                      "cursor-pointer text-sm font-normal transition-colors",
                      selectedBrands.includes(brand)
                        ? "font-bold text-slate-900"
                        : "text-slate-600 hover:text-slate-900",
                    )}
                  >
                    {brand}
                  </Label>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400">
                  {toPersianDigits(brandCounts[brand] ?? 0)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* قیمت */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 flex items-center gap-2 font-bold text-slate-900">
          <SlidersHorizontal size={18} className="text-primary" />
          محدوده قیمت (تومان)
        </h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="حداقل"
            aria-label="حداقل قیمت"
            value={minPrice || ""}
            onChange={(e) => setParam("min", e.target.value || null)}
            className="h-9 px-1 text-center text-xs"
          />
          <span className="text-slate-400">—</span>
          <Input
            type="number"
            inputMode="numeric"
            placeholder="حداکثر"
            aria-label="حداکثر قیمت"
            value={maxPrice < priceBounds.max ? maxPrice : ""}
            onChange={(e) => setParam("max", e.target.value || null)}
            className="h-9 px-1 text-center text-xs"
          />
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
          بیشترین قیمت کاتالوگ: {formatNumber(priceBounds.max)} تومان. محصولات
          «تماس بگیرید» همیشه نمایش داده می‌شوند.
        </p>
      </div>

      {/* موجودی */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Checkbox
            id="stock-only"
            checked={inStockOnly}
            onCheckedChange={(checked) => setParam("stock", checked ? "1" : null)}
          />
          <Label htmlFor="stock-only" className="cursor-pointer text-sm font-normal text-slate-600">
            فقط کالاهای موجود
          </Label>
        </div>
      </div>
    </div>
  );

  /* ------------------------------ رندر ------------------------------ */

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/*
        نوار جستجو و شمارنده.

        عنوان صفحه، مسیر راهنما و متن معرفی عمداً اینجا نیستند و در
        page.tsx سمت سرور رندر می‌شوند. علتش این است که این کامپوننت
        useSearchParams دارد و نکست کل زیردرختش را به رندر سمت کلاینت
        می‌برد؛ تا قبل از این، <h1> صفحه فروشگاه اصلاً در HTML سرور وجود
        نداشت و خزنده فقط اسکلت لودینگ را می‌دید.
      */}
      <div className="border-b border-slate-200 bg-white pb-8">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <p className="text-sm text-slate-500">
              نمایش{" "}
              <span className="font-bold text-slate-900">
                {toPersianDigits(filtered.length)}
              </span>{" "}
              محصول از مجموع {toPersianDigits(Object.values(categoryCounts).reduce((a, b) => a + b, 0))} قلم
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setParam("q", searchInput.trim() || null);
              }}
              className="relative w-full md:w-96"
            >
              <Search className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="جستجوی نام محصول یا برند..."
                aria-label="جستجو در محصولات"
                className="h-12 rounded-xl border-slate-200 bg-slate-50 pr-10 pl-10 transition-all focus:bg-white"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  type="button"
                  aria-label="پاک کردن جستجو"
                  onClick={() => {
                    setSearchInput("");
                    setParam("q", null);
                  }}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 hover:text-rose-500"
                >
                  <X size={16} />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8 max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
          <aside className="sticky top-32 hidden h-fit overflow-y-auto pr-1 lg:col-span-1 lg:block">
            <FilterPanel />
          </aside>

          <div className="lg:col-span-3">
            {/* چیپ‌های فیلتر فعال */}
            {(selectedCategories.length > 0 || selectedBrands.length > 0 || query) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {query && (
                  <Badge
                    variant="secondary"
                    className="gap-2 border border-slate-200 bg-white px-3 py-1.5 text-slate-700"
                  >
                    جستجو: {query}
                    <button
                      type="button"
                      aria-label="حذف جستجو"
                      onClick={() => setParam("q", null)}
                    >
                      <X size={14} className="text-slate-400 hover:text-rose-500" />
                    </button>
                  </Badge>
                )}
                {selectedCategories.map((catId) => (
                  <Badge
                    key={catId}
                    variant="secondary"
                    className="gap-2 border border-slate-200 bg-white px-3 py-1.5 text-slate-700"
                  >
                    {categories.find((c) => c.id === catId)?.shortName ?? catId}
                    <button
                      type="button"
                      aria-label="حذف فیلتر دسته"
                      onClick={() => toggleValue("category", catId)}
                    >
                      <X size={14} className="text-slate-400 hover:text-rose-500" />
                    </button>
                  </Badge>
                ))}
                {selectedBrands.map((brand) => (
                  <Badge
                    key={brand}
                    variant="secondary"
                    className="gap-2 border border-slate-200 bg-white px-3 py-1.5 text-slate-700"
                  >
                    {brand}
                    <button
                      type="button"
                      aria-label="حذف فیلتر برند"
                      onClick={() => toggleValue("brand", brand)}
                    >
                      <X size={14} className="text-slate-400 hover:text-rose-500" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* نوار ابزار */}
            <div className="sticky top-20 z-30 mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:relative lg:top-0 lg:z-0">
              <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
                <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2 border-slate-200 lg:hidden">
                      <Filter size={16} />
                      فیلترها
                      {hasActiveFilters && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[320px] overflow-y-auto p-5 sm:w-[400px]"
                  >
                    <SheetHeader className="mb-6 p-0 text-right">
                      <SheetTitle>فیلتر محصولات</SheetTitle>
                    </SheetHeader>
                    <FilterPanel />
                    <div className="sticky bottom-0 mt-8 border-t bg-white pt-4">
                      <Button
                        className="h-12 w-full bg-primary hover:bg-primary/90"
                        onClick={() => setMobileFilterOpen(false)}
                      >
                        مشاهده {toPersianDigits(filtered.length)} محصول
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex items-center gap-2">
                  <span className="hidden text-sm text-slate-500 sm:inline">مرتب‌سازی:</span>
                  <Select value={sort} onValueChange={(v) => setParam("sort", v)}>
                    <SelectTrigger className="h-10 w-[150px] rounded-lg border-none bg-slate-50 text-sm font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mr-auto hidden items-center gap-2 border-r border-slate-100 pr-4 sm:flex sm:mr-0">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="نمایش شبکه‌ای"
                  aria-pressed={viewMode === "grid"}
                  className={viewMode === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-400"}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="نمایش فهرستی"
                  aria-pressed={viewMode === "list"}
                  className={viewMode === "list" ? "bg-slate-100 text-slate-900" : "text-slate-400"}
                  onClick={() => setViewMode("list")}
                >
                  <List size={18} />
                </Button>
              </div>
            </div>

            {/* نتایج */}
            {filtered.length === 0 ? (
              <EmptyState
                icon={Search}
                title="محصولی یافت نشد"
                description="فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید. اگر محصول مورد نظرتان را پیدا نکردید، با ما تماس بگیرید."
              >
                <Button onClick={clearFilters} variant="outline">
                  پاک کردن فیلترها
                </Button>
              </EmptyState>
            ) : (
              <div
                className={cn(
                  "grid gap-5 sm:gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1",
                )}
              >
                {visible.map((product) => (
                  <ProductCard key={product.id} product={product} view={viewMode} />
                ))}
              </div>
            )}

            <Pagination
              className="mt-12"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => {
                setParam("page", p === 1 ? null : String(p));
                window.scrollTo({ top: 200, behavior: "smooth" });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
