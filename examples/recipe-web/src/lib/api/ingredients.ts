import { bkendFetch } from "@/infrastructure/api/client";
import type {
  Ingredient,
  CreateIngredientRequest,
  UpdateIngredientRequest,
} from "@/application/dto/ingredient.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

export async function getIngredientsByRecipe(
  recipeId: string,
  page = 1,
  limit = 50
): Promise<PaginatedResponse<Ingredient>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: "orderIndex",
    sortDirection: "asc",
    andFilters: JSON.stringify({ recipeId }),
  });

  return bkendFetch<PaginatedResponse<Ingredient>>(
    `/v1/data/ingredients?${params.toString()}`
  );
}

export async function getIngredient(id: string): Promise<Ingredient> {
  return bkendFetch<Ingredient>(`/v1/data/ingredients/${id}`);
}

export async function createIngredient(data: CreateIngredientRequest): Promise<Ingredient> {
  return bkendFetch<Ingredient>("/v1/data/ingredients", {
    method: "POST",
    body: data,
  });
}

export async function updateIngredient(id: string, data: UpdateIngredientRequest): Promise<Ingredient> {
  return bkendFetch<Ingredient>(`/v1/data/ingredients/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteIngredient(id: string): Promise<void> {
  return bkendFetch<void>(`/v1/data/ingredients/${id}`, {
    method: "DELETE",
  });
}
