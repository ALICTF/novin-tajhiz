import fs from "node:fs";
import path from "node:path";

/**
 * جایگزینی تصاویر نرمال‌شده و به‌روزرسانی مسیرها.
 *
 * ترتیب کارها مهم است: اول فایل‌ها جابه‌جا می‌شوند، بعد مسیرها در فایل داده
 * عوض می‌شوند. اگر برعکس بود و وسط کار خطایی می‌داد، سایت به فایل‌هایی اشاره
 * می‌کرد که هنوز وجود ندارند.
 *
 * اصل فایل‌ها پاک نمی‌شوند؛ به _original منتقل می‌شوند. گیت هم نسخه قبلی را
 * دارد، ولی برگرداندن یک فایل از کنار دستش ساده‌تر از کندوکاو در تاریخچه است.
 *
 * اجرا: node scripts/apply-normalized-images.mjs
 */

const DIR = "public/images/products";
const NORM = path.join(DIR, "_normalized");
const BACKUP = path.join(DIR, "_original");
const DATA = "src/lib/data/products.ts";

function main() {
  if (!fs.existsSync(NORM)) {
    throw new Error("پوشه _normalized نیست. اول normalize-product-images.mjs را اجرا کنید.");
  }

  fs.mkdirSync(BACKUP, { recursive: true });

  const originals = fs
    .readdirSync(DIR)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  const rename = new Map(); // مسیر قدیمی → مسیر جدید
  let moved = 0;

  for (const file of originals) {
    const webp = file.replace(/\.(jpe?g|png|webp)$/i, ".webp");
    const normPath = path.join(NORM, webp);
    if (!fs.existsSync(normPath)) {
      console.warn(`  ⚠ نسخه نرمال‌شده ${file} پیدا نشد؛ دست‌نخورده ماند.`);
      continue;
    }

    // اصل را کنار بگذار، نرمال‌شده را بنشان
    fs.renameSync(path.join(DIR, file), path.join(BACKUP, file));
    fs.copyFileSync(normPath, path.join(DIR, webp));

    rename.set(`/images/products/${file}`, `/images/products/${webp}`);
    moved++;
  }

  // ---------- به‌روزرسانی فایل داده ----------
  let src = fs.readFileSync(DATA, "utf8");
  let replaced = 0;
  for (const [from, to] of rename) {
    if (from === to) continue;
    const count = src.split(from).length - 1;
    if (count > 0) {
      src = src.split(from).join(to);
      replaced += count;
    }
  }
  fs.writeFileSync(DATA, src);

  fs.rmSync(NORM, { recursive: true, force: true });

  console.log(`✓ ${moved} تصویر جایگزین شد`);
  console.log(`✓ ${replaced} مسیر در ${DATA} به‌روز شد`);
  console.log(`  اصل فایل‌ها در ${BACKUP}`);
  console.log("\nقدم بعد: seed را اجرا کنید تا مسیرهای دیتابیس هم به‌روز شوند.");
}

main();
