export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  articles: {
    all: ["articles"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.articles.all, "list", params] as const,
    detail: (id: string) =>
      [...queryKeys.articles.all, "detail", id] as const,
  },
  tags: {
    all: ["tags"] as const,
    list: () => [...queryKeys.tags.all, "list"] as const,
  },
  bookmarks: {
    all: ["bookmarks"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.bookmarks.all, "list", params] as const,
    byArticle: (articleId: string) =>
      [...queryKeys.bookmarks.all, "article", articleId] as const,
  },
  files: {
    all: ["files"] as const,
  },
};
