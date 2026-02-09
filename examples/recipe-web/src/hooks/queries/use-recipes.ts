"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recipesApi } from "@/lib/api/recipes";
import { queryKeys } from "./keys";
import type {
  CreateRecipeRequest,
  UpdateRecipeRequest,
  RecipeFilters,
} from "@/application/dto/recipe.dto";

export function useRecipes(
  page = 1,
  limit = 12,
  filters?: RecipeFilters,
  sortBy = "createdAt",
  sortDirection: "asc" | "desc" = "desc"
) {
  return useQuery({
    queryKey: queryKeys.recipes.list(page, limit, filters),
    queryFn: () => recipesApi.list(page, limit, filters, sortBy, sortDirection),
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: queryKeys.recipes.detail(id),
    queryFn: () => recipesApi.get(id),
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipeRequest) => recipesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.lists() });
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRecipeRequest;
    }) => recipesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.lists() });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recipesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.lists() });
    },
  });
}
