"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * مقدار را در localStorage نگه می‌دارد و بین تب‌های باز هم‌گام می‌کند.
 *
 * رندر اول همیشه `initialValue` را برمی‌گرداند تا خروجی سرور و کلاینت یکسان
 * بماند (جلوگیری از hydration mismatch)؛ مقدار ذخیره‌شده در افکت اول خوانده
 * می‌شود. `hydrated` می‌گوید آیا این خواندن انجام شده یا نه.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // خواندن ممکن است در حالت ناشناس یا با مسدود بودن ذخیره‌سازی خطا بدهد.
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // فضای ذخیره‌سازی پر یا مسدود است — بی‌صدا رد می‌شویم.
    }
  }, [key, value, hydrated]);

  // هم‌گام‌سازی بین تب‌ها
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        setValue(JSON.parse(e.newValue) as T);
      } catch {
        /* مقدار نامعتبر را نادیده می‌گیریم */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return { value, setValue, hydrated, reset } as const;
}
