import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, BookOpen, CheckCircle2, Layers, MessageCircle, Package,
  Phone, RotateCcw, ShieldCheck, Tag, ThumbsUp, User, XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import {
  breadcrumbJsonLd,
  clampDescription,
  JsonLd,
} from "@/lib/seo/json-ld";
import { StarRating } from "@/components/shared/star-rating";
import { ProductCard } from "@/components/shared/product-card";
import { getIcon } from "@/lib/icon-map";
import { getCategory } from "@/lib/data/catalog-meta";
import { getRelatedProducts } from "@/lib/catalog/filter";
import { articlesForProduct } from "@/lib/catalog/cross-links";
import {
  getProductBySlug,
  getProductReviews,
  getProductSlugs,
  getPublishedArticles,
  getPublishedProducts,
} from "@/lib/db/public";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { primaryPhone, siteConfig, warrantyStatement } from "@/lib/data/site";
import { ProductGallery } from "./product-gallery";
import { ProductPurchase } from "./product-purchase";
import { ReviewFormLazy } from "./review-form-lazy";
import { decodeParam } from "@/lib/utils";

/*
  صفحه از دیتابیس می‌خواند. کوئری‌ها با برچسب کش شده‌اند و اکشن‌های پنل بعد از
  هر ویرایش برچسب را باطل می‌کنند، پس معمولاً همین که ادمین ذخیره کند صفحه
  تازه می‌شود. این revalidate فقط تور ایمنی است: اگر ایمیج بدون دیتابیس ساخته
  شده باشد (حالت داکر) صفحه خالی build می‌شود و باید خودش را بسازد.
*/
export const revalidate = 3600;

type Params = { params: Promise<{ id: string }> };

