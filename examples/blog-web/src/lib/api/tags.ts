import { bkendFetch } from "@/infrastructure/api/client";
import type { Tag, CreateTagRequest } from "@/application/dto/tag.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

export async function getTags(userId?: string): Promise<PaginatedResponse<Tag>> {
  const params = new URLSearchParams({
    page: "1",
    limit: "50",
    sortBy: "name",
    sortDirection: "asc",
  });

  // Explicit filter (redundant with backend self permission, but clarifies intent)
  if (userId) {
    params.set("andFilters", JSON.stringify({ createdBy: userId }));
  }

  return bkendFetch<PaginatedResponse<Tag>>(
    `/v1/data/tags?${params.toString()}`
  );
}

export async function createTag(data: CreateTagRequest): Promise<Tag> {
  return bkendFetch<Tag>("/v1/data/tags", {
    method: "POST",
    body: data,
  });
}

export async function deleteTag(id: string): Promise<void> {
  return bkendFetch<void>(`/v1/data/tags/${id}`, {
    method: "DELETE",
  });
}
