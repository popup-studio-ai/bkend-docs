"use client";

import { useRouter } from "next/navigation";
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
import { useAuthStore } from "@/stores/auth-store";
import { useProduct } from "@/hooks/queries/use-products";
import { useAddToCart } from "@/hooks/queries/use-carts";
import { useDemoGuard } from "@/hooks/use-demo-guard";
import { Skeleton } from "@/components/ui/skeleton";
import { getOptimizedImageUrl, IMAGE_PRESETS } from "@/lib/image";
import Link from "next/link";

export function QuickView() {
  const router = useRouter();
  const { isQuickViewOpen, quickViewProductId, closeQuickView } = useUiStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: product, isLoading } = useProduct(quickViewProductId ?? "");
  const addToCart = useAddToCart();
  const { isDemoAccount } = useDemoGuard();

  const handleAddToCart = () => {
    if (!product) return;
    if (!isAuthenticated) {
      closeQuickView();
      router.push("/sign-in");
      return;
    }
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
              <div className="overflow-hidden rounded-xl">
                {product.imageUrl ? (
                  <img
                    src={getOptimizedImageUrl(product.imageUrl, IMAGE_PRESETS.gallery)}
                    alt={product.name}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-muted">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between">
                <div className="space-y-3">
                  <Badge variant="secondary">{product.category}</Badge>
                  <h2 className="text-xl font-extrabold">
                    {product.name}
                  </h2>
                  <PriceDisplay price={product.price} size="lg" />
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <Button
                    className="w-full bg-accent-color text-white hover:bg-accent-color/90"
                    onClick={handleAddToCart}
                    disabled={!product.isActive || product.stock === 0 || isDemoAccount}
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
