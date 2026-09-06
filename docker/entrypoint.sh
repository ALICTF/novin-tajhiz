#!/bin/sh
set -e

# ---------------------------------------------------------------------------
# راه‌اندازی کانتینر.
#
# ترتیب کارها مهم است: تا وقتی دیتابیس بالا نیامده، مهاجرت شکست می‌خورد؛ و تا
# وقتی مهاجرت اجرا نشده، اپ روی جدول‌های ناموجود کوئری می‌زند. پس اول صبر،
# بعد مهاجرت، بعد اجرای سرور.
# ---------------------------------------------------------------------------

if [ -z "$DATABASE_URL" ]; then
  echo "خطا: متغیر DATABASE_URL تنظیم نشده است." >&2
  exit 1
fi

echo "→ در انتظار دیتابیس..."
ATTEMPTS=0
until node -e "
  const { Client } = require('pg');
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  c.connect().then(() => c.end()).then(() => process.exit(0)).catch(() => process.exit(1));
" 2>/dev/null; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge 30 ]; then
    echo "خطا: دیتابیس بعد از ۶۰ ثانیه در دسترس نیست." >&2
    exit 1
  fi
  sleep 2
done
echo "  دیتابیس آماده است."

echo "→ اجرای مهاجرت‌ها..."
npx prisma migrate deploy

# اولین بالا آمدن: اگر جدول محصولات خالی باشد، کاتالوگ اولیه وارد می‌شود.
# دفعات بعد این بخش رد می‌شود و داده‌های ادمین دست نمی‌خورند.
if [ "$SEED_ON_START" != "false" ]; then
  COUNT=$(node -e "
    const { Client } = require('pg');
    const c = new Client({ connectionString: process.env.DATABASE_URL });
    c.connect()
      .then(() => c.query('SELECT COUNT(*)::int AS n FROM \"Product\"'))
      .then(r => { console.log(r.rows[0].n); return c.end(); })
      .catch(() => { console.log('0'); process.exit(0); });
  " 2>/dev/null || echo 0)

  if [ "$COUNT" = "0" ]; then
    echo "→ کاتالوگ خالی است؛ داده اولیه وارد می‌شود..."
    npx tsx prisma/seed.ts
  else
    echo "  کاتالوگ از قبل $COUNT محصول دارد؛ seed رد شد."
  fi
fi

echo "→ اجرای سرور روی پورت ${PORT:-3000}"
exec "$@"
