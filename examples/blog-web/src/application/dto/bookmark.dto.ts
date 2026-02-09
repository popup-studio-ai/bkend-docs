export interface Bookmark {
  id: string;
  articleId: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateBookmarkRequest {
  articleId: string;
}
