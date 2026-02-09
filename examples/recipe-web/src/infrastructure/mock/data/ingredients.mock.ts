import type { Ingredient } from "@/application/dto/ingredient.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

let ingredients: Ingredient[] = [
  // Kimchi Jjigae ingredients
  {
    id: "ing-001",
    recipeId: "recipe-001",
    name: "Kimchi",
    amount: "300",
    unit: "g",
    orderIndex: 0,
    isOptional: false,
    createdBy: "mock-user-001",
    createdAt: "2025-01-20T10:00:00.000Z",
  },
  {
    id: "ing-002",
    recipeId: "recipe-001",
    name: "Pork (shoulder)",
    amount: "150",
    unit: "g",
    orderIndex: 1,
    isOptional: false,
    createdBy: "mock-user-001",
    createdAt: "2025-01-20T10:00:00.000Z",
  },
  {
    id: "ing-003",
    recipeId: "recipe-001",
    name: "Tofu",
    amount: "1/2",
    unit: "piece",
    orderIndex: 2,
    isOptional: false,
    createdBy: "mock-user-001",
    createdAt: "2025-01-20T10:00:00.000Z",
  },
  {
    id: "ing-004",
    recipeId: "recipe-001",
    name: "Green onion",
    amount: "1",
    unit: "stalk",
    orderIndex: 3,
    isOptional: false,
    createdBy: "mock-user-001",
    createdAt: "2025-01-20T10:00:00.000Z",
  },
  {
    id: "ing-005",
    recipeId: "recipe-001",
    name: "Red pepper flakes",
    amount: "1",
    unit: "tbsp",
    orderIndex: 4,
    isOptional: true,
    createdBy: "mock-user-001",
    createdAt: "2025-01-20T10:00:00.000Z",
  },
  // Doenjang Jjigae ingredients
  {
    id: "ing-006",
    recipeId: "recipe-002",
    name: "Doenjang (soybean paste)",
    amount: "2",
    unit: "tbsp",
    orderIndex: 0,
    isOptional: false,
    createdBy: "mock-user-001",
    createdAt: "2025-01-21T11:00:00.000Z",
  },
  {
    id: "ing-007",
    recipeId: "recipe-002",
    name: "Tofu",
    amount: "1/2",
    unit: "piece",
    orderIndex: 1,
    isOptional: false,
    createdBy: "mock-user-001",
    createdAt: "2025-01-21T11:00:00.000Z",
  },
  {
    id: "ing-008",
    recipeId: "recipe-002",
    name: "Zucchini",
    amount: "1/2",
    unit: "piece",
    orderIndex: 2,
    isOptional: false,
    createdBy: "mock-user-001",
    createdAt: "2025-01-21T11:00:00.000Z",
  },
  {
    id: "ing-009",
    recipeId: "recipe-002",
    name: "Onion",
    amount: "1/2",
    unit: "piece",
    orderIndex: 3,
    isOptional: false,
    createdBy: "mock-user-001",
    createdAt: "2025-01-21T11:00:00.000Z",
  },
  // Bulgogi ingredients
  {
    id: "ing-010",
    recipeId: "recipe-003",
    name: "Beef (sirloin)",
    amount: "300",
    unit: "g",
    orderIndex: 0,
    isOptional: false,
    createdBy: "mock-user-001",
    createdAt: "2025-01-22T14:00:00.000Z",
  },
  {
    id: "ing-011",
    recipeId: "recipe-003",
    name: "Soy sauce",
    amount: "3",
    unit: "tbsp",
    orderIndex: 1,
    isOptional: false,
    createdBy: "mock-user-001",
    createdAt: "2025-01-22T14:00:00.000Z",
  },
  {
    id: "ing-012",
    recipeId: "recipe-003",
    name: "Sugar",
    amount: "1",
    unit: "tbsp",
    orderIndex: 2,
    isOptional: false,
    createdBy: "mock-user-001",
    createdAt: "2025-01-22T14:00:00.000Z",
  },
  {
    id: "ing-013",
    recipeId: "recipe-003",
    name: "Pear juice",
    amount: "2",
    unit: "tbsp",
    orderIndex: 3,
    isOptional: true,
    createdBy: "mock-user-001",
    createdAt: "2025-01-22T14:00:00.000Z",
  },
];

let nextId = 14;

export function getIngredientsByRecipe(
  recipeId: string,
  page: number,
  limit: number
): PaginatedResponse<Ingredient> {
  const filtered = ingredients
    .filter((i) => i.recipeId === recipeId)
    .sort((a, b) => a.orderIndex - b.orderIndex);

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

export function getIngredientById(id: string): Ingredient | undefined {
  return ingredients.find((i) => i.id === id);
}

export function createIngredient(data: Record<string, unknown>): Ingredient {
  const now = new Date().toISOString();
  const ingredient: Ingredient = {
    id: `ing-${String(nextId++).padStart(3, "0")}`,
    recipeId: (data.recipeId as string) || "",
    name: (data.name as string) || "",
    amount: (data.amount as string) || "",
    unit: (data.unit as string) || "",
    orderIndex: (data.orderIndex as number) || 0,
    isOptional: (data.isOptional as boolean) || false,
    createdBy: "mock-user-001",
    createdAt: now,
  };
  ingredients.push(ingredient);
  return ingredient;
}

export function updateIngredient(
  id: string,
  data: Record<string, unknown>
): Ingredient | undefined {
  const idx = ingredients.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  ingredients[idx] = { ...ingredients[idx], ...data };
  return ingredients[idx];
}

export function deleteIngredient(id: string): boolean {
  const idx = ingredients.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  ingredients.splice(idx, 1);
  return true;
}
