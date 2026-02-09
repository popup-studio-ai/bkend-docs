"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cookingLogsApi } from "@/lib/api/cooking-logs";
import { queryKeys } from "./keys";
import type { CreateCookingLogInput } from "@/application/dto/cooking-log.dto";

export function useCookingLogs(recipeId: string) {
  return useQuery({
    queryKey: queryKeys.cookingLogs.byRecipe(recipeId),
    queryFn: () => cookingLogsApi.listByRecipe(recipeId),
    enabled: !!recipeId,
  });
}

export function useCreateCookingLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCookingLogInput) => cookingLogsApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cookingLogs.byRecipe(variables.recipeId),
      });
    },
  });
}

export function useDeleteCookingLog(recipeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cookingLogsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cookingLogs.byRecipe(recipeId),
      });
    },
  });
}
