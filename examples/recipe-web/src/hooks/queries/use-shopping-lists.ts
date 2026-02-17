"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getShoppingLists,
  getShoppingList,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
} from "@/lib/api/shopping-lists";
import { queryKeys } from "./keys";
import type {
  CreateShoppingListRequest,
  UpdateShoppingListRequest,
} from "@/application/dto/shopping-list.dto";

export function useShoppingLists(page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.shoppingLists.list(page),
    queryFn: () => getShoppingLists(page, limit),
  });
}

export function useShoppingList(id: string) {
  return useQuery({
    queryKey: queryKeys.shoppingLists.detail(id),
    queryFn: () => getShoppingList(id),
    enabled: !!id,
  });
}

export function useCreateShoppingList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShoppingListRequest) =>
      createShoppingList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.shoppingLists.lists(),
      });
    },
  });
}

export function useUpdateShoppingList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateShoppingListRequest;
    }) => updateShoppingList(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.shoppingLists.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.shoppingLists.lists(),
      });
    },
  });
}

export function useDeleteShoppingList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteShoppingList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.shoppingLists.lists(),
      });
    },
  });
}
