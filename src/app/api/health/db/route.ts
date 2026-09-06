import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

/**
 * بررسی آمادگی کامل (readiness) — شامل اتصال دیتابیس.
 *
 * برای داشبورد مانیتورینگ و بررسی دستی بعد از استقرار. عمداً مبنای ری‌استارت
 * کانتینر نیست؛ دلیلش در /api/health توضیح داده شده.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      database: "up",
      latencyMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("[health] اتصال دیتابیس ناموفق:", error);
    return NextResponse.json(
      { status: "error", database: "down" },
      { status: 503 },
    );
  }
}
