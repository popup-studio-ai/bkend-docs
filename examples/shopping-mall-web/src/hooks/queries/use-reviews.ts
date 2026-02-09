"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api/reviews";
import { queryKeys } from "./keys";
import type { ReviewFormInput } from "@/application/dto/review.dto";
import type { PaginationParams } from "@/application/dto/pagination.dto";

export function useProductReviews(
  productId: string,
  params: PaginationParams = {}
) {
  return useQuery({
    queryKey: queryKeys.reviews.byProduct(productId),
    queryFn: () =>
      reviewsApi.listByProduct(productId, {
        sortBy: "createdAt",
        sortDirection: "desc",
        limit: 100,
        ...params,
      }),
    enabled: !!productId,
  });
}

export function useMyReviews(params: PaginationParams = {}) {
  return useQuery({
    queryKey: queryKeys.reviews.byUser(),
    queryFn: () =>
      reviewsApi.listByUser({
        sortBy: "createdAt",
        sortDirection: "desc",
        ...params,
      }),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReviewFormInput) => reviewsApi.create(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byProduct(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byUser() });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      productId: string;
      input: Pick<ReviewFormInput, "rating" | "content">;
    }) => reviewsApi.update(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byProduct(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byUser() });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; productId: string }) =>
      reviewsApi.delete(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byProduct(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byUser() });
    },
  });
}
