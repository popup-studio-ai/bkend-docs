import { bkendFetch } from "@/infrastructure/api/client";
import type {
  ShoppingList,
  CreateShoppingListRequest,
  UpdateShoppingListRequest,
} from "@/application/dto/shopping-list.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

export async function getShoppingLists(
  page = 1,
  limit = 20
): Promise<PaginatedResponse<ShoppingList>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  return bkendFetch<PaginatedResponse<ShoppingList>>(
    `/v1/data/shopping_lists?${params.toString()}`
  );
}

export async function getShoppingList(id: string): Promise<ShoppingList> {
  return bkendFetch<ShoppingList>(`/v1/data/shopping_lists/${id}`);
}

export async function createShoppingList(data: CreateShoppingListRequest): Promise<ShoppingList> {
  return bkendFetch<ShoppingList>("/v1/data/shopping_lists", {
    method: "POST",
    body: data,
  });
}

export async function updateShoppingList(id: string, data: UpdateShoppingListRequest): Promise<ShoppingList> {
  return bkendFetch<ShoppingList>(`/v1/data/shopping_lists/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteShoppingList(id: string): Promise<void> {
  return bkendFetch<void>(`/v1/data/shopping_lists/${id}`, {
    method: "DELETE",
  });
}
