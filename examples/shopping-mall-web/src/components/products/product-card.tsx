"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/price-display";
import { useAddToCart } from "@/hooks/queries/use-carts";
import { useUiStore } from "@/stores/ui-store";
import { formatRelativeTime, truncate } from "@/lib/utils";
import type { ProductDto } from "@/application/dto/product.dto";

const listItemVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 20,
    transition: { delay: i * 0.05 },
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

interface ProductCardProps {
  product: ProductDto;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
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
      custom={index}
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
    >
      <Link href={`/products/${product.id}`}>
        <div className="group flex gap-4 overflow-hidden rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-accent-color/30">
          {/* Thumbnail */}
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground/30" />
              </div>
            )}
            {!product.isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-xs font-medium text-white">Sold Out</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
                {product.isActive && product.stock > 0 && product.stock <= 5 && (
                  <Badge variant="warning" className="text-xs">
                    {product.stock} left
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold line-clamp-1 group-hover:text-accent-color transition-colors">
                {product.name}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                {truncate(product.description, 80)}
              </p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <PriceDisplay price={product.price} size="md" />
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(product.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleQuickView}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-accent-color hover:text-accent-color"
                  onClick={handleAddToCart}
                  disabled={!product.isActive || product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
