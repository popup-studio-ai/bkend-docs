import type { RecipeFilters } from "@/application/dto/recipe.dto";

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  recipes: {
    all: ["recipes"] as const,
    lists: () => [...queryKeys.recipes.all, "list"] as const,
    list: (page: number, limit: number, filters?: RecipeFilters) =>
      [...queryKeys.recipes.lists(), page, limit, filters] as const,
    details: () => [...queryKeys.recipes.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.recipes.details(), id] as const,
  },
  ingredients: {
    all: ["ingredients"] as const,
    byRecipe: (recipeId: string) =>
      [...queryKeys.ingredients.all, "recipe", recipeId] as const,
  },
  mealPlans: {
    all: ["meal-plans"] as const,
    week: (startDate: string, endDate: string) =>
      [...queryKeys.mealPlans.all, "week", startDate, endDate] as const,
  },
  shoppingLists: {
    all: ["shopping-lists"] as const,
    lists: () => [...queryKeys.shoppingLists.all, "list"] as const,
    list: (page: number) =>
      [...queryKeys.shoppingLists.lists(), page] as const,
    detail: (id: string) =>
      [...queryKeys.shoppingLists.all, "detail", id] as const,
  },
  cookingLogs: {
    all: ["cooking-logs"] as const,
    byRecipe: (recipeId: string) =>
      [...queryKeys.cookingLogs.all, "recipe", recipeId] as const,
  },
  files: {
    all: ["files"] as const,
  },
};
