import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * نمونه واحد PrismaClient روی PostgreSQL.
 *
 * در حالت توسعه، Next با هر تغییر فایل ماژول‌ها را دوباره بارگذاری می‌کند؛ اگر
 * کلاینت را ساده بسازیم، هر بار یک استخر اتصال تازه باز می‌شود و بعد از چند
 * ویرایش، دیتابیس از دست اتصال‌های رهاشده پر می‌شود. نگه‌داشتن نمونه روی
 * globalThis جلوی این را می‌گیرد. در production هر پروسه یک بار ماژول را
 * بارگذاری می‌کند، پس آنجا لازم نیست.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL تنظیم نشده است.");
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
