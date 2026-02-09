import { apiClient } from "@/infrastructure/api/client";
import type { CartDto } from "@/application/dto/cart.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

export const cartsApi = {
  list(): Promise<PaginatedResponse<CartDto>> {
    return apiClient<PaginatedResponse<CartDto>>("/v1/data/carts?limit=100");
  },

  addItem(productId: string, quantity: number = 1): Promise<CartDto> {
    return apiClient<CartDto>("/v1/data/carts", {
      method: "POST",
      body: { productId, quantity },
    });
  },

  updateQuantity(cartId: string, quantity: number): Promise<CartDto> {
    return apiClient<CartDto>(`/v1/data/carts/${cartId}`, {
      method: "PATCH",
      body: { quantity },
    });
  },

  removeItem(cartId: string): Promise<void> {
    return apiClient<void>(`/v1/data/carts/${cartId}`, {
      method: "DELETE",
    });
  },

  async clearAll(): Promise<void> {
    const { items } = await this.list();
    await Promise.all(items.map((item) => this.removeItem(item.id)));
  },
};
