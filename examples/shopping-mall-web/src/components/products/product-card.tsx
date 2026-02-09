"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/price-display";
import { useAddToCart } from "@/hooks/queries/use-carts";
import { useUiStore } from "@/stores/ui-store";
import type { ProductDto } from "@/application/dto/product.dto";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ProductDto;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const addToCart = useAddToCart();
  const { openQuickView } = useUiStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate({ productId: product.id });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product.id);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
        featured && "row-span-2"
      )}
    >
      <Link href={`/products/${product.id}`}>
        <div className={cn("relative overflow-hidden", featured ? "aspect-[3/4]" : "aspect-square")}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
              <Package className="h-12 w-12 text-slate-300 dark:text-slate-600" />
            </div>
          )}

          {!product.isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-sm font-medium text-white">Sold Out</span>
            </div>
          )}

          {product.stock > 0 && product.stock <= 5 && (
            <Badge variant="warning" className="absolute left-2 top-2">
              {product.stock} left
            </Badge>
          )}

          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={handleQuickView}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="accent"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={handleAddToCart}
              disabled={!product.isActive || product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Badge variant="secondary" className="mb-2 text-xs">
            {product.category}
          </Badge>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 line-clamp-2">
            {product.name}
          </h3>
          <PriceDisplay price={product.price} size="md" className="mt-2" />
        </div>
      </Link>
    </motion.div>
  );
}
