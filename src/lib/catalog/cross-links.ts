import type { CategoryId } from "@/lib/data/catalog-meta";
import type { Article } from "@/lib/data/articles";
import type { ProductSummary } from "@/lib/data/catalog-meta";

/**
 * پل بین مقاله و محصول.
 *
 * چرا لازم شد؟ ممیزی لینک‌های داخلی نشان داد صفحه مقاله **صفر** لینک به
 * محصول دارد و صفحه محصول **صفر** لینک به مقاله. یعنی کسی که از گوگل با
 * جست‌وجوی «تست خواب چیست» وارد مقاله می‌شود، بعد از خواندن ۹۵۰ کلمه هیچ
 * مسیری جز برگشتن به گوگل ندارد — و برعکس، خریداری که مطمئن نیست کدام قطعه
 * را می‌خواهد، هیچ راهی به توضیحات ندارد.
 *
 * تطبیق با برچسب‌ها انجام می‌شود نه با یک جدول دستی محصول‑به‑مقاله، چون
 * ادمین از پنل مقاله و محصول اضافه می‌کند و جدول دستی خیلی زود کهنه می‌شود.
 */

/**
 * نگاشت موضوع مقاله به دسته محصول.
 *
 * کلیدها عمداً بخشی از عبارت‌اند نه کل آن، تا «آپنه خواب» و «آپنه انسدادی»
 * هر دو بگیرند. ترتیب مهم است: اولین تطبیق برنده است، پس عبارت‌های
 * اختصاصی‌تر بالاتر آمده‌اند.
 */
const TOPIC_TO_CATEGORY: { match: string[]; category: CategoryId }[] = [
  { match: ["cpap", "bipap", "سی‌پپ", "سی پپ", "بای‌پپ", "تیتراسیون"], category: "pap" },
  { match: ["نوار مغز", "eeg", "نوروفیدبک"], category: "eeg" },
  { match: ["کلینیک خواب", "آزمایشگاه خواب"], category: "consumables" },
  { match: ["پلی‌سومنوگرافی", "پلی سومنوگرافی", "psg", "تست خواب", "آپنه", "خروپف"], category: "polysomnography" },
  { match: ["سلامت خواب", "فشار خون", "پایش"], category: "health-care" },
];

/** همه متن‌های قابل تطبیق یک مقاله، یکجا و کوچک‌شده. */
function articleHaystack(article: Article): string {
  return [article.title, article.category, ...article.tags]
    .join(" ")
    .toLowerCase();
}

/** دسته‌های محصولِ مرتبط با یک مقاله، به ترتیب اهمیت. */
export function categoriesForArticle(article: Article): CategoryId[] {
  const hay = articleHaystack(article);
  const hits = TOPIC_TO_CATEGORY.filter((rule) =>
    rule.match.some((m) => hay.includes(m.toLowerCase())),
  ).map((r) => r.category);

  // مقاله‌ای که به هیچ قاعده‌ای نخورد بدون پیشنهاد نمی‌ماند؛ دسته اصلی
  // فروشگاه پیش‌فرض است.
  return hits.length > 0 ? [...new Set(hits)] : ["polysomnography"];
}

/**
 * محصولات پیشنهادی برای یک مقاله.
 *
 * فقط کالای موجود پیشنهاد می‌شود. پیشنهاد دادن قلم ناموجود در انتهای یک
 * مقاله، خواننده را به بن‌بستی بدتر از نبودِ پیشنهاد می‌برد.
 */
export function productsForArticle(
  article: Article,
  products: ProductSummary[],
  limit = 4,
): ProductSummary[] {
  const categories = categoriesForArticle(article);
  const inStock = products.filter((p) => p.inStock);

  const ranked = inStock
    .filter((p) => categories.includes(p.categoryId))
    .sort((a, b) => {
      // اولویت با دسته‌ای که زودتر تطبیق خورده، بعد محصول شاخص، بعد امتیاز.
      const byCategory =
        categories.indexOf(a.categoryId) - categories.indexOf(b.categoryId);
      if (byCategory !== 0) return byCategory;
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return b.rating - a.rating;
    });

  return ranked.slice(0, limit);
}

/**
 * مقالات مرتبط با یک محصول.
 *
 * جهت عکس همان تطبیق: مقاله‌ای که دسته این محصول را پوشش می‌دهد.
 */
export function articlesForProduct(
  product: { categoryId: CategoryId; name: string; tags: string[] },
  articles: Article[],
  limit = 2,
): Article[] {
  const scored = articles
    .map((article) => {
      const categories = categoriesForArticle(article);
      const hay = articleHaystack(article);

      let score = 0;
      if (categories.includes(product.categoryId)) score += 10;
      // هم‌پوشانی برچسب، امتیاز کمتری دارد ولی تطبیق‌های خوبی می‌سازد.
      score += product.tags.filter((t) => hay.includes(t.toLowerCase())).length;

      return { article, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.article);
}
