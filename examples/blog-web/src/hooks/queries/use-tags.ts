"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { getTags, createTag, deleteTag } from "@/lib/api/tags";
import { useMe } from "./use-auth";
import type { CreateTagRequest } from "@/application/dto/tag.dto";

export function useTags() {
  const { data: currentUser } = useMe();

  return useQuery({
    queryKey: queryKeys.tags.list({ userId: currentUser?.id }),
    queryFn: () => getTags(currentUser?.id),
    enabled: !!currentUser?.id,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagRequest) => createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
}
