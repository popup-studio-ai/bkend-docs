"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ingredientsApi } from "@/lib/api/ingredients";
import { queryKeys } from "./keys";
import type {
  CreateIngredientRequest,
  UpdateIngredientRequest,
} from "@/application/dto/ingredient.dto";

export function useIngredients(recipeId: string) {
  return useQuery({
    queryKey: queryKeys.ingredients.byRecipe(recipeId),
    queryFn: () => ingredientsApi.listByRecipe(recipeId),
    enabled: !!recipeId,
  });
}

export function useCreateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIngredientRequest) => ingredientsApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.ingredients.byRecipe(variables.recipeId),
      });
    },
  });
}

export function useUpdateIngredient(recipeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateIngredientRequest;
    }) => ingredientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.ingredients.byRecipe(recipeId),
      });
    },
  });
}

export function useDeleteIngredient(recipeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ingredientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.ingredients.byRecipe(recipeId),
      });
    },
  });
}
