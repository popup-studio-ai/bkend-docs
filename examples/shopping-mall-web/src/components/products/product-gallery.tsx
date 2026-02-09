"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  imageUrl: string;
  productName: string;
}

export function ProductGallery({ imageUrl, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = imageUrl ? [imageUrl] : [];

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
        <Package className="h-24 w-24 text-slate-300 dark:text-slate-600" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
        <img
          src={images[selectedIndex]}
          alt={productName}
          className="aspect-square w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "h-16 w-16 overflow-hidden rounded-md border-2 transition-colors",
                selectedIndex === index
                  ? "border-slate-900 dark:border-slate-50"
                  : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
              )}
            >
              <img
                src={img}
                alt={`${productName} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
