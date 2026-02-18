"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { queryKeys } from "./keys";
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getPublishedArticles,
  getPublishedArticle,
} from "@/lib/api/articles";
import type {
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleFilters,
} from "@/application/dto/article.dto";
import type { PaginationParams } from "@/application/dto/pagination.dto";

interface UseArticlesParams extends PaginationParams {
  filters?: ArticleFilters;
  enabled?: boolean;
}

export function useArticles(params: UseArticlesParams = {}) {
  const { enabled, ...queryParams } = params;
  return useQuery({
    queryKey: queryKeys.articles.list(queryParams as Record<string, unknown>),
    queryFn: () => getArticles(queryParams),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: queryKeys.articles.detail(id),
    queryFn: () => getArticle(id),
    enabled: !!id,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArticleRequest) => createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleRequest }) =>
      updateArticle(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

// --- Public (no auth required) ---

export function usePublishedArticles(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.articles.list({ ...params, scope: "public", isPublished: true }),
    queryFn: () => getPublishedArticles(params),
    placeholderData: keepPreviousData,
  });
}

export function usePublishedArticle(id: string) {
  return useQuery({
    queryKey: queryKeys.articles.detail(`public-${id}`),
    queryFn: () => getPublishedArticle(id),
    enabled: !!id,
  });
}
