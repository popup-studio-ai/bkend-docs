"use client";

import { motion } from "framer-motion";
import { Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/price-display";
import { QuantityStepper } from "./quantity-stepper";
import { formatPrice } from "@/lib/format";
import { useUpdateCartQuantity, useRemoveFromCart } from "@/hooks/queries/use-carts";
import type { CartItemWithProduct } from "@/application/dto/cart.dto";
import Link from "next/link";

interface CartItemProps {
  item: CartItemWithProduct;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useUpdateCartQuantity();
  const removeItem = useRemoveFromCart();

  const subtotal = (item.product?.price ?? 0) * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 rounded-md border border-slate-200 p-4 dark:border-slate-700"
    >
      <Link href={`/products/${item.productId}`} className="shrink-0">
        {item.product?.imageUrl ? (
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="h-24 w-24 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
            <Package className="h-8 w-8 text-slate-300" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.productId}`}
            className="font-medium text-slate-900 hover:underline dark:text-slate-50"
          >
            {item.product?.name ?? "Product info unavailable"}
          </Link>
          {item.product && <PriceDisplay price={item.product.price} size="sm" />}
        </div>

        <div className="flex items-center justify-between">
          <QuantityStepper
            value={item.quantity}
            max={item.product?.stock ?? 99}
            onChange={(qty) =>
              updateQuantity.mutate({ cartId: item.id, quantity: qty })
            }
          />
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
              {formatPrice(subtotal)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-red-500"
              onClick={() => removeItem.mutate(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
