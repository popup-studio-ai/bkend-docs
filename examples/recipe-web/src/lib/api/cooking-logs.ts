import { apiClient } from "@/infrastructure/api/client";
import type {
  CookingLogDto,
  CreateCookingLogInput,
} from "@/application/dto/cooking-log.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

export const cookingLogsApi = {
  listByRecipe(
    recipeId: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<CookingLogDto>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy: "cookedAt",
      sortDirection: "desc",
      andFilters: JSON.stringify({ recipeId }),
    });

    return apiClient<PaginatedResponse<CookingLogDto>>(
      `/v1/data/cooking_logs?${params.toString()}`
    );
  },

  create(data: CreateCookingLogInput): Promise<CookingLogDto> {
    return apiClient<CookingLogDto>("/v1/data/cooking_logs", {
      method: "POST",
      body: {
        ...data,
        cookedAt: data.cookedAt ?? new Date().toISOString(),
      },
    });
  },

  delete(id: string): Promise<void> {
    return apiClient<void>(`/v1/data/cooking_logs/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Calculates the average rating from an array of cooking logs.
 * Returns 0 if there are no logs.
 */
export function calculateAverageRating(logs: CookingLogDto[]): number {
  if (logs.length === 0) return 0;
  const sum = logs.reduce((acc, log) => acc + log.rating, 0);
  return Math.round((sum / logs.length) * 10) / 10;
}
