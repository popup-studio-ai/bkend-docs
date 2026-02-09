"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceDisplay({
  price,
  originalPrice,
  size = "md",
  className,
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      {originalPrice && originalPrice > price && (
        <span className="text-sm text-slate-400 line-through dark:text-slate-500">
          {formatPrice(originalPrice)}
        </span>
      )}
      <span
        className={cn(
          "font-bold text-amber-700 dark:text-amber-400",
          sizeClasses[size]
        )}
      >
        {formatPrice(price)}
      </span>
      {discountPercent && (
        <span className="rounded-sm bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-600 dark:bg-red-900/50 dark:text-red-400">
          {discountPercent}%
        </span>
      )}
    </div>
  );
}
