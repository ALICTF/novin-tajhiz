#!/bin/sh
set -eu

# ---------------------------------------------------------------------------
# پشتیبان‌گیری خودکار.
#
# هر اجرا یک نسخه از دیتابیس و یک نسخه از فایل‌های آپلودی می‌گیرد و نسخه‌های
# قدیمی‌تر از BACKUP_RETENTION_DAYS را پاک می‌کند.
#
# دو تصمیم که ارزش دانستن دارند:
#
#  • دیتابیس با فرمت custom (-Fc) گرفته می‌شود، نه SQL ساده. حجمش کمتر است و
#    مهم‌تر اینکه pg_restore می‌تواند از آن به‌صورت انتخابی بازیابی کند —
#    مثلاً فقط یک جدول.
#
#  • فایل موقت اول ساخته می‌شود و بعد به نام نهایی تغییر نام می‌دهد. اگر
#    وسط کار برق برود یا کانتینر بمیرد، یک فایل نیمه‌کاره با نام معتبر باقی
#    نمی‌ماند که بعداً به اشتباه به آن اعتماد شود.
# ---------------------------------------------------------------------------

BACKUP_DIR="${BACKUP_DIR:-/backups}"
UPLOADS_DIR="${UPLOADS_DIR:-/uploads}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
STAMP="$(date +%Y-%m-%d_%H%M)"

mkdir -p "$BACKUP_DIR/db" "$BACKUP_DIR/uploads"

log() {
  echo "[backup $(date '+%Y-%m-%d %H:%M:%S')] $*"
}

# ------------------------------- دیتابیس -------------------------------
DB_FILE="$BACKUP_DIR/db/novintajhiz-$STAMP.dump"

log "شروع پشتیبان‌گیری دیتابیس"
if pg_dump --format=custom --compress=6 --file="$DB_FILE.tmp" "$DATABASE_URL"; then
  mv "$DB_FILE.tmp" "$DB_FILE"
  log "دیتابیس ذخیره شد: $(basename "$DB_FILE") ($(du -h "$DB_FILE" | cut -f1))"
else
  rm -f "$DB_FILE.tmp"
  log "خطا: پشتیبان‌گیری دیتابیس ناموفق بود"
  exit 1
fi

# ------------------------------ آپلودها ------------------------------
# اگر هنوز چیزی آپلود نشده باشد، پوشه خالی است و آرشیو ساخته نمی‌شود.
if [ -d "$UPLOADS_DIR" ] && [ -n "$(ls -A "$UPLOADS_DIR" 2>/dev/null || true)" ]; then
  UP_FILE="$BACKUP_DIR/uploads/uploads-$STAMP.tar.gz"
  log "شروع پشتیبان‌گیری فایل‌های آپلودی"
  if tar czf "$UP_FILE.tmp" -C "$UPLOADS_DIR" .; then
    mv "$UP_FILE.tmp" "$UP_FILE"
    log "آپلودها ذخیره شدند: $(basename "$UP_FILE") ($(du -h "$UP_FILE" | cut -f1))"
  else
    rm -f "$UP_FILE.tmp"
    log "هشدار: پشتیبان‌گیری آپلودها ناموفق بود"
  fi
else
  log "پوشه آپلود خالی است؛ رد شد"
fi

# ------------------------------ پاک‌سازی ------------------------------
DELETED=$(find "$BACKUP_DIR" -type f \( -name "*.dump" -o -name "*.tar.gz" \) \
  -mtime "+$RETENTION_DAYS" -print -delete | wc -l)
log "نسخه‌های قدیمی‌تر از $RETENTION_DAYS روز حذف شدند: $DELETED فایل"

log "پایان"
