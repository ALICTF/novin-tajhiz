import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ProductDetailLoading() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Breadcrumb */}
        <Skeleton className="h-4 w-64 rounded-full mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Gallery Skeleton */}
            <div className="lg:col-span-7 space-y-6">
                <Skeleton className="aspect-square w-full rounded-[40px]" />
                <div className="grid grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => (
                        <Skeleton key={i} className="aspect-square rounded-2xl" />
                    ))}
                </div>
            </div>

            {/* Right: Info Skeleton */}
            <div className="lg:col-span-5 space-y-8">
                
                {/* Title & Meta */}
                <div className="space-y-4 pb-8 border-b border-slate-200">
                    <div className="flex justify-between">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <Skeleton className="h-10 w-2/3 rounded-xl" />
                    <Skeleton className="h-6 w-32 rounded-lg" />
                </div>

                {/* Price Box */}
                <Skeleton className="h-48 w-full rounded-3xl" />

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {[1,2,3,4].map(i => (
                        <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                    ))}
                </div>

                {/* Contact Box */}
                <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
        </div>
      </div>
    </div>
  );
}