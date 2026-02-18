"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ShoppingCart, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/price-display";
import { useRouter } from "next/navigation";
import { useAddToCart } from "@/hooks/queries/use-carts";
import { useUiStore } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";
import { useDemoGuard } from "@/hooks/use-demo-guard";
import { formatRelativeTime, truncate } from "@/lib/utils";
import { getOptimizedImageUrl, IMAGE_PRESETS } from "@/lib/image";
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

interface ProductGridCardProps {
  product: ProductDto;
  index: number;
}

export function ProductGridCard({ product, index }: ProductGridCardProps) {
  const router = useRouter();
  const addToCart = useAddToCart();
  const { openQuickView } = useUiStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isDemoAccount } = useDemoGuard();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }
    if (isDemoAccount) return;
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
        <div className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:shadow-lg hover:border-accent-color/30">
          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden bg-muted">
            {product.imageUrl ? (
              <img
                src={getOptimizedImageUrl(product.imageUrl, IMAGE_PRESETS.thumbnail)}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-10 w-10 text-muted-foreground/30" />
              </div>
            )}

            {/* Sold out overlay */}
            {!product.isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-sm font-medium text-white">Sold Out</span>
              </div>
            )}

            {/* Low stock badge */}
            {product.isActive && product.stock > 0 && product.stock <= 5 && (
              <Badge variant="warning" className="absolute left-2 top-2">
                {product.stock} left
              </Badge>
            )}

            {/* Hover actions */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={handleQuickView}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="h-9 w-9 rounded-full bg-accent-color text-white hover:bg-accent-color/90"
                onClick={handleAddToCart}
                disabled={!product.isActive || product.stock === 0 || isDemoAccount}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              {product.stock > 0 && (
                <span className="text-xs text-muted-foreground">
                  {product.stock} in stock
                </span>
              )}
            </div>

            <h3 className="font-semibold line-clamp-2 group-hover:text-accent-color transition-colors">
              {product.name}
            </h3>

            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 flex-1">
              {truncate(product.description, 100)}
            </p>

            <div className="mt-3 flex items-center justify-between pt-3 border-t">
              <PriceDisplay price={product.price} size="md" />
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(product.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
