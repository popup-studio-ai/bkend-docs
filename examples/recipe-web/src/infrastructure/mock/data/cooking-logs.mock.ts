import type { CookingLogDto } from "@/application/dto/cooking-log.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

let cookingLogs: CookingLogDto[] = [
  {
    id: "cl-001",
    recipeId: "recipe-001",
    rating: 5,
    notes: "Kimchi Jjigae is definitely best with well-fermented kimchi!",
    cookedAt: "2025-01-25T18:00:00.000Z",
    createdBy: "mock-user-001",
    createdAt: "2025-01-25T19:00:00.000Z",
    updatedAt: "2025-01-25T19:00:00.000Z",
  },
  {
    id: "cl-002",
    recipeId: "recipe-001",
    rating: 4,
    notes: "The kimchi was slightly under-fermented, but still delicious.",
    cookedAt: "2025-02-01T12:30:00.000Z",
    createdBy: "mock-user-001",
    createdAt: "2025-02-01T13:00:00.000Z",
    updatedAt: "2025-02-01T13:00:00.000Z",
  },
  {
    id: "cl-003",
    recipeId: "recipe-003",
    rating: 5,
    notes: "Adding pear juice definitely made the meat more tender.",
    cookedAt: "2025-01-28T19:00:00.000Z",
    createdBy: "mock-user-001",
    createdAt: "2025-01-28T20:00:00.000Z",
    updatedAt: "2025-01-28T20:00:00.000Z",
  },
  {
    id: "cl-004",
    recipeId: "recipe-005",
    rating: 3,
    notes: "Preparing all the vegetable toppings was quite labor-intensive. Next time I'll simplify.",
    cookedAt: "2025-01-30T12:00:00.000Z",
    createdBy: "mock-user-001",
    createdAt: "2025-01-30T13:00:00.000Z",
    updatedAt: "2025-01-30T13:00:00.000Z",
  },
  {
    id: "cl-005",
    recipeId: "recipe-006",
    rating: 4,
    notes: "",
    cookedAt: "2025-02-02T17:00:00.000Z",
    createdBy: "mock-user-001",
    createdAt: "2025-02-02T17:30:00.000Z",
    updatedAt: "2025-02-02T17:30:00.000Z",
  },
];

let nextId = 6;

export function getCookingLogsByRecipe(
  recipeId: string,
  page: number,
  limit: number
): PaginatedResponse<CookingLogDto> {
  const filtered = cookingLogs
    .filter((cl) => cl.recipeId === recipeId)
    .sort((a, b) => b.cookedAt.localeCompare(a.cookedAt));

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
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

export function createCookingLog(data: Record<string, unknown>): CookingLogDto {
  const now = new Date().toISOString();
  const log: CookingLogDto = {
    id: `cl-${String(nextId++).padStart(3, "0")}`,
    recipeId: (data.recipeId as string) || "",
    rating: (data.rating as number) || 1,
    notes: (data.notes as string) || "",
    cookedAt: (data.cookedAt as string) || now,
    createdBy: "mock-user-001",
    createdAt: now,
    updatedAt: now,
  };
  cookingLogs.unshift(log);
  return log;
}

export function deleteCookingLog(id: string): boolean {
  const idx = cookingLogs.findIndex((cl) => cl.id === id);
  if (idx === -1) return false;
  cookingLogs.splice(idx, 1);
  return true;
}
