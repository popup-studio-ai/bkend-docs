import { apiClient } from "@/infrastructure/api/client";
import type {
  MealPlan,
  CreateMealPlanRequest,
  UpdateMealPlanRequest,
} from "@/application/dto/meal-plan.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

export const mealPlansApi = {
  listByDateRange(
    startDate: string,
    endDate: string,
    page = 1,
    limit = 50
  ): Promise<PaginatedResponse<MealPlan>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy: "date",
      sortDirection: "asc",
      andFilters: JSON.stringify({
        date: { $gte: startDate, $lte: endDate },
      }),
    });

    return apiClient<PaginatedResponse<MealPlan>>(
      `/v1/data/meal_plans?${params.toString()}`
    );
  },

  get(id: string): Promise<MealPlan> {
    return apiClient<MealPlan>(`/v1/data/meal_plans/${id}`);
  },

  create(data: CreateMealPlanRequest): Promise<MealPlan> {
    return apiClient<MealPlan>("/v1/data/meal_plans", {
      method: "POST",
      body: data,
    });
  },

  update(id: string, data: UpdateMealPlanRequest): Promise<MealPlan> {
    return apiClient<MealPlan>(`/v1/data/meal_plans/${id}`, {
      method: "PATCH",
      body: data,
    });
  },

  delete(id: string): Promise<void> {
    return apiClient<void>(`/v1/data/meal_plans/${id}`, {
      method: "DELETE",
    });
  },
};
