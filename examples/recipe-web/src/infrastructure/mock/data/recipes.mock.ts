import type { Recipe } from "@/application/dto/recipe.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

let recipes: Recipe[] = [
  {
    id: "recipe-001",
    title: "Kimchi Jjigae",
    description:
      "A classic Korean stew made with pork and well-fermented kimchi. Served with rice, it makes a hearty meal.",
    cookingTime: 30,
    difficulty: "easy",
    servings: 2,
    category: "Korean",
    imageUrl: "https://picsum.photos/seed/kimchi/800/600",
    createdBy: "mock-user-001",
    createdAt: "2025-01-20T10:00:00.000Z",
    updatedAt: "2025-01-20T10:00:00.000Z",
  },
  {
    id: "recipe-002",
    title: "Doenjang Jjigae",
    description:
      "A savory Korean stew made with doenjang (soybean paste), tofu, and assorted vegetables. It is often considered Korean soul food.",
    cookingTime: 25,
    difficulty: "easy",
    servings: 2,
    category: "Korean",
    imageUrl: "https://picsum.photos/seed/doenjang/800/600",
    createdBy: "mock-user-001",
    createdAt: "2025-01-21T11:00:00.000Z",
    updatedAt: "2025-01-21T11:00:00.000Z",
  },
  {
    id: "recipe-003",
    title: "Bulgogi",
    description:
      "Thinly sliced beef marinated in a soy sauce-based seasoning and grilled. The sweet marinade and tender meat make a perfect combination.",
    cookingTime: 40,
    difficulty: "medium",
    servings: 3,
    category: "Korean",
    imageUrl: "https://picsum.photos/seed/bulgogi/800/600",
    createdBy: "mock-user-001",
    createdAt: "2025-01-22T14:00:00.000Z",
    updatedAt: "2025-01-22T14:00:00.000Z",
  },
  {
    id: "recipe-004",
    title: "Japchae",
    description:
      "A festive dish made by stir-frying glass noodles with assorted vegetables and meat. A must-have at Korean holidays and parties.",
    cookingTime: 50,
    difficulty: "medium",
    servings: 4,
    category: "Korean",
    imageUrl: "https://picsum.photos/seed/japchae/800/600",
    createdBy: "mock-user-001",
    createdAt: "2025-01-23T09:30:00.000Z",
    updatedAt: "2025-01-23T09:30:00.000Z",
  },
  {
    id: "recipe-005",
    title: "Bibimbap",
    description:
      "A rice bowl topped with assorted seasoned vegetables and gochujang, mixed together before eating. Nutritionally balanced and customizable to your taste.",
    cookingTime: 35,
    difficulty: "medium",
    servings: 1,
    category: "Korean",
    imageUrl: "https://picsum.photos/seed/bibimbap/800/600",
    createdBy: "mock-user-001",
    createdAt: "2025-01-24T08:00:00.000Z",
    updatedAt: "2025-01-24T08:00:00.000Z",
  },
  {
    id: "recipe-006",
    title: "Tteokbokki",
    description:
      "A popular Korean street food made with rice cakes and fish cakes in a spicy gochujang sauce. Its sweet and spicy flavor is addictive.",
    cookingTime: 20,
    difficulty: "easy",
    servings: 2,
    category: "Snack",
    imageUrl: "https://picsum.photos/seed/tteokbokki/800/600",
    createdBy: "mock-user-001",
    createdAt: "2025-01-25T16:00:00.000Z",
    updatedAt: "2025-01-25T16:00:00.000Z",
  },
  {
    id: "recipe-007",
    title: "Curry Rice",
    description:
      "A comforting dish made with potatoes, carrots, onions, and meat simmered in curry roux. Loved by all ages.",
    cookingTime: 45,
    difficulty: "easy",
    servings: 4,
    category: "Western",
    imageUrl: "https://picsum.photos/seed/curry/800/600",
    createdBy: "mock-user-001",
    createdAt: "2025-01-26T12:00:00.000Z",
    updatedAt: "2025-01-26T12:00:00.000Z",
  },
  {
    id: "recipe-008",
    title: "Gyeran Mari",
    description:
      "A Korean rolled omelette made with beaten eggs and assorted vegetables. Perfect as a side dish or lunchbox item.",
    cookingTime: 15,
    difficulty: "easy",
    servings: 2,
    category: "Korean",
    imageUrl: "https://picsum.photos/seed/eggroll/800/600",
    createdBy: "mock-user-001",
    createdAt: "2025-01-27T07:00:00.000Z",
    updatedAt: "2025-01-27T07:00:00.000Z",
  },
];

let nextId = 9;

function paginate<T>(items: T[], page: number, limit: number): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    items: items.slice(start, end),
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

export function getRecipesList(
  page: number,
  limit: number,
  andFilters?: Record<string, string>,
  sortBy = "createdAt",
  sortDirection: "asc" | "desc" = "desc"
): PaginatedResponse<Recipe> {
  let filtered = [...recipes];

  if (andFilters) {
    if (andFilters.difficulty) {
      filtered = filtered.filter((r) => r.difficulty === andFilters.difficulty);
    }
    if (andFilters.category) {
      filtered = filtered.filter((r) => r.category === andFilters.category);
    }
  }

  filtered.sort((a, b) => {
    const aVal = a[sortBy as keyof Recipe] ?? "";
    const bVal = b[sortBy as keyof Recipe] ?? "";
    const cmp = String(aVal).localeCompare(String(bVal));
    return sortDirection === "asc" ? cmp : -cmp;
  });

  return paginate(filtered, page, limit);
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function createRecipe(data: Record<string, unknown>): Recipe {
  const now = new Date().toISOString();
  const recipe: Recipe = {
    id: `recipe-${String(nextId++).padStart(3, "0")}`,
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    cookingTime: (data.cookingTime as number) || 0,
    difficulty: (data.difficulty as Recipe["difficulty"]) || "easy",
    servings: (data.servings as number) || 1,
    category: (data.category as string) || "Other",
    imageUrl: (data.imageUrl as string) || "",
    createdBy: "mock-user-001",
    createdAt: now,
    updatedAt: now,
  };
  recipes.unshift(recipe);
  return recipe;
}

export function updateRecipe(
  id: string,
  data: Record<string, unknown>
): Recipe | undefined {
  const idx = recipes.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  recipes[idx] = {
    ...recipes[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return recipes[idx];
}

export function deleteRecipe(id: string): boolean {
  const idx = recipes.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  recipes.splice(idx, 1);
  return true;
}
