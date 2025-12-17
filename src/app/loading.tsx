import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* لوگو یا آیکون برند */}
        <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        </div>
        <p className="text-sm font-bold text-slate-500 animate-pulse">نوین تجهیز...</p>
      </div>
    </div>
  );
}