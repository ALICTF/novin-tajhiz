# راهنمای استقرار — نوین تجهیز

## استک

| لایه | انتخاب | چرا |
|---|---|---|
| اپ | Next.js 15 (App Router) | همان فرانت‌اند موجود؛ سرور و کلاینت یکجا |
| دیتابیس | PostgreSQL 17 | چند اتصال هم‌زمان، داده ماندگار، پشتیبانی همه هاست‌های ایرانی |
| ORM | Prisma 7 با آداپتور `pg` | مهاجرت نسخه‌دار، تایپ‌سیف |
| فایل‌ها | دیسک محلی یا S3-سازگار | با یک متغیر محیطی عوض می‌شود |
| اجرا | Docker چندمرحله‌ای، خروجی standalone | ایمیج کوچک، بدون ابزار build |

---

## ۱. اجرای محلی

```bash
cp .env.example .env      # مقادیر را پر کنید
docker compose up -d db   # فقط دیتابیس
npx prisma migrate deploy
npx tsx prisma/seed.ts    # کاتالوگ اولیه
npm run dev
```

سایت روی `http://localhost:3000` و پنل روی `http://localhost:3000/admin`.

---

## ۲. استقرار روی سرور اختصاصی (پارس‌پک)

سرور باید Docker و Docker Compose داشته باشد.

```bash
git clone <آدرس مخزن> && cd novin-tajhiz-main
cp .env.example .env
```

در `.env` این‌ها را حتماً عوض کنید:

```dotenv
POSTGRES_PASSWORD=یک-رمز-قوی
ADMIN_PASSWORD=رمز-ورود-پنل
ADMIN_SESSION_SECRET=یک-رشته-تصادفی-حداقل-۳۲-نویسه
```

برای ساخت کلید تصادفی:

```bash
openssl rand -hex 32
```

سپس:

```bash
docker compose up -d --build
```

همین. `entrypoint` خودش منتظر دیتابیس می‌ماند، مهاجرت‌ها را اجرا می‌کند و اگر
کاتالوگ خالی باشد داده اولیه را وارد می‌کند.

بررسی سلامت:

```bash
curl http://localhost:3000/api/health     # {"status":"ok","database":"up"}
docker compose logs -f app
```

### پشت nginx

```nginx
server {
    listen 80;
    server_name novintajhiz.org www.novintajhiz.org;

    client_max_body_size 6m;   # آپلود تصویر تا ۵ مگابایت

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

بعد از افزودن SSL (مثلاً با certbot)، کوکی نشست پنل خودکار `Secure` می‌شود
چون `NODE_ENV=production` است.

### پشتیبان‌گیری

```bash
# دیتابیس
docker compose exec db pg_dump -U novin novintajhiz > backup-$(date +%F).sql

# فایل‌های آپلودی
docker run --rm -v novin-tajhiz-main_uploads:/data -v $(pwd):/backup alpine \
  tar czf /backup/uploads-$(date +%F).tar.gz -C /data .
```

---

## ۳. استقرار روی لیارا

لیارا فایل‌سیستم ماندگار ندارد؛ پس **دو نکته حیاتی**:

1. دیتابیس را از خود لیارا بگیرید (سرویس PostgreSQL) و `DATABASE_URL` را در
   متغیرهای محیطی برنامه ست کنید.
2. برای آپلودها **حتماً** فضای ابری لیارا (S3-سازگار) را وصل کنید، وگرنه هر
   تصویری که آپلود می‌کنید با استقرار بعدی پاک می‌شود.

`liara.json`:

```json
{
  "platform": "docker",
  "port": 3000,
  "healthCheck": { "command": "curl -f http://localhost:3000/api/health" }
}
```

متغیرهای محیطی در پنل لیارا:

```
DATABASE_URL=postgresql://...        # از سرویس دیتابیس لیارا
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
S3_ENDPOINT=https://storage.iran.liara.space
S3_BUCKET=novin-uploads
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_PUBLIC_URL=https://novin-uploads.storage.iran.liara.space
```

سپس:

```bash
liara deploy
```

---

## ۴. متغیرهای محیطی

| متغیر | الزامی | توضیح |
|---|---|---|
| `DATABASE_URL` | بله | رشته اتصال PostgreSQL |
| `ADMIN_PASSWORD` | بله | رمز ورود پنل |
| `ADMIN_SESSION_SECRET` | بله | کلید امضای کوکی، حداقل ۱۶ نویسه |
| `UPLOAD_DIR` | خیر | مسیر آپلود روی دیسک (پیش‌فرض `./uploads`) |
| `S3_ENDPOINT` | خیر | اگر پر باشد آپلودها به فضای ابری می‌روند |
| `S3_BUCKET` | خیر | نام باکت |
| `S3_REGION` | خیر | پیش‌فرض `us-east-1` |
| `S3_ACCESS_KEY` | خیر | کلید دسترسی |
| `S3_SECRET_KEY` | خیر | کلید مخفی |
| `S3_PUBLIC_URL` | خیر | دامنه عمومی باکت |
| `SEED_ON_START` | خیر | `false` بگذارید تا داده اولیه هرگز وارد نشود |

---

## ۵. معماری کش

سایت عمومی از دیتابیس می‌خواند، ولی در حالت عادی هیچ بازدیدی به دیتابیس
نمی‌رسد:

```
بازدیدکننده → کش صفحه نکست → unstable_cache (برچسب‌دار) → PostgreSQL
                                        ▲
                          ادمین ذخیره می‌کند → revalidateTag
```

هر کوئری عمومی در `src/lib/db/public.ts` با یک برچسب کش شده است. اکشن‌های پنل
بعد از هر نوشتن، `src/lib/db/tags.ts` را صدا می‌زنند و همان برچسب باطل می‌شود.
نتیجه: سرعت صفحه استاتیک، ولی به‌روزرسانی آنی بعد از ویرایش — بدون build دوباره.

`revalidate = 3600` روی صفحه‌ها فقط تور ایمنی است، برای حالتی که ایمیج بدون
دسترسی به دیتابیس ساخته شده باشد.

---

## ۶. به‌روزرسانی نسخه

```bash
git pull
docker compose up -d --build
```

مهاجرت‌های جدید خودکار اجرا می‌شوند. داده‌ها روی volume می‌مانند و دست نمی‌خورند.

برای بازگشت به نسخه قبل، ایمیج قبلی را اجرا کنید — ولی توجه کنید مهاجرت‌های
اجراشده برگشت‌پذیر نیستند مگر با `prisma migrate resolve`.
