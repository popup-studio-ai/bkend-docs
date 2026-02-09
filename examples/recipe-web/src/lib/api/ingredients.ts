import { apiClient } from "@/infrastructure/api/client";
import type {
  Ingredient,
  CreateIngredientRequest,
  UpdateIngredientRequest,
} from "@/application/dto/ingredient.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

export const ingredientsApi = {
  listByRecipe(
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

    return apiClient<PaginatedResponse<Ingredient>>(
      `/v1/data/ingredients?${params.toString()}`
    );
  },

  get(id: string): Promise<Ingredient> {
    return apiClient<Ingredient>(`/v1/data/ingredients/${id}`);
  },

  create(data: CreateIngredientRequest): Promise<Ingredient> {
    return apiClient<Ingredient>("/v1/data/ingredients", {
      method: "POST",
      body: data,
    });
  },

  update(id: string, data: UpdateIngredientRequest): Promise<Ingredient> {
    return apiClient<Ingredient>(`/v1/data/ingredients/${id}`, {
      method: "PATCH",
      body: data,
    });
  },

  delete(id: string): Promise<void> {
    return apiClient<void>(`/v1/data/ingredients/${id}`, {
      method: "DELETE",
    });
  },
};
