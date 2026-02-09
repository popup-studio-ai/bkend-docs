import { apiClient } from "@/infrastructure/api/client";
import type {
  Recipe,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  RecipeFilters,
} from "@/application/dto/recipe.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

export const recipesApi = {
  list(
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

    return apiClient<PaginatedResponse<Recipe>>(
      `/v1/data/recipes?${params.toString()}`
    );
  },

  get(id: string): Promise<Recipe> {
    return apiClient<Recipe>(`/v1/data/recipes/${id}`);
  },

  create(data: CreateRecipeRequest): Promise<Recipe> {
    return apiClient<Recipe>("/v1/data/recipes", {
      method: "POST",
      body: data,
    });
  },

  update(id: string, data: UpdateRecipeRequest): Promise<Recipe> {
    return apiClient<Recipe>(`/v1/data/recipes/${id}`, {
      method: "PATCH",
      body: data,
    });
  },

  delete(id: string): Promise<void> {
    return apiClient<void>(`/v1/data/recipes/${id}`, {
      method: "DELETE",
    });
  },
};
