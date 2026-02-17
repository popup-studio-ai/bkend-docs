"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUiStore } from "@/stores/ui-store";
import { useCartItems, useRemoveFromCart, useUpdateCartQuantity } from "@/hooks/queries/use-carts";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { PriceDisplay } from "@/components/shared/price-display";
import { formatPrice } from "@/lib/format";
import { CartSkeleton } from "@/components/shared/loading-skeleton";

export function CartDrawer() {
  const router = useRouter();
  const { isCartDrawerOpen, closeCartDrawer } = useUiStore();
  const { data: cartItems, isLoading } = useCartItems();
  const updateQuantity = useUpdateCartQuantity();
  const removeItem = useRemoveFromCart();

  const totalPrice =
    cartItems?.reduce((sum, item) => {
      if (!item.product) return sum;
      return sum + item.product.price * item.quantity;
    }, 0) ?? 0;

  const handleCheckout = () => {
    closeCartDrawer();
    router.push("/checkout");
  };

  return (
    <Sheet open={isCartDrawerOpen} onOpenChange={(open) => !open && closeCartDrawer()}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Cart
          </SheetTitle>
          <SheetDescription>
            {cartItems?.length ?? 0} item(s) in your cart
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <CartSkeleton />
          ) : !cartItems || cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                Your cart is empty
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-xl border bg-card p-3">
                  {item.product?.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        {item.product?.name ?? "Product info unavailable"}
                      </p>
                      {item.product && (
                        <PriceDisplay price={item.product.price} size="sm" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <QuantityStepper
                        value={item.quantity}
                        max={item.product?.stock ?? 99}
                        onChange={(qty) =>
                          updateQuantity.mutate({ cartId: item.id, quantity: qty })
                        }
                        size="sm"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem.mutate(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems && cartItems.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between pb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Total
              </span>
              <span className="text-xl font-bold text-accent-color">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <Separator className="mb-4" />
            <Button className="w-full bg-accent-color text-white hover:bg-accent-color/90" size="lg" onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
