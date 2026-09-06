import { NextResponse } from "next/server";
import { getTorobPage, getTorobSingle } from "@/lib/torob/feed";

/**
 * فید محصولات برای ترب.
 *
 * مسیر مطابق مستندات ترب است: آخرین بخش آدرس باید `products` باشد، یعنی
 * `https://novintajhiz.org/api/torob/products`.
 *
 * ترب پارامترها را به‌صورت form-data و با متد POST می‌فرستد. GET و JSON هم
 * پشتیبانی می‌شوند تا بشود فید را با مرورگر یا curl هم بررسی کرد؛ ترب از آن‌ها
 * استفاده نمی‌کند ولی برای عیب‌یابی لازم است.
 *
 * احراز هویت ندارد و نباید داشته باشد: خزنده ترب هیچ کلیدی نمی‌فرستد. داده‌ای
 * هم که برمی‌گردد همان کاتالوگ عمومی سایت است.
 */

export const dynamic = "force-dynamic";

type Params = { page?: string; page_unique?: string; page_url?: string };

async function readParams(request: Request): Promise<Params> {
  const url = new URL(request.url);
  const fromQuery: Params = {
    page: url.searchParams.get("page") ?? undefined,
    page_unique: url.searchParams.get("page_unique") ?? undefined,
    page_url: url.searchParams.get("page_url") ?? undefined,
  };

  if (request.method !== "POST") return fromQuery;

  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as Params;
      return { ...fromQuery, ...body };
    }

    // حالت اصلی ترب: form-data یا urlencoded
    const form = await request.formData();
    return {
      page: (form.get("page") as string | null) ?? fromQuery.page,
      page_unique: (form.get("page_unique") as string | null) ?? fromQuery.page_unique,
      page_url: (form.get("page_url") as string | null) ?? fromQuery.page_url,
    };
  } catch {
    // بدنه خالی یا نامعتبر — همان پارامترهای کوئری ملاک است.
    return fromQuery;
  }
}

async function handle(request: Request) {
  const params = await readParams(request);

  /*
    اگر شناسه یا لینک محصول آمده باشد، خروجی همان یک محصول است — ولی طبق
    مستندات باز هم باید داخل آرایه products باشد، نه یک شیء تنها.
  */
  const feed =
    params.page_unique || params.page_url
      ? await getTorobSingle({
          pageUnique: params.page_unique?.trim(),
          pageUrl: params.page_url?.trim(),
        })
      : await getTorobPage(Number(params.page ?? 1));

  return NextResponse.json(feed, {
    headers: { "cache-control": "no-store" },
  });
}

export async function POST(request: Request) {
  return handle(request);
}

export async function GET(request: Request) {
  return handle(request);
}
