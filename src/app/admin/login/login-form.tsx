"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, KeyRound, Loader2 } from "lucide-react";
import { signInAction, type LoginState } from "@/app/admin/actions";

/**
 * فرم ورود.
 *
 * عمداً بدون react-hook-form و zod نوشته شده — یک فیلد رمز، و اعتبارسنجی
 * واقعی هرحال باید سمت سرور انجام شود. useActionState خطای برگشتی از
 * Server Action را بدون هیچ state دستی مدیریت می‌کند.
 */

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
    >
      {pending ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <KeyRound size={18} />
      )}
      ورود به پنل
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(
    signInAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-xs font-medium text-white/70">
          رمز عبور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          dir="ltr"
          aria-invalid={!!state.error}
          aria-describedby={state.error ? "login-error" : undefined}
          className="h-12 rounded-xl border border-white/15 bg-white/10 px-4 text-left text-sm text-white placeholder:text-white/30 focus:border-primary focus:bg-white/15 focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <p
          id="login-error"
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-rose-500/15 px-3 py-2.5 text-xs leading-relaxed font-medium text-rose-200"
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
