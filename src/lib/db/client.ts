import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * کلاینت پریزما — با ساخت تنبل.
 *
 * چرا تنبل و نه یک نمونه ساده در سطح ماژول؟
 *
 * در زمان build نکست همه ماژول‌ها بارگذاری می‌شوند تا صفحه‌های استاتیک ساخته
 * شوند. اگر کلاینت همان لحظه ساخته شود و DATABASE_URL تنظیم نباشد، خطا سرِ
 * import پرتاب می‌شود — یعنی *قبل از* اینکه هیچ کوئری‌ای اجرا شود و safeQuery
 * در src/lib/db/public.ts فرصت گرفتنش را داشته باشد. نتیجه شکست کل build بود،
 * حتی برای صفحه‌هایی که عمداً نبودِ دیتابیس را تحمل می‌کنند.
 *
 * با Proxy، خطا به اولین دسترسی واقعی موکول می‌شود و آنجا داخل try/catch همان
 * توابع می‌افتد. پس build بدون دیتابیس موفق می‌شود و صفحه‌ها با محتوای خالی
 * ساخته می‌شوند — همان چیزی که در مرحله build ایمیج داکر لازم است، چون آنجا
 * هنوز هیچ دیتابیسی در دسترس نیست.
 *
 * نمونه روی globalThis کش می‌شود چون در حالت توسعه نکست با هر تغییر فایل
 * ماژول‌ها را دوباره بارگذاری می‌کند و بدون این کش، اتصال‌های رهاشده روی هم
 * جمع می‌شوند.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL تنظیم نشده است.");
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

function resolveClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = resolveClient();
    const value = Reflect.get(client, property, client);
    /*
      متدها به نمونه اصلی بایند می‌شوند. بدون این، `this` داخلشان همان Proxy
      می‌شد و پریزما به فیلدهای داخلی خودش دسترسی نداشت.
    */
    return typeof value === "function" ? value.bind(client) : value;
  },
});
