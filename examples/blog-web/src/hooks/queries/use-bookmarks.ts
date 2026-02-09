"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import {
  getBookmarks,
  getBookmarkByArticleId,
  toggleBookmark,
} from "@/lib/api/bookmarks";

export function useBookmarks(page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.bookmarks.list({ page, limit }),
    queryFn: () => getBookmarks(page, limit),
  });
}

export function useBookmarkByArticle(articleId: string) {
  return useQuery({
    queryKey: queryKeys.bookmarks.byArticle(articleId),
    queryFn: () => getBookmarkByArticleId(articleId),
    enabled: !!articleId,
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => toggleBookmark(articleId),
    onSuccess: (_, articleId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.byArticle(articleId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.all,
      });
    },
  });
}
