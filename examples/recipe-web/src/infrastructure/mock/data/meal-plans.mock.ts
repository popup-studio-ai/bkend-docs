import type { MealPlan } from "@/application/dto/meal-plan.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

let mealPlans: MealPlan[] = [
  {
    id: "mp-001",
    date: "2025-02-03",
    mealType: "breakfast",
    recipeId: "recipe-008",
    servings: 1,
    notes: "Simple breakfast",
    createdBy: "mock-user-001",
    createdAt: "2025-02-01T08:00:00.000Z",
  },
  {
    id: "mp-002",
    date: "2025-02-03",
    mealType: "lunch",
    recipeId: "recipe-005",
    servings: 1,
    notes: "",
    createdBy: "mock-user-001",
    createdAt: "2025-02-01T08:00:00.000Z",
  },
  {
    id: "mp-003",
    date: "2025-02-03",
    mealType: "dinner",
    recipeId: "recipe-001",
    servings: 2,
    notes: "When the kimchi is well-fermented",
    createdBy: "mock-user-001",
    createdAt: "2025-02-01T08:00:00.000Z",
  },
  {
    id: "mp-004",
    date: "2025-02-04",
    mealType: "lunch",
    recipeId: "recipe-003",
    servings: 2,
    notes: "",
    createdBy: "mock-user-001",
    createdAt: "2025-02-01T08:00:00.000Z",
  },
  {
    id: "mp-005",
    date: "2025-02-04",
    mealType: "dinner",
    recipeId: "recipe-002",
    servings: 2,
    notes: "",
    createdBy: "mock-user-001",
    createdAt: "2025-02-01T08:00:00.000Z",
  },
  {
    id: "mp-006",
    date: "2025-02-05",
    mealType: "lunch",
    recipeId: "recipe-007",
    servings: 3,
    notes: "With the kids",
    createdBy: "mock-user-001",
    createdAt: "2025-02-01T08:00:00.000Z",
  },
];

let nextId = 7;

export function getMealPlansByDateRange(
  startDate: string,
  endDate: string,
  page: number,
  limit: number
): PaginatedResponse<MealPlan> {
  const filtered = mealPlans
    .filter((mp) => mp.date >= startDate && mp.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date));

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    items: filtered.slice(start, end),
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export function getMealPlanById(id: string): MealPlan | undefined {
  return mealPlans.find((mp) => mp.id === id);
}

export function createMealPlan(data: Record<string, unknown>): MealPlan {
  const now = new Date().toISOString();
  const plan: MealPlan = {
    id: `mp-${String(nextId++).padStart(3, "0")}`,
    date: (data.date as string) || "",
    mealType: (data.mealType as MealPlan["mealType"]) || "lunch",
    recipeId: (data.recipeId as string) || "",
    servings: (data.servings as number) || 1,
    notes: (data.notes as string) || "",
    createdBy: "mock-user-001",
    createdAt: now,
  };
  mealPlans.push(plan);
  return plan;
}

export function updateMealPlan(
  id: string,
  data: Record<string, unknown>
): MealPlan | undefined {
  const idx = mealPlans.findIndex((mp) => mp.id === id);
  if (idx === -1) return undefined;
  mealPlans[idx] = { ...mealPlans[idx], ...data };
  return mealPlans[idx];
}

export function deleteMealPlan(id: string): boolean {
  const idx = mealPlans.findIndex((mp) => mp.id === id);
  if (idx === -1) return false;
  mealPlans.splice(idx, 1);
  return true;
}
