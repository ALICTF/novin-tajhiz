import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { categories } from "../src/lib/data/catalog-meta";
import { products } from "../src/lib/data/products";
import { articles } from "../src/lib/data/articles";

/**
 * پر کردن دیتابیس از کاتالوگ ثابت فعلی.
 *
 * فایل‌های src/lib/data همچنان منبع اولیه‌اند و این اسکریپت آن‌ها را یک‌بار به
 * دیتابیس منتقل می‌کند. بعد از آن، پنل مدیریت مرجع تغییرات است.
 *
 * اسکریپت idempotent است: هر بار اجرا شود همان نتیجه را می‌دهد و رکوردهای
 * موجود را به‌روزرسانی می‌کند، نه اینکه تکراری بسازد. سفارش‌ها و پیام‌ها دست
 * نمی‌خورند چون داده واقعی کاربران‌اند.
 */

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL تنظیم نشده است.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  console.log("→ دسته‌بندی‌ها");
  for (const [i, c] of categories.entries()) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        shortName: c.shortName,
        description: c.description,
        icon: c.icon,
        sortIndex: i,
      },
      create: {
        id: c.id,
        name: c.name,
        shortName: c.shortName,
        description: c.description,
        icon: c.icon,
        sortIndex: i,
      },
    });
  }
  console.log(`  ${categories.length} دسته`);

  console.log("→ محصولات");
  for (const p of products) {
    const data = {
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      categoryId: p.categoryId,
      price: p.price,
      oldPrice: p.oldPrice ?? null,
      shortDescription: p.shortDescription,
      description: JSON.stringify(p.description ?? []),
      images: JSON.stringify(p.images ?? []),
      tags: JSON.stringify(p.tags ?? []),
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      sku: p.sku,
      inStock: p.inStock,
      isNew: p.isNew ?? false,
      isFeatured: p.isFeatured ?? false,
      sortIndex: p.sortIndex,
      published: true,
    };
    await prisma.product.upsert({
      where: { id: p.id },
      update: data,
      create: { id: p.id, ...data },
    });
  }
  console.log(`  ${products.length} محصول`);

  console.log("→ مقالات");
  for (const a of articles) {
    const data = {
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      image: a.image,
      icon: a.icon,
      category: a.category,
      author: a.author,
      authorRole: a.authorRole,
      date: a.date,
      readTime: a.readTime,
      tags: JSON.stringify(a.tags ?? []),
      body: JSON.stringify(a.body ?? []),
      isFeatured: a.isFeatured ?? false,
      published: true,
      publishedAt: new Date(a.publishedAt),
    };
    await prisma.article.upsert({
      where: { id: a.id },
      update: data,
      create: { id: a.id, ...data },
    });
  }
  console.log(`  ${articles.length} مقاله`);

  // SQLite شمارنده autoincrement را از بیشترین id موجود ادامه می‌دهد، ولی چون
  // id ها را دستی ست کرده‌ایم، مطمئن می‌شویم رکورد بعدی با id تکراری ساخته نشود.
  const [maxP, maxA] = await Promise.all([
    prisma.product.aggregate({ _max: { id: true } }),
    prisma.article.aggregate({ _max: { id: true } }),
  ]);
  console.log(
    `\nآماده. بیشترین id محصول ${maxP._max.id ?? 0}، مقاله ${maxA._max.id ?? 0}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
