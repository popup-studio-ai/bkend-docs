"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import type { CartItemWithProduct } from "@/application/dto/cart.dto";

interface CartSummaryProps {
  items: CartItemWithProduct[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product?.price ?? 0) * item.quantity;
  }, 0);

  const shippingFee = subtotal >= 50 ? 0 : 5;
  const total = subtotal + shippingFee;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Shipping</span>
          <span className="font-medium">
            {shippingFee === 0 ? (
              <span className="text-green-600 dark:text-green-400">Free</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </span>
        </div>
        {shippingFee > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Add {formatPrice(50 - subtotal)} more for free shipping
          </p>
        )}
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium">Total</span>
          <span className="text-xl font-bold text-amber-700 dark:text-amber-400">
            {formatPrice(total)}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="accent" className="w-full" size="lg" asChild>
          <Link href="/checkout">Checkout</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
