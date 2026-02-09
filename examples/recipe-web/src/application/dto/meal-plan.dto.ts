export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealPlan {
  id: string;
  date: string;
  mealType: MealType;
  recipeId: string;
  servings: number;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateMealPlanRequest {
  date: string;
  mealType: MealType;
  recipeId: string;
  servings: number;
  notes?: string;
}

export interface UpdateMealPlanRequest {
  recipeId?: string;
  servings?: number;
  notes?: string;
  mealType?: MealType;
}

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export const MEAL_TYPE_ICONS: Record<MealType, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "🍪",
};

export interface DayPlan {
  date: string;
  meals: MealPlan[];
}
