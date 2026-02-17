import { bkendFetch } from "@/infrastructure/api/client";
import type { ProductDto, ProductFormInput } from "@/application/dto/product.dto";
import type { PaginatedResponse, PaginationParams } from "@/application/dto/pagination.dto";

export interface ProductListParams extends PaginationParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}

export const productsApi = {
  list(params: ProductListParams = {}): Promise<PaginatedResponse<ProductDto>> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection);

    const filters: Record<string, string | number | boolean> = {};
    if (params.category) filters.category = params.category;
    if (params.isActive !== undefined) filters.isActive = params.isActive;

    if (Object.keys(filters).length > 0) {
      searchParams.set("andFilters", JSON.stringify(filters));
    }

    const query = searchParams.toString();
    return bkendFetch<PaginatedResponse<ProductDto>>(
      `/v1/data/products${query ? `?${query}` : ""}`
    );
  },

  getById(id: string): Promise<ProductDto> {
    return bkendFetch<ProductDto>(`/v1/data/products/${id}`);
  },

  create(input: ProductFormInput): Promise<ProductDto> {
    return bkendFetch<ProductDto>("/v1/data/products", {
      method: "POST",
      body: input,
    });
  },

  update(id: string, input: Partial<ProductFormInput>): Promise<ProductDto> {
    return bkendFetch<ProductDto>(`/v1/data/products/${id}`, {
      method: "PATCH",
      body: input,
    });
  },

  delete(id: string): Promise<void> {
    return bkendFetch<void>(`/v1/data/products/${id}`, {
      method: "DELETE",
    });
  },
};
