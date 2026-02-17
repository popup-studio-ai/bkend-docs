"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { CartSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { CheckoutForm } from "@/components/orders/checkout-form";
import { PageTransition } from "@/components/motion/page-transition";
import { useCartItems } from "@/hooks/queries/use-carts";

export default function CheckoutPage() {
  const { data: cartItems, isLoading, isError, error, refetch } = useCartItems();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/cart">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
        </Button>

        <PageHeader title="Checkout" description="Enter your shipping information" />

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
              description="Please add items to your cart first."
              action={
                <Button asChild>
                  <a href="/products">Browse Products</a>
                </Button>
              }
            />
          ) : (
            <CheckoutForm cartItems={cartItems} />
          )}
        </QueryBoundary>
      </div>
    </div>
  );
}
