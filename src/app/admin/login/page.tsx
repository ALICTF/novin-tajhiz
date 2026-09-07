import Image from "next/image";
import { redirect } from "next/navigation";
import { isSignedIn } from "@/lib/admin/auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  // اگر نشست معتبر دارد، دلیلی ندارد دوباره فرم ورود ببیند.
  if (await isSignedIn()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      {/* همان زبان بصری هیروی سایت: زمینه تیره با هاله‌های ملایم. عمداً
          radial-gradient است نه blur، چون blur روی سطح بزرگ گران است. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(circle 420px at 50% 0, rgba(37,99,235,.22), transparent)",
            "radial-gradient(circle 380px at 15% 100%, rgba(14,116,144,.18), transparent)",
          ].join(", "),
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Image
            src="/images/logo.webp"
            alt="نوین تجهیز"
            width={64}
            height={64}
            priority
            className="h-14 w-auto object-contain brightness-0 invert"
          />
          <div>
            <h1 className="text-xl font-bold text-white">پنل مدیریت</h1>
            <p className="mt-1.5 text-sm text-white/50">
              برای ادامه رمز عبور را وارد کنید
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-white/35">
          نوین تجهیز — مرجع تخصصی پلی‌سومنوگرافی
        </p>
      </div>
    </main>
  );
}
