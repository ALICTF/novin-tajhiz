import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

/**
 * بهینه‌سازی تصاویر پروژه: تبدیل به WebP و حذف فایل‌های بلااستفاده.
 *
 * نکته‌ای که باید بدانید: کاربر نهایی از این کار سرعت بیشتری *نمی‌بیند*.
 * next.config از قبل `formats: ["image/avif", "image/webp"]` دارد، پس هر
 * تصویری که از next/image عبور کند، صرف‌نظر از فرمت روی دیسک، به AVIF یا
 * WebP تبدیل و سرو می‌شود.
 *
 * سود واقعی جای دیگری است:
 *  • ایمیج داکر کوچک‌تر می‌شود — روی پلن ۵۱۲ مگابایتی لیارا مهم است.
 *  • اولین بازدید از هر تصویر، کار کمتری روی CPU سرور می‌گذارد چون رمزگشایی
 *    یک WebP کوچک ارزان‌تر از JPEG بزرگ است. با ۰.۵ هسته، این محسوس است.
 *  • مخزن گیت سبک‌تر می‌ماند.
 *
 * دو استثنا که عمداً تبدیل نمی‌شوند:
 *  • og-image: تصویر پیش‌نمایش شبکه‌های اجتماعی. بعضی کلاینت‌ها هنوز با WebP
 *    در og:image مشکل دارند و اینجا سازگاری از چند کیلوبایت مهم‌تر است.
 *  • icon/favicon: مرورگرها PNG یا ICO می‌خواهند.
 *
 * اجرا: node scripts/optimize-images.mjs [--delete-unused]
 */

const ROOT = "public";
const KEEP_FORMAT = [/og-image/i, /icon\./i, /favicon/i, /apple-touch/i];

/** کیفیت WebP. ۸۲ برای عکس محتوایی، مرز عملی بین حجم و کیفیت. */
const QUALITY = 82;

const args = new Set(process.argv.slice(2));
const DELETE_UNUSED = args.has("--delete-unused");

function walk(dir, test) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      // پوشه‌های زیرخط‌دار بایگانی‌اند و نباید دست بخورند.
      return e.name.startsWith("_") ? [] : walk(p, test);
    }
    return test(e.name) ? [p] : [];
  });
}

const isRaster = (n) => /\.(jpe?g|png)$/i.test(n);
const isCode = (n) => /\.(ts|tsx|css|json|md)$/i.test(n);

function webPath(file) {
  return "/" + path.relative(ROOT, file).split(path.sep).join("/");
}

async function main() {
  const unusedFile = "unused-images.tmp.json";
  const unused = new Set(
    fs.existsSync(unusedFile) ? JSON.parse(fs.readFileSync(unusedFile, "utf8")) : [],
  );

  /* ------------------------- حذف بلااستفاده‌ها ------------------------- */
  let freed = 0;
  if (DELETE_UNUSED && unused.size > 0) {
    for (const f of unused) {
      if (fs.existsSync(f)) {
        freed += fs.statSync(f).size;
        fs.unlinkSync(f);
      }
    }
    console.log(`✓ ${unused.size} تصویر بلااستفاده حذف شد (${(freed / 1048576).toFixed(2)} MB)`);
  }

  /* --------------------------- تبدیل به WebP --------------------------- */
  const files = walk(ROOT, isRaster).filter((f) => !unused.has(f));
  const rename = new Map();
  let before = 0;
  let after = 0;
  let skipped = 0;

  for (const file of files) {
    const base = path.basename(file);
    if (KEEP_FORMAT.some((re) => re.test(base))) {
      skipped++;
      continue;
    }

    const srcSize = fs.statSync(file).size;
    const out = file.replace(/\.(jpe?g|png)$/i, ".webp");

    const img = sharp(file);
    const meta = await img.metadata();

    await img
      // شفافیت باید حفظ شود؛ لوگوهای mono دقیقاً به همین وابسته‌اند.
      .webp({ quality: QUALITY, effort: 5, alphaQuality: 100 })
      .toFile(out);

    const outSize = fs.statSync(out).size;

    // اگر WebP بزرگ‌تر درآمد (برای PNG کوچکِ ساده پیش می‌آید) اصل را نگه دار.
    if (outSize >= srcSize) {
      fs.unlinkSync(out);
      skipped++;
      continue;
    }

    fs.unlinkSync(file);
    rename.set(webPath(file), webPath(out));
    before += srcSize;
    after += outSize;
    void meta;
  }

  /* ------------------------ به‌روزرسانی ارجاع‌ها ------------------------ */
  const codeFiles = walk("src", isCode).filter((f) => !f.includes("generated"));
  let touched = 0;
  for (const cf of codeFiles) {
    let s = fs.readFileSync(cf, "utf8");
    const orig = s;
    for (const [from, to] of rename) s = s.split(from).join(to);
    if (s !== orig) {
      fs.writeFileSync(cf, s);
      touched++;
    }
  }

  console.log(`✓ ${rename.size} تصویر به WebP تبدیل شد`);
  console.log(`  ${(before / 1048576).toFixed(2)} MB → ${(after / 1048576).toFixed(2)} MB` +
    `  (${Math.round((1 - after / before) * 100)}٪ کمتر)`);
  console.log(`  ${touched} فایل کد به‌روز شد | ${skipped} فایل عمداً دست‌نخورده`);

  if (rename.size) {
    fs.writeFileSync("image-rename-map.tmp.json", JSON.stringify([...rename], null, 2));
    console.log("\n⚠ مسیرهای دیتابیس جدا به‌روز می‌شوند — نگاشت در image-rename-map.tmp.json");
  }
}

main().catch((e) => {
  console.error("خطا:", e.message);
  process.exit(1);
});
