"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import {
  getBookmarks,
  getBookmarkByArticleId,
  toggleBookmark,
} from "@/lib/api/bookmarks";
import { useMe } from "./use-auth";
import type { Bookmark } from "@/application/dto/bookmark.dto";

export function useBookmarks(page = 1, limit = 20) {
  const { data: currentUser } = useMe();

  return useQuery({
    queryKey: queryKeys.bookmarks.list({ page, limit, userId: currentUser?.id }),
    queryFn: () => getBookmarks(page, limit, currentUser?.id),
    enabled: !!currentUser?.id,
  });
}

export function useBookmarkByArticle(articleId: string) {
  const { data: currentUser } = useMe();

  return useQuery({
    queryKey: queryKeys.bookmarks.byArticle(articleId),
    queryFn: () => getBookmarkByArticleId(articleId, currentUser?.id),
    enabled: !!articleId && !!currentUser?.id,
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, userId }: { articleId: string; userId?: string }) =>
      toggleBookmark(articleId, userId),
    onMutate: async ({ articleId }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.bookmarks.byArticle(articleId),
      });

      const previous = queryClient.getQueryData<Bookmark | null>(
        queryKeys.bookmarks.byArticle(articleId)
      );

      queryClient.setQueryData(
        queryKeys.bookmarks.byArticle(articleId),
        previous ? null : { id: "optimistic", articleId, createdAt: new Date().toISOString() }
      );

      return { previous };
    },
    onError: (_err, { articleId }, context) => {
      if (context) {
        queryClient.setQueryData(
          queryKeys.bookmarks.byArticle(articleId),
          context.previous
        );
      }
    },
    onSettled: (_data, _err, { articleId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.byArticle(articleId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.all,
      });
    },
  });
}
