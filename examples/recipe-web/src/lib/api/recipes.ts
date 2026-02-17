import { bkendFetch } from "@/infrastructure/api/client";
import type {
  Recipe,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  RecipeFilters,
} from "@/application/dto/recipe.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

export async function getRecipes(
  page = 1,
  limit = 12,
  filters?: RecipeFilters,
  sortBy = "createdAt",
  sortDirection: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<Recipe>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy,
    sortDirection,
  });

  if (filters) {
    const andFilters: Record<string, string> = {};
    if (filters.difficulty) andFilters.difficulty = filters.difficulty;
    if (filters.category) andFilters.category = filters.category;
    if (Object.keys(andFilters).length > 0) {
      params.set("andFilters", JSON.stringify(andFilters));
    }
  }

  return bkendFetch<PaginatedResponse<Recipe>>(
    `/v1/data/recipes?${params.toString()}`
  );
}

export async function getRecipe(id: string): Promise<Recipe> {
  return bkendFetch<Recipe>(`/v1/data/recipes/${id}`);
}

export async function createRecipe(data: CreateRecipeRequest): Promise<Recipe> {
  return bkendFetch<Recipe>("/v1/data/recipes", {
    method: "POST",
    body: data,
  });
}

export async function updateRecipe(id: string, data: UpdateRecipeRequest): Promise<Recipe> {
  return bkendFetch<Recipe>(`/v1/data/recipes/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteRecipe(id: string): Promise<void> {
  return bkendFetch<void>(`/v1/data/recipes/${id}`, {
    method: "DELETE",
  });
}
