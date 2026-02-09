"use client";

import { Trash2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { CartSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { PageTransition } from "@/components/motion/page-transition";
import { useCartItems, useClearCart } from "@/hooks/queries/use-carts";

export default function CartPage() {
  const { data: cartItems, isLoading, isError, error, refetch } = useCartItems();
  const clearCart = useClearCart();

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Cart"
          description={`${cartItems?.length ?? 0} item(s)`}
        >
          {cartItems && cartItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearCart.mutate()}
              disabled={clearCart.isPending}
            >
              <Trash2 className="mr-2 h-3 w-3" />
              Clear All
            </Button>
          )}
        </PageHeader>

        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          loadingFallback={<CartSkeleton />}
          onRetry={() => refetch()}
        >
          {!cartItems || cartItems.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Browse products and add items to your cart."
              action={
                <Button asChild>
                  <a href="/products">Browse Products</a>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </div>
              <CartSummary items={cartItems} />
            </div>
          )}
        </QueryBoundary>
      </div>
    </PageTransition>
  );
}
