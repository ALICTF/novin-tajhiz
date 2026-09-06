import { NextResponse, type NextRequest } from "next/server";

/**
 * جلوگیری از باز شدن صفحه‌های پنل بدون کوکی نشست.
 *
 * این فقط لایه اول است و عمداً امضای کوکی را بررسی نمی‌کند: middleware روی
 * ران‌تایم Edge اجرا می‌شود و به node:crypto دسترسی ندارد. اعتبارسنجی واقعی
 * امضا در requireAdmin() سمت سرور انجام می‌شود که هم layout پنل و هم تک‌تک
 * Server Action ها صدایش می‌زنند. کار اینجا فقط این است که کاربر بدون کوکی را
 * زودتر به صفحه ورود بفرستد تا بی‌خود صفحه رندر نشود.
 */

const COOKIE_NAME = "novin_admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasCookie = Boolean(request.cookies.get(COOKIE_NAME)?.value);

  if (pathname === "/admin/login") {
    if (hasCookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!hasCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
