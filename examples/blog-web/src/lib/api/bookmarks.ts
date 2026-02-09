import { bkendFetch } from "@/infrastructure/api/client";
import type { Bookmark } from "@/application/dto/bookmark.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

export async function getBookmarks(
  page = 1,
  limit = 20
): Promise<PaginatedResponse<Bookmark>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  return bkendFetch<PaginatedResponse<Bookmark>>(
    `/v1/data/bookmarks?${params.toString()}`
  );
}

export async function getBookmarkByArticleId(
  articleId: string
): Promise<Bookmark | null> {
  const params = new URLSearchParams({
    page: "1",
    limit: "1",
    andFilters: JSON.stringify({ articleId }),
  });

  const result = await bkendFetch<PaginatedResponse<Bookmark>>(
    `/v1/data/bookmarks?${params.toString()}`
  );

  return result.items.length > 0 ? result.items[0] : null;
}

export async function createBookmark(articleId: string): Promise<Bookmark> {
  return bkendFetch<Bookmark>("/v1/data/bookmarks", {
    method: "POST",
    body: { articleId },
  });
}

export async function deleteBookmark(id: string): Promise<void> {
  return bkendFetch<void>(`/v1/data/bookmarks/${id}`, {
    method: "DELETE",
  });
}

export async function toggleBookmark(
  articleId: string
): Promise<{ bookmarked: boolean; bookmark: Bookmark | null }> {
  const existing = await getBookmarkByArticleId(articleId);

  if (existing) {
    await deleteBookmark(existing.id);
    return { bookmarked: false, bookmark: null };
  }

  const bookmark = await createBookmark(articleId);
  return { bookmarked: true, bookmark };
}
