"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi, type CreateOrderInput } from "@/lib/api/orders";
import { VALID_TRANSITIONS, type OrderStatus } from "@/application/dto/order.dto";
import { queryKeys } from "./keys";
import type { PaginationParams } from "@/application/dto/pagination.dto";

export function useOrders(params: PaginationParams = {}) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () =>
      ordersApi.list({ sortBy: "createdAt", sortDirection: "desc", ...params }),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.carts.all });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      currentStatus,
      newStatus,
    }: {
      id: string;
      currentStatus: OrderStatus;
      newStatus: OrderStatus;
    }) => {
      const validNext = VALID_TRANSITIONS[currentStatus];
      if (!validNext.includes(newStatus)) {
        throw new Error(
          `Cannot transition from ${currentStatus} to ${newStatus}.`
        );
      }
      return ordersApi.updateStatus(id, newStatus);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
}
