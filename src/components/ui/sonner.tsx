"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      dir="rtl"
      position="bottom-left"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast font-[inherit] rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl",
          description: "text-slate-500",
          actionButton: "bg-slate-900 text-white",
          cancelButton: "bg-slate-100 text-slate-600",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
