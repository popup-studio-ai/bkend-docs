export type Difficulty = "easy" | "medium" | "hard";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  difficulty: Difficulty;
  servings: number;
  category: string;
  imageUrl: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeRequest {
  title: string;
  description: string;
  cookingTime: number;
  difficulty: Difficulty;
  servings: number;
  category: string;
  imageUrl?: string;
}

export interface UpdateRecipeRequest {
  title?: string;
  description?: string;
  cookingTime?: number;
  difficulty?: Difficulty;
  servings?: number;
  category?: string;
  imageUrl?: string;
}

export interface RecipeFilters {
  difficulty?: Difficulty;
  category?: string;
  cookingTimeMax?: number;
}

export const RECIPE_CATEGORIES = [
  "Korean",
  "Chinese",
  "Japanese",
  "Western",
  "Dessert",
  "Beverage",
  "Salad",
  "Soup",
  "Snack",
  "Other",
] as const;

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};
