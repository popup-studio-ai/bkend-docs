import type { ShoppingList } from "@/application/dto/shopping-list.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

let shoppingLists: ShoppingList[] = [
  {
    id: "sl-001",
    name: "This Week's Groceries",
    date: "2025-02-03",
    items: [
      { name: "Kimchi", amount: "300", unit: "g", checked: false, recipeId: "recipe-001" },
      { name: "Pork shoulder", amount: "150", unit: "g", checked: true, recipeId: "recipe-001" },
      { name: "Tofu", amount: "1", unit: "piece", checked: false, recipeId: "recipe-001" },
      { name: "Green onion", amount: "2", unit: "stalk", checked: false, recipeId: "recipe-001" },
      { name: "Beef sirloin", amount: "300", unit: "g", checked: false, recipeId: "recipe-003" },
      { name: "Soy sauce", amount: "3", unit: "tbsp", checked: true, recipeId: "recipe-003" },
    ],
    totalItems: 6,
    checkedItems: 2,
    createdBy: "mock-user-001",
    createdAt: "2025-02-01T10:00:00.000Z",
  },
  {
    id: "sl-002",
    name: "Curry Ingredients",
    date: "2025-02-05",
    items: [
      { name: "Potato", amount: "3", unit: "piece", checked: false, recipeId: "recipe-007" },
      { name: "Carrot", amount: "1", unit: "piece", checked: false, recipeId: "recipe-007" },
      { name: "Onion", amount: "2", unit: "piece", checked: false, recipeId: "recipe-007" },
      { name: "Curry roux", amount: "1", unit: "piece", checked: false, recipeId: "recipe-007" },
    ],
    totalItems: 4,
    checkedItems: 0,
    createdBy: "mock-user-001",
    createdAt: "2025-02-02T09:00:00.000Z",
  },
];

let nextId = 3;

export function getShoppingLists(
  page: number,
  limit: number
): PaginatedResponse<ShoppingList> {
  const sorted = [...shoppingLists].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );

  const total = sorted.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    items: sorted.slice(start, end),
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

export function getShoppingListById(id: string): ShoppingList | undefined {
  return shoppingLists.find((sl) => sl.id === id);
}

export function createShoppingList(
  data: Record<string, unknown>
): ShoppingList {
  const now = new Date().toISOString();
  const list: ShoppingList = {
    id: `sl-${String(nextId++).padStart(3, "0")}`,
    name: (data.name as string) || "",
    date: (data.date as string) || "",
    items: (data.items as ShoppingList["items"]) || [],
    totalItems: (data.totalItems as number) || 0,
    checkedItems: (data.checkedItems as number) || 0,
    createdBy: "mock-user-001",
    createdAt: now,
  };
  shoppingLists.unshift(list);
  return list;
}

export function updateShoppingList(
  id: string,
  data: Record<string, unknown>
): ShoppingList | undefined {
  const idx = shoppingLists.findIndex((sl) => sl.id === id);
  if (idx === -1) return undefined;
  shoppingLists[idx] = { ...shoppingLists[idx], ...data };
  return shoppingLists[idx];
}

export function deleteShoppingList(id: string): boolean {
  const idx = shoppingLists.findIndex((sl) => sl.id === id);
  if (idx === -1) return false;
  shoppingLists.splice(idx, 1);
  return true;
}