/** همه صفحات محصول در زمان build ساخته می‌شوند. */
export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ id: slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = decodeParam(rawId);
  const product = await getProductBySlug(id);
  if (!product) return { title: "محصول یافت نشد" };

  const description = `${product.shortDescription} — خرید ${product.name} با ${warrantyStatement} از ${siteConfig.name}${
    product.price ? `. قیمت: ${formatPrice(product.price)}` : ". برای استعلام قیمت تماس بگیرید"
  }.`;

  return {
    title: product.name,
    description: clampDescription(description),
    keywords: [product.name, product.brand, ...product.tags, "تست خواب", "پلی سومنوگرافی"],
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const { id: rawId } = await params;
  const id = decodeParam(rawId);
  const product = await getProductBySlug(id);
  if (!product) notFound();

  const category = getCategory(product.categoryId);
  const allProducts = await getPublishedProducts();
  const CategoryIcon = getIcon(category?.icon);
  const related = getRelatedProducts(allProducts, product);
  const [productReviews, allArticles] = await Promise.all([
    getProductReviews(product.id),
    getPublishedArticles(),
  ]);
  const guides = articlesForProduct(product, allArticles);

  /** داده ساخت‌یافته محصول برای نتایج جستجوی گوگل. */
  /*
    امتیاز فقط وقتی اعلام می‌شود که دیدگاه تأییدشده واقعی وجود داشته باشد.

    اضافه کردن aggregateRating ساختگی وسوسه‌انگیز است چون ستاره در نتایج
    گوگل نشان می‌دهد، ولی جعل داده ساخت‌یافته جریمه دستی دارد و موتورهای
    پاسخ‌محور هم اعتمادشان را به کل دامنه از دست می‌دهند. کاتالوگ فعلی
    rating صفر دارد، پس این بخش برای بیشتر محصولات اصلاً ساخته نمی‌شود.
  */
  const ratingBlock =
    productReviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (
              productReviews.reduce((sum, r) => sum + r.rating, 0) /
              productReviews.length
            ).toFixed(1),
            reviewCount: productReviews.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {};

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteConfig.url}/products/${product.slug}#product`,
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    mpn: product.sku,
    image: product.images.map((img) => `${siteConfig.url}${img}`),
    brand: { "@type": "Brand", name: product.brand },
    category: category?.name,
    inLanguage: "fa-IR",
    ...ratingBlock,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.slug}`,
      priceCurrency: "IRR",
      // قیمت‌های سایت به تومان است و schema.org واحد رسمی ایران را ریال می‌شناسد.
      ...(product.price ? { price: product.price * 10 } : {}),
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@id": `${siteConfig.url}/#organization` },
      areaServed: { "@type": "Country", name: "ایران" },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IR",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        // طبق بند «بازگشت کالا» در /terms، هزینه ارسال مرجوعی — وقتی ایراد
        // از کالا نباشد — بر عهده خریدار است. اعلام FreeReturn اینجا خلاف
        // قوانین خودِ سایت می‌شد.
        returnFees: "https://schema.org/ReturnShippingFees",
      },
    },
  };

  const crumbs = [
    { label: "محصولات", href: "/products" },
    {
      label: category?.shortName ?? "محصول",
      href: `/products?category=${product.categoryId}`,
    },
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs, `/products/${product.slug}`)} />

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <Breadcrumbs className="mb-8" items={crumbs} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* ---------------------------- گالری ---------------------------- */}
          <div className="lg:col-span-7">
            <div className="sticky top-32">
              <ProductGallery
                images={product.images}
                alt={product.name}
                price={product.price}
                oldPrice={product.oldPrice}
              />
            </div>
          </div>

          {/* --------------------------- اطلاعات --------------------------- */}
          <div className="space-y-8 lg:col-span-5">
            <div className="space-y-4 border-b border-slate-200 pb-8">
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/products?brand=${encodeURIComponent(product.brand)}`}>
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/5 px-3 py-1 text-primary hover:bg-primary/10"
                  >
                    {product.brand}
                  </Badge>
                </Link>
                <Link href={`/products?category=${product.categoryId}`}>
                  <Badge
                    variant="secondary"
                    className="gap-1.5 bg-slate-100 px-3 py-1 text-slate-600 hover:bg-slate-200"
                  >
                    <CategoryIcon size={13} />
                    {category?.shortName}
                  </Badge>
                </Link>
                {product.reviewsCount > 0 && (
                  <StarRating
                    value={product.rating}
                    showValue
                    reviewsCount={product.reviewsCount}
                    size={15}
                  />
                )}
              </div>

              <h1 className="text-2xl leading-tight font-black text-slate-900 md:text-4xl">
                {product.name}
              </h1>

              <p className="leading-relaxed text-slate-500">{product.shortDescription}</p>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                  کد کالا: {product.sku}
                </span>
                {product.inStock ? (
                  <span className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 font-bold text-emerald-600">
                    <CheckCircle2 size={14} />
                    موجود و آماده ارسال
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded bg-rose-50 px-2 py-1 font-bold text-rose-600">
                    <XCircle size={14} />
                    ناموجود — تماس بگیرید
                  </span>
                )}
              </div>
            </div>

            <ProductPurchase product={product} />

            {/*
              رفع نگرانی، دقیقاً کنار دکمه خرید.

              بیشترین ریزش در فروشگاه تجهیزات پزشکی سرِ همین سه پرسش است:
              «اصل است؟»، «اگر نخورد چه؟»، «مطمئن نیستم کدام را بخواهم».
              این سه جمله عمداً پایین صفحه یا در تب جدا نیستند — لحظه‌ای که
              کاربر مردد می‌شود همین‌جاست، و اگر جواب را نبیند، برای پیدا
              کردنش از سایت بیرون می‌رود.
            */}
            <ul className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5">
              <li className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                <span>
                  <strong className="text-slate-900">{warrantyStatement}</strong> —
                  قطعات اورجینال با ضمانت اصالت.
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                <RotateCcw size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                <span>
                  اگر قطعه با دستگاه شما سازگار نبود، طبق{" "}
                  <Link
                    href="/terms"
                    className="font-bold text-primary hover:underline"
                  >
                    شرایط بازگشت کالا
                  </Link>{" "}
                  تعویض یا مرجوع می‌شود.
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                <Phone size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                <span>
                  مطمئن نیستید همین قطعه را می‌خواهید؟ مدل دستگاهتان را به{" "}
                  <a
                    href={`tel:${primaryPhone.tel}`}
                    className="font-bold text-primary hover:underline"
                  >
                    <span className="dir-ltr tabular-nums">
                      {primaryPhone.number}
                    </span>
                  </a>{" "}
                  بگویید تا کارشناس بررسی کند — مشاوره رایگان است.
                </span>
              </li>
            </ul>

            {/* اطلاعات کلیدی */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Package, label: "برند", value: product.brand },
                { icon: Layers, label: "دسته‌بندی", value: category?.shortName ?? "—" },
                { icon: ShieldCheck, label: "ضمانت", value: "اصالت کالا" },
                {
                  icon: Tag,
                  label: "قیمت",
                  value: product.price ? formatPrice(product.price, false) : "استعلامی",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-primary/30"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-colors group-hover:bg-primary group-hover:text-white">
                    <item.icon size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="truncate text-xs text-slate-400">{item.label}</div>
                    <div className="truncate text-sm font-bold text-slate-900">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* برچسب‌ها */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag size={16} className="text-slate-400" />
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* مشاوره */}
            <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 text-blue-900">
              <div className="shrink-0 rounded-full bg-white p-3 text-primary shadow-sm">
                <Phone size={24} />
              </div>
              <div>
                <div className="mb-1 text-sm font-bold">
                  برای مشاوره یا استعلام موجودی تماس بگیرید
                </div>
                <div className="text-xs text-slate-600">
                  کارشناسان فنی نوین تجهیز راهنمای شما هستند
                </div>
                <a
                  href={`tel:${primaryPhone.tel}`}
                  className="dir-ltr mt-1 block text-lg font-bold tabular-nums tracking-wide text-primary"
                >
                  {primaryPhone.number}
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-20" />

        {/* ------------------------------ تب‌ها ------------------------------ */}
        <Tabs defaultValue="desc" className="w-full">
          <div className="mb-10 flex justify-center">
            <TabsList className="h-auto rounded-full bg-slate-100 p-1.5 shadow-inner">
              <TabsTrigger
                value="desc"
                className="rounded-full px-6 py-3 font-bold text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md md:px-8"
              >
                توضیحات محصول
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-full px-6 py-3 font-bold text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md md:px-8"
              >
                ارسال و ضمانت
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-full px-6 py-3 font-bold text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md md:px-8"
              >
                نظرات {product.reviewsCount > 0 && `(${toPersianDigits(product.reviewsCount)})`}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* توضیحات */}
          <TabsContent
            value="desc"
            className="animate-in fade-in slide-in-from-bottom-4 rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12"
          >
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 border-r-4 border-primary pr-4 text-2xl font-bold text-slate-900">
                درباره {product.name}
              </h2>

              {product.description.length > 0 ? (
                <div className="space-y-4 text-justify leading-loose">
                  {product.description.map((para, i) => (
                    <p key={i} className="text-slate-600">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="leading-loose text-slate-600">
                  {product.shortDescription} برای دریافت مشخصات فنی دقیق، سازگاری با مدل
                  دستگاه شما و استعلام موجودی، با کارشناسان ما تماس بگیرید.
                </p>
              )}

              <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm leading-relaxed text-slate-600">
                <p className="mb-2 flex items-center gap-2 font-bold text-slate-800">
                  <CheckCircle2 size={18} className="text-primary" />
                  پیش از خرید بخوانید
                </p>
                سازگاری قطعات یدکی و اکسسوری با مدل دقیق دستگاه شما اهمیت زیادی دارد. اگر
                از انتخاب خود مطمئن نیستید، پیش از ثبت سفارش مدل دستگاهتان را به کارشناسان
                ما اعلام کنید تا سازگاری بررسی شود.
              </div>
            </div>
          </TabsContent>

          {/* ارسال و ضمانت */}
          <TabsContent
            value="shipping"
            className="animate-in fade-in slide-in-from-bottom-4 rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12"
          >
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                  <ShieldCheck className="text-primary" />
                  ضمانت کالا
                </h2>
                <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
                  {[
                    "تمام کالاها اورجینال و با ضمانت اصالت عرضه می‌شوند.",
                    "در صورت مغایرت کالا با سفارش، تعویض رایگان انجام می‌شود.",
                    "پشتیبانی فنی برای نصب و راه‌اندازی قطعات ارائه می‌گردد.",
                    "اقلام مصرفی و بهداشتی پس از باز شدن بسته قابل بازگشت نیستند.",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-primary" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                  <Package className="text-primary" />
                  ارسال سفارش
                </h2>
                <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
                  {[
                    "ارسال به سراسر کشور با پست پیشتاز و تیپاکس.",
                    "تحویل حضوری در مشهد با هماهنگی قبلی امکان‌پذیر است.",
                    "بسته‌بندی ایمن مخصوص تجهیزات پزشکی.",
                    "پس از ثبت سفارش، کارشناسان ما برای تأیید نهایی تماس می‌گیرند.",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-primary" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* نظرات */}
          <TabsContent
            value="reviews"
            className="animate-in fade-in slide-in-from-bottom-4 rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12"
          >
            <div className="mx-auto max-w-4xl">
              {productReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 py-16 text-center">
                  <MessageCircle size={40} className="mb-4 text-slate-300" />
                  <p className="font-bold text-slate-700">هنوز دیدگاهی ثبت نشده است</p>
                  <p className="mt-1 mb-6 text-sm text-slate-500">
                    اولین نفری باشید که تجربه خود از این محصول را می‌نویسد.
                  </p>
                  <div className="w-full max-w-xs">
                    <ReviewFormLazy productId={product.id} productName={product.name} />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {productReviews.map((review) => (
                    <article
                      key={review.id}
                      className="border-b border-slate-100 pb-6 last:border-0"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <User size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{review.user}</div>
                            <div className="text-xs text-slate-400">{review.date}</div>
                          </div>
                        </div>
                        <StarRating value={review.rating} size={14} />
                      </div>

                      <p className="rounded-xl rounded-tr-none bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                        {review.text}
                      </p>

                      <div className="mt-3 flex items-center gap-4">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <ThumbsUp size={14} />
                          مفید بود ({toPersianDigits(review.helpful)})
                        </span>
                      </div>
                    </article>
                  ))}
                  <ReviewFormLazy productId={product.id} productName={product.name} />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* --------------------------- محصولات مشابه --------------------------- */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
                محصولات مرتبط
              </h2>
              <Link
                href={`/products?category=${product.categoryId}`}
                className="flex shrink-0 items-center gap-1 text-sm font-bold text-primary transition-all hover:gap-2"
              >
                مشاهده همه <ArrowLeft size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}

        {/*
          راهنمای مطالعه.

          بازدیدکننده‌ای که مطمئن نیست این قطعه به کارش می‌آید، تا قبل از این
          هیچ مسیری جز برگشتن به گوگل نداشت — صفحه محصول صفر لینک به مقالات
          داشت. این بخش همان پرسش را داخل سایت نگه می‌دارد.
        */}
        {guides.length > 0 && (
          <section className="mt-20 rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="mb-1.5 flex items-center gap-2 text-lg font-black text-slate-900">
              <BookOpen size={18} className="text-primary" />
              پیش از خرید بخوانید
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              راهنماهایی که به انتخاب درست همین دسته کمک می‌کنند.
            </p>

            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {guides.map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/blog/${g.slug}`}
                    className="group flex h-full flex-col gap-1.5 rounded-2xl border border-slate-200 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                  >
                    <span className="text-xs font-bold text-primary">
                      {g.category}
                    </span>
                    <span className="font-bold text-slate-900 transition-colors group-hover:text-primary">
                      {g.title}
                    </span>
                    <span className="line-clamp-2 text-sm leading-relaxed text-slate-500">
                      {g.excerpt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
