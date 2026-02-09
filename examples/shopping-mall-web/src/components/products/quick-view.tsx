"use client";

import { ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/price-display";
import { useUiStore } from "@/stores/ui-store";
import { useProduct } from "@/hooks/queries/use-products";
import { useAddToCart } from "@/hooks/queries/use-carts";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function QuickView() {
  const { isQuickViewOpen, quickViewProductId, closeQuickView } = useUiStore();
  const { data: product, isLoading } = useProduct(quickViewProductId ?? "");
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart.mutate({ productId: product.id });
    closeQuickView();
  };

  return (
    <Dialog open={isQuickViewOpen} onOpenChange={(open) => !open && closeQuickView()}>
      <DialogContent className="sm:max-w-2xl">
        {isLoading || !product ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="sr-only">{product.name}</DialogTitle>
              <DialogDescription className="sr-only">
                {product.description}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="overflow-hidden rounded-md">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <ShoppingCart className="h-12 w-12 text-slate-300" />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between">
                <div className="space-y-3">
                  <Badge variant="secondary">{product.category}</Badge>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
                    {product.name}
                  </h2>
                  <PriceDisplay price={product.price} size="lg" />
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <Button
                    variant="accent"
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={!product.isActive || product.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/products/${product.id}`} onClick={closeQuickView}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
