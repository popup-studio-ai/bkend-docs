import { bkendFetch } from "@/infrastructure/api/client";
import type { ReviewDto, ReviewFormInput } from "@/application/dto/review.dto";
import type { PaginatedResponse, PaginationParams } from "@/application/dto/pagination.dto";

export const reviewsApi = {
  listByProduct(
    productId: string,
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<ReviewDto>> {
    const searchParams = new URLSearchParams();
    searchParams.set("andFilters", JSON.stringify({ productId }));
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection);

    return bkendFetch<PaginatedResponse<ReviewDto>>(
      `/v1/data/reviews?${searchParams.toString()}`,
      { skipAuth: true }
    );
  },

  listByUser(params: PaginationParams = {}): Promise<PaginatedResponse<ReviewDto>> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection);

    return bkendFetch<PaginatedResponse<ReviewDto>>(
      `/v1/data/reviews?${searchParams.toString()}`
    );
  },

  create(input: ReviewFormInput): Promise<ReviewDto> {
    return bkendFetch<ReviewDto>("/v1/data/reviews", {
      method: "POST",
      body: input,
    });
  },

  update(
    id: string,
    input: Pick<ReviewFormInput, "rating" | "content">
  ): Promise<ReviewDto> {
    return bkendFetch<ReviewDto>(`/v1/data/reviews/${id}`, {
      method: "PATCH",
      body: input,
    });
  },

  delete(id: string): Promise<void> {
    return bkendFetch<void>(`/v1/data/reviews/${id}`, {
      method: "DELETE",
    });
  },
};
