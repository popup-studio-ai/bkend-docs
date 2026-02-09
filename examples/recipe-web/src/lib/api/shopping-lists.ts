import { apiClient } from "@/infrastructure/api/client";
import type {
  ShoppingList,
  CreateShoppingListRequest,
  UpdateShoppingListRequest,
} from "@/application/dto/shopping-list.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

export const shoppingListsApi = {
  list(
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<ShoppingList>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy: "createdAt",
      sortDirection: "desc",
    });

    return apiClient<PaginatedResponse<ShoppingList>>(
      `/v1/data/shopping_lists?${params.toString()}`
    );
  },

  get(id: string): Promise<ShoppingList> {
    return apiClient<ShoppingList>(`/v1/data/shopping_lists/${id}`);
  },

  create(data: CreateShoppingListRequest): Promise<ShoppingList> {
    return apiClient<ShoppingList>("/v1/data/shopping_lists", {
      method: "POST",
      body: data,
    });
  },

  update(id: string, data: UpdateShoppingListRequest): Promise<ShoppingList> {
    return apiClient<ShoppingList>(`/v1/data/shopping_lists/${id}`, {
      method: "PATCH",
      body: data,
    });
  },

  delete(id: string): Promise<void> {
    return apiClient<void>(`/v1/data/shopping_lists/${id}`, {
      method: "DELETE",
    });
  },
};
