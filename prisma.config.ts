import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * پیکربندی Prisma 7.
 *
 * از نسخه ۷ به بعد آدرس دیتابیس داخل schema.prisma نوشته نمی‌شود؛ ابزار مهاجرت
 * از همین فایل می‌خواندش و کلاینت هم با همین آداپتور ساخته می‌شود
 * (src/lib/db/client.ts).
 */

// Next خودش .env را می‌خواند، ولی CLI پریزما با node اجرا می‌شود و آن را
// نمی‌بیند؛ پس اینجا دستی بارگذاری می‌شود. اگر فایل نبود (مثلاً روی CI که
// متغیرها از محیط می‌آیند) بی‌صدا رد می‌شود.
try {
  process.loadEnvFile(path.join(process.cwd(), ".env"));
} catch {
  // فایل .env وجود ندارد — متغیرها باید از خود محیط بیایند.
}

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  // ابزار مهاجرت با همین آدرس مستقیم به فایل SQLite وصل می‌شود؛ آداپتور فقط
  // برای کلاینت زمان اجرا لازم است و آنجا ساخته می‌شود (src/lib/db/client.ts).
  datasource: { url },
});
