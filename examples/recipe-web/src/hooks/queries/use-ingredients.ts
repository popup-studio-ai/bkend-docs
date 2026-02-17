"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getIngredientsByRecipe,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "@/lib/api/ingredients";
import { queryKeys } from "./keys";
import type {
  CreateIngredientRequest,
  UpdateIngredientRequest,
} from "@/application/dto/ingredient.dto";

export function useIngredients(recipeId: string) {
  return useQuery({
    queryKey: queryKeys.ingredients.byRecipe(recipeId),
    queryFn: () => getIngredientsByRecipe(recipeId),
    enabled: !!recipeId,
  });
}

export function useCreateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIngredientRequest) => createIngredient(data),
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
    }) => updateIngredient(id, data),
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
    mutationFn: (id: string) => deleteIngredient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.ingredients.byRecipe(recipeId),
      });
    },
  });
}
