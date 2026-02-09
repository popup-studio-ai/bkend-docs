import { apiClient } from "@/infrastructure/api/client";
import type { OrderDto, OrderStatus, CheckoutFormInput, OrderItemDto } from "@/application/dto/order.dto";
import type { PaginatedResponse, PaginationParams } from "@/application/dto/pagination.dto";
import type { CartDto } from "@/application/dto/cart.dto";
import { productsApi } from "./products";

export interface CreateOrderInput extends CheckoutFormInput {
  cartItems: CartDto[];
}

export const ordersApi = {
  list(params: PaginationParams = {}): Promise<PaginatedResponse<OrderDto>> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection);

    const query = searchParams.toString();
    return apiClient<PaginatedResponse<OrderDto>>(
      `/v1/data/orders${query ? `?${query}` : ""}`,
    );
  },

  getById(id: string): Promise<OrderDto> {
    return apiClient<OrderDto>(`/v1/data/orders/${id}`);
  },

  async create(input: CreateOrderInput): Promise<OrderDto> {
    const productPromises = input.cartItems.map((cartItem) =>
      productsApi.getById(cartItem.productId)
    );
    const products = await Promise.all(productPromises);

    const orderItems: OrderItemDto[] = input.cartItems.map((cartItem, index) => ({
      productId: cartItem.productId,
      name: products[index].name,
      price: products[index].price,
      quantity: cartItem.quantity,
    }));

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return apiClient<OrderDto>("/v1/data/orders", {
      method: "POST",
      body: {
        items: JSON.stringify(orderItems),
        totalPrice,
        status: "pending",
        shippingAddress: input.shippingAddress,
        recipientName: input.recipientName,
        recipientPhone: input.recipientPhone,
      },
    });
  },

  updateStatus(id: string, status: OrderStatus): Promise<OrderDto> {
    return apiClient<OrderDto>(`/v1/data/orders/${id}`, {
      method: "PATCH",
      body: { status },
    });
  },
};
