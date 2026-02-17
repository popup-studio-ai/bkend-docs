import { bkendFetch } from "@/infrastructure/api/client";
import type {
  MealPlan,
  CreateMealPlanRequest,
  UpdateMealPlanRequest,
} from "@/application/dto/meal-plan.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

export async function getMealPlansByDateRange(
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

  return bkendFetch<PaginatedResponse<MealPlan>>(
    `/v1/data/meal_plans?${params.toString()}`
  );
}

export async function getMealPlan(id: string): Promise<MealPlan> {
  return bkendFetch<MealPlan>(`/v1/data/meal_plans/${id}`);
}

export async function createMealPlan(data: CreateMealPlanRequest): Promise<MealPlan> {
  return bkendFetch<MealPlan>("/v1/data/meal_plans", {
    method: "POST",
    body: data,
  });
}

export async function updateMealPlan(id: string, data: UpdateMealPlanRequest): Promise<MealPlan> {
  return bkendFetch<MealPlan>(`/v1/data/meal_plans/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteMealPlan(id: string): Promise<void> {
  return bkendFetch<void>(`/v1/data/meal_plans/${id}`, {
    method: "DELETE",
  });
}
