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
} from "@/lib/api/articles";
import type {
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleFilters,
} from "@/application/dto/article.dto";
import type { PaginationParams } from "@/application/dto/pagination.dto";

interface UseArticlesParams extends PaginationParams {
  filters?: ArticleFilters;
}

export function useArticles(params: UseArticlesParams = {}) {
  return useQuery({
    queryKey: queryKeys.articles.list(params as Record<string, unknown>),
    queryFn: () => getArticles(params),
    placeholderData: keepPreviousData,
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
