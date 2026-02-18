"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl, IMAGE_PRESETS } from "@/lib/image";

interface ProductGalleryProps {
  imageUrl: string;
  productName: string;
}

export function ProductGallery({ imageUrl, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = imageUrl ? [imageUrl] : [];

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-md bg-muted">
        <Package className="h-24 w-24 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-md border border-border">
        <img
          src={getOptimizedImageUrl(images[selectedIndex], IMAGE_PRESETS.gallery)}
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
                  ? "border-foreground"
                  : "border-transparent hover:border-border"
              )}
            >
              <img
                src={getOptimizedImageUrl(img, IMAGE_PRESETS.thumbnail)}
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
