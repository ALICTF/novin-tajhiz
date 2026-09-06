"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { trackOrderAction, type TrackState } from "./actions";

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus:border-primary focus:bg-white focus:outline-none";

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
        <ArrowLeft size={18} />
      )}
      مشاهده سفارش
    </button>
  );
}

export function TrackForm() {
  const [state, formAction] = useActionState<TrackState, FormData>(
    trackOrderAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-700">کد پیگیری</span>
        <input
          name="reference"
          required
          autoFocus
          dir="ltr"
          placeholder="NT-2609-12345"
          className={`${inputClass} text-left tabular-nums`}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-700">شماره موبایل</span>
        <input
          name="phone"
          required
          dir="ltr"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="09151234567"
          className={`${inputClass} text-left tabular-nums`}
        />
      </label>

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700"
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
