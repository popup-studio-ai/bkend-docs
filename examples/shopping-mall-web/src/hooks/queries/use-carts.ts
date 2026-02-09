"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartsApi } from "@/lib/api/carts";
import { productsApi } from "@/lib/api/products";
import { useCartStore } from "@/stores/cart-store";
import { queryKeys } from "./keys";
import type { CartItemWithProduct } from "@/application/dto/cart.dto";

export function useCartItems() {
  const { setItemCount } = useCartStore();

  return useQuery({
    queryKey: queryKeys.carts.list(),
    queryFn: async (): Promise<CartItemWithProduct[]> => {
      const { items } = await cartsApi.list();
      setItemCount(items.length);

      const enriched = await Promise.all(
        items.map(async (cartItem) => {
          try {
            const product = await productsApi.getById(cartItem.productId);
            return {
              ...cartItem,
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                stock: product.stock,
                isActive: product.isActive,
              },
            };
          } catch {
            return { ...cartItem, product: undefined };
          }
        })
      );

      return enriched;
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      const { items } = await cartsApi.list();
      const existing = items.find((item) => item.productId === productId);

      if (existing) {
        return cartsApi.updateQuantity(existing.id, existing.quantity + quantity);
      }
      return cartsApi.addItem(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.carts.all });
    },
  });
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, quantity }: { cartId: string; quantity: number }) =>
      cartsApi.updateQuantity(cartId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.carts.all });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: string) => cartsApi.removeItem(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.carts.all });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartsApi.clearAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.carts.all });
    },
  });
}
