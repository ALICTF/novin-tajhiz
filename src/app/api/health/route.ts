import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

/**
 * بررسی سلامت سرویس — برای healthcheck داکر و مانیتورینگ هاست.
 * فقط بالا بودن پروسه کافی نیست؛ اتصال دیتابیس هم بررسی می‌شود، وگرنه
 * کانتینری که دیتابیسش قطع است «سالم» گزارش می‌شد.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "up" });
  } catch {
    return NextResponse.json(
      { status: "error", database: "down" },
      { status: 503 },
    );
  }
}
