import type { Bookmark } from "@/application/dto/bookmark.dto";

export const mockBookmarks: Bookmark[] = [
  {
    id: "bookmark-1",
    articleId: "article-1",
    createdBy: "user-1",
    createdAt: "2025-12-21T09:00:00.000Z",
  },
  {
    id: "bookmark-2",
    articleId: "article-4",
    createdBy: "user-1",
    createdAt: "2025-12-13T10:00:00.000Z",
  },
  {
    id: "bookmark-3",
    articleId: "article-10",
    createdBy: "user-1",
    createdAt: "2025-11-26T14:00:00.000Z",
  },
];
