/**
 * فرآیند build روی Vercel.
 *
 * روی داکر، فایل entrypoint قبل از بالا آمدن سرور مهاجرت‌ها را می‌زند و در
 * صورت خالی بودن کاتالوگ داده اولیه را وارد می‌کند. Vercel entrypoint ندارد،
 * پس همان کارها باید در زمان build انجام شوند.
 *
 * سه حالت پوشش داده می‌شود:
 *
 *  ۱. DATABASE_URL تنظیم نشده — build شکست نمی‌خورد. صفحه‌ها با داده خالی
 *     ساخته می‌شوند (کوئری‌های عمومی نبودِ دیتابیس را تحمل می‌کنند) و پیام
 *     روشنی در لاگ می‌آید. این‌طور اولین استقرار حداقل بالا می‌آید و می‌شود
 *     بعد دیتابیس را وصل کرد، به‌جای اینکه هیچ چیزی دیده نشود.
 *
 *  ۲. دیتابیس هست ولی خالی — مهاجرت و سپس وارد کردن کاتالوگ اولیه.
 *
 *  ۳. دیتابیس هست و پر — فقط مهاجرت. داده‌های ادمین هرگز بازنویسی نمی‌شوند.
 */

import { execSync } from "node:child_process";

const log = (msg) => console.log(`\n[vercel-build] ${msg}`);

function run(command) {
  execSync(command, { stdio: "inherit" });
}

async function productCount() {
  // pg مستقیم استفاده می‌شود، نه کلاینت پریزما: در این لحظه ممکن است کلاینت
  // هنوز تولید نشده باشد.
  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const result = await client.query('SELECT COUNT(*)::int AS n FROM "Product"');
    return result.rows[0].n;
  } finally {
    await client.end();
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    log(
      "هشدار: DATABASE_URL تنظیم نشده است.\n" +
        "  مهاجرت و داده اولیه رد می‌شوند و سایت با محتوای خالی ساخته می‌شود.\n" +
        "  برای دیدن محصولات، یک دیتابیس PostgreSQL بسازید و DATABASE_URL را\n" +
        "  در تنظیمات پروژه Vercel اضافه کنید، بعد دوباره Deploy بزنید.",
    );
    run("next build");
    return;
  }

  log("اجرای مهاجرت‌های دیتابیس");
  run("prisma migrate deploy");

  let count = null;
  try {
    count = await productCount();
  } catch (error) {
    log(`شمارش محصولات ممکن نشد: ${error.message}`);
  }

  if (count === 0) {
    log("کاتالوگ خالی است؛ داده اولیه وارد می‌شود");
    run("tsx prisma/seed.ts");
  } else if (count !== null) {
    log(`کاتالوگ از قبل ${count} محصول دارد؛ وارد کردن داده اولیه رد شد`);
  }

  log("ساخت برنامه");
  run("next build");
}

main().catch((error) => {
  console.error("\n[vercel-build] شکست خورد:", error.message);
  process.exit(1);
});
