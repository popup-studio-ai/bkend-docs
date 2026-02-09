export interface Ingredient {
  id: string;
  recipeId: string;
  name: string;
  amount: string;
  unit: string;
  orderIndex: number;
  isOptional: boolean;
  createdBy: string;
  createdAt: string;
}

export interface CreateIngredientRequest {
  recipeId: string;
  name: string;
  amount: string;
  unit: string;
  orderIndex: number;
  isOptional?: boolean;
}

export interface UpdateIngredientRequest {
  name?: string;
  amount?: string;
  unit?: string;
  orderIndex?: number;
  isOptional?: boolean;
}

export const UNIT_OPTIONS = [
  "g",
  "kg",
  "ml",
  "L",
  "piece",
  "sheet",
  "stalk",
  "tbsp",
  "tsp",
  "cup",
  "pinch",
  "dash",
  "to taste",
] as const;
