import { bkendFetch } from "@/infrastructure/api/client";
import type { Tag, CreateTagRequest } from "@/application/dto/tag.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

export async function getTags(): Promise<PaginatedResponse<Tag>> {
  return bkendFetch<PaginatedResponse<Tag>>(
    "/v1/data/tags?page=1&limit=50&sortBy=name&sortDirection=asc"
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
