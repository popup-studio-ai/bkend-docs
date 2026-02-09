"use client";

import { ProductCard } from "./product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ShoppingBag } from "lucide-react";
import type { ProductDto } from "@/application/dto/product.dto";

interface ProductGridProps {
  products: ProductDto[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-12 w-12" />}
        title="No products found"
        description="No products have been listed yet."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          featured={index === 0}
        />
      ))}
    </div>
  );
}
