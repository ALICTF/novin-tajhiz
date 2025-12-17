import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-12">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48 rounded-xl" />
                <Skeleton className="h-4 w-32 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-full md:w-96 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:block lg:col-span-1 space-y-6">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
            </div>

            {/* Products Grid Skeleton */}
            <div className="lg:col-span-3">
                {/* Toolbar */}
                <Skeleton className="h-16 w-full rounded-2xl mb-6" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* تکرار ۸ کارت خالی */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl border border-slate-200 p-4 space-y-4">
                            <Skeleton className="aspect-square w-full rounded-2xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-1/3 rounded-full" />
                                <Skeleton className="h-5 w-3/4 rounded-lg" />
                            </div>
                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                <Skeleton className="h-6 w-24 rounded-lg" />
                                <Skeleton className="h-10 w-10 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}