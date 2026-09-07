import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

/**
 * یکدست‌سازی تصاویر محصولات.
 *
 * مشکلی که حل می‌کند: کارت محصول `aspect-square` با `object-contain` است، ولی
 * نسبت ابعاد تصاویر بین ۰.۴۶ تا ۲.۸۵ متغیر بود. مرورگر هر تصویر را طوری
 * می‌چیند که *بلندترین ضلعش* کادر را پر کند؛ نتیجه‌اش این است که تصویر مربعی
 * کل کادر را می‌گیرد ولی تصویر پهن فقط یک‌سوم ارتفاع را — و محصول «ریز» دیده
 * می‌شود.
 *
 * راه‌حل: بوم مربعی یکسان، پس‌زمینه سفید، و مهم‌تر از همه نرمال‌سازی بر اساس
 * *مساحت* نه بلندترین ضلع. با این کار تصویر مربعی کمی کوچک و تصویر پهن نسبتاً
 * بزرگ‌تر می‌شود، و سطحی که چشم می‌بیند بین همه یکسان می‌ماند.
 *
 * چیزی که این اسکریپت نمی‌تواند انجام دهد: حذف پس‌زمینه عکس‌هایی که روی میز و
 * پارچه گرفته شده‌اند. آن کار مدل تفکیک تصویر می‌خواهد. حاشیه دور عکس سفید
 * می‌شود ولی خود عکس دست‌نخورده می‌ماند.
 *
 * اجرا:  node scripts/normalize-product-images.mjs [--watermark] [--apply]
 *   بدون --apply فقط در پوشه _normalized می‌نویسد و اصل فایل‌ها دست‌نخورده
 *   می‌ماند.
 */

const SRC = "public/images/products";
const OUT = "public/images/products/_normalized";
const LOGO = "public/images/logo.png";

/** اندازه بوم نهایی. ۱۲۰۰ برای نمایش دو برابری روی صفحه‌های رتینا کافی است. */
const CANVAS = 1200;

/**
 * سهم هدف تصویر از مساحت بوم.
 *
 * ۰.۵۲ بعد از آزمون‌وخطا انتخاب شد: پایین‌تر از آن محصول‌ها گم می‌شوند و
 * بالاتر از آن، تصویرهای مربعی دوباره کادر را پر می‌کنند و همان بی‌نظمی
 * اولیه برمی‌گردد.
 */
const TARGET_AREA = 0.52;

/** هیچ تصویری نباید بیشتر از این نسبت از عرض یا ارتفاع بوم را بگیرد. */
const MAX_EXTENT = 0.92;

const args = new Set(process.argv.slice(2));
const WATERMARK = args.has("--watermark");
const APPLY = args.has("--apply");

/** ابعاد نهایی تصویر داخل بوم، با نرمال‌سازی مساحت. */
function fitByArea(width, height) {
  const ar = width / height;
  const canvasArea = CANVAS * CANVAS;

  // مساحت هدف → عرض و ارتفاع متناظر با همان نسبت ابعاد
  let w = Math.sqrt(TARGET_AREA * canvasArea * ar);
  let h = w / ar;

  // اگر از سقف مجاز گذشت، به همان نسبت کوچک می‌شود
  const cap = CANVAS * MAX_EXTENT;
  const over = Math.max(w / cap, h / cap, 1);
  w /= over;
  h /= over;

  return { w: Math.round(w), h: Math.round(h) };
}

async function main() {
  if (!fs.existsSync(SRC)) throw new Error(`پوشه ${SRC} پیدا نشد.`);
  fs.mkdirSync(OUT, { recursive: true });

  const files = fs
    .readdirSync(SRC)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  // لوگو یک‌بار آماده می‌شود، نه به ازای هر تصویر.
  let logo = null;
  if (WATERMARK) {
    logo = await sharp(LOGO)
      .resize({ width: Math.round(CANVAS * 0.16) })
      // شفافیت پایین: نشان مالکیت باشد، نه اینکه جلوی دیدن محصول را بگیرد.
      .composite([
        {
          input: Buffer.from([255, 255, 255, Math.round(255 * 0.42)]),
          raw: { width: 1, height: 1, channels: 4 },
          tile: true,
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer();
  }

  const report = [];

  for (const file of files) {
    const src = path.join(SRC, file);
    const meta = await sharp(src).metadata();
    const { w, h } = fitByArea(meta.width, meta.height);

    const inner = await sharp(src)
      .resize(w, h, { fit: "fill", kernel: "lanczos3" })
      .toBuffer();

    const layers = [{ input: inner, gravity: "center" }];
    if (logo) {
      layers.push({
        input: logo,
        gravity: "southwest",
        top: undefined,
        left: undefined,
      });
    }

    const outName = file.replace(/\.(jpe?g|png|webp)$/i, ".webp");
    await sharp({
      create: {
        width: CANVAS,
        height: CANVAS,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    })
      .composite(layers)
      .webp({ quality: 86, effort: 5 })
      .toFile(path.join(OUT, outName));

    report.push({
      file,
      از: `${meta.width}×${meta.height}`,
      نسبت: +(meta.width / meta.height).toFixed(2),
      به: `${w}×${h} در بوم ${CANVAS}`,
      کیفیت_پایین: Math.min(meta.width, meta.height) < 300,
    });
  }

  const low = report.filter((r) => r.کیفیت_پایین);
  console.log(`✓ ${report.length} تصویر نرمال شد → ${OUT}`);
  console.log(`  بوم ${CANVAS}×${CANVAS} | واترمارک: ${WATERMARK ? "دارد" : "ندارد"}`);
  if (low.length) {
    console.log(`\n⚠ ${low.length} تصویر منبعِ کم‌کیفیت دارند و بزرگ کردنشان کیفیت نمی‌سازد:`);
    low.forEach((r) => console.log(`   ${r.file}  (${r.از})`));
  }

  if (APPLY) {
    console.log("\n--apply داده شد؛ برای جایگزینی از اسکریپت جداگانه استفاده کنید.");
  }
}

main().catch((e) => {
  console.error("خطا:", e.message);
  process.exit(1);
});
