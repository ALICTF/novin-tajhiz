import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesLoading() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Hero Skeleton */}
      <div className="bg-slate-900 py-20 h-[500px] relative overflow-hidden flex items-center">
        <div className="container mx-auto px-4">
            <div className="flex gap-12">
                <div className="flex-1 space-y-6">
                    <Skeleton className="h-8 w-40 bg-slate-800 rounded-full" />
                    <Skeleton className="h-16 w-3/4 bg-slate-800 rounded-2xl" />
                    <Skeleton className="h-4 w-1/2 bg-slate-800 rounded-lg" />
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-32 bg-slate-800 rounded-full" />
                        <Skeleton className="h-10 w-32 bg-slate-800 rounded-full" />
                    </div>
                </div>
                <div className="hidden md:block flex-1">
                    <Skeleton className="w-full aspect-square rounded-full bg-slate-800" />
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-7xl">
         {/* Services Grid Skeleton */}
         <div className="grid grid-cols-4 gap-6 mb-16">
            {[1,2,3,4].map(i => (
                <Skeleton key={i} className="h-40 rounded-3xl" />
            ))}
         </div>

         {/* Form Skeleton */}
         <Skeleton className="h-[600px] w-full rounded-[40px]" />
      </div>
    </div>
  );
}