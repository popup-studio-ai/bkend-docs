"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DemoBanner } from "@/components/shared/demo-banner";
import { formatPrice } from "@/lib/format";
import { useCreateOrder } from "@/hooks/queries/use-orders";
import { useClearCart } from "@/hooks/queries/use-carts";
import { useDemoGuard } from "@/hooks/use-demo-guard";
import {
  checkoutFormSchema,
  type CheckoutFormInput,
} from "@/application/dto/order.dto";
import type { CartItemWithProduct } from "@/application/dto/cart.dto";

interface CheckoutFormProps {
  cartItems: CartItemWithProduct[];
}

export function CheckoutForm({ cartItems }: CheckoutFormProps) {
  const router = useRouter();
  const createOrder = useCreateOrder();
  const clearCart = useClearCart();
  const { isDemoAccount } = useDemoGuard();

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price ?? 0) * item.quantity;
  }, 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
  });

  const onSubmit = async (data: CheckoutFormInput) => {
    const order = await createOrder.mutateAsync({
      ...data,
      cartItems: cartItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        createdBy: item.createdBy,
        createdAt: item.createdAt,
      })),
    });
    await clearCart.mutateAsync();
    router.push(`/orders/${order.id}`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {isDemoAccount && <DemoBanner />}

        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  placeholder="Enter recipient name"
                  {...register("recipientName")}
                />
                {errors.recipientName && (
                  <p className="text-xs text-red-500">
                    {errors.recipientName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientPhone">Phone</Label>
                <Input
                  id="recipientPhone"
                  placeholder="(555) 123-4567"
                  {...register("recipientPhone")}
                />
                {errors.recipientPhone && (
                  <p className="text-xs text-red-500">
                    {errors.recipientPhone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Textarea
                  id="shippingAddress"
                  placeholder="Enter your shipping address"
                  rows={3}
                  {...register("shippingAddress")}
                />
                {errors.shippingAddress && (
                  <p className="text-xs text-red-500">
                    {errors.shippingAddress.message}
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground line-clamp-1 max-w-[60%]">
                  {item.product?.name ?? "Product"}
                  <span className="text-slate-400"> x{item.quantity}</span>
                </span>
                <span className="font-medium">
                  {formatPrice((item.product?.price ?? 0) * item.quantity)}
                </span>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-400">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {createOrder.isError && (
              <div className="rounded-md bg-red-50 p-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {createOrder.error?.message || "Failed to place order."}
              </div>
            )}

            <Button
              type="submit"
              form="checkout-form"
              variant="accent"
              className="w-full"
              size="lg"
              disabled={createOrder.isPending || clearCart.isPending || isDemoAccount}
            >
              {(createOrder.isPending || clearCart.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Pay {formatPrice(totalPrice)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
