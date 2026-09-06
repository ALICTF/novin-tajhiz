"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { discountPercent, toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  alt,
  price,
  oldPrice,
}: {
  images: string[];
  alt: string;
  price: number | null;
  oldPrice?: number | null;
}) {
  const [selected, setSelected] = React.useState(0);
  const off = discountPercent(price, oldPrice);

  return (
    <div className="space-y-6">
      <div className="group relative aspect-square w-full overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-sm">
        <Image
          src={images[selected]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-contain p-12 mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
        />
        {off && (
          <div className="absolute top-6 left-6 z-10">
            <Badge className="border-none bg-rose-500 px-3 py-1 text-sm font-bold text-white shadow-md hover:bg-rose-600">
              {toPersianDigits(off)}٪ تخفیف ویژه
            </Badge>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={img}
              type="button"
              aria-label={`نمایش تصویر ${toPersianDigits(idx + 1)}`}
              aria-pressed={selected === idx}
              onClick={() => setSelected(idx)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300",
                selected === idx
                  ? "scale-95 border-primary ring-4 ring-primary/10"
                  : "border-slate-100 hover:border-slate-300 hover:shadow-md",
              )}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="120px"
                className="object-contain p-2 mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
