# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# ایمیج تولیدی نوین تجهیز.
#
# چند مرحله‌ای است تا ابزارهای build (کامپایلر تایپ‌اسکریپت، کش وبپک،
# devDependencies) داخل ایمیج نهایی نمانند. ایمیج نهایی فقط خروجی standalone
# نکست، فایل‌های استاتیک و کلاینت پریزما را دارد.
# ---------------------------------------------------------------------------

FROM node:22-alpine AS base
# پریزما روی alpine به کتابخانه سازگاری OpenSSL نیاز دارد.
RUN apk add --no-cache libc6-compat
WORKDIR /app


# --------------------------- ۱. وابستگی‌ها ---------------------------
FROM base AS deps
COPY package.json package-lock.json ./
# اسکیما قبل از نصب کپی می‌شود چون postinstall پروژه `prisma generate` است و
# بدون اسکیما شکست می‌خورد.
COPY prisma ./prisma
COPY prisma.config.ts ./
# npm ci دقیقاً از روی lock نصب می‌کند و نتیجه بین ماشین‌ها یکسان است.
RUN npm ci


# ------------------------------ ۲. build ------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# کلاینت پریزما باید قبل از build ساخته شود، چون کد اپ از آن import می‌کند.
RUN npx prisma generate

# نکست در زمان build صفحه‌های استاتیک را می‌سازد و برای همین به دیتابیس وصل
# می‌شود. اینجا دیتابیسی در دسترس نیست، پس تولید استاتیک کنار گذاشته می‌شود و
# صفحه‌ها در اولین بازدید روی سرور ساخته و بعد کش می‌شوند.
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=1
RUN npm run build


# ------------------------------ ۳. اجرا ------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# کانتینر به‌صورت پیش‌فرض UTC است. تاریخ‌های نمایشی خودشان با Asia/Tehran
# قالب‌بندی می‌شوند، ولی محاسبات بازه‌ای (مثل «۱۴ روز گذشته» در داشبورد) از
# ساعت محلی سرور شروع می‌کنند و باید با ساعت کسب‌وکار بخواند.
ENV TZ=Asia/Tehran
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV UPLOAD_DIR=/app/uploads

# اجرا با کاربر غیر root — اگر روزی کدی روی سرور اجرا شود، دسترسی root ندارد.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# خروجی standalone: سرور کمینه به‌همراه فقط همان بخشی از node_modules که
# واقعاً استفاده می‌شود.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# ابزار مهاجرت و اسکیما، تا entrypoint بتواند migrate deploy بزند.
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder /app/node_modules/esbuild ./node_modules/esbuild
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
# tsx مسیرهای «@/...» را از روی tsconfig حل می‌کند؛ بدون این فایل seed
# نمی‌تواند ماژول‌ها را پیدا کند.
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/src/lib/data ./src/lib/data
COPY --from=builder /app/src/lib/icon-map.ts ./src/lib/icon-map.ts
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated

COPY --chmod=755 docker/entrypoint.sh ./entrypoint.sh

# آپلودها باید روی volume سوار شوند، وگرنه با هر استقرار پاک می‌شوند.
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads
VOLUME ["/app/uploads"]

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server.js"]
