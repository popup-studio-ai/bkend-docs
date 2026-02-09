import type { Article } from "@/application/dto/article.dto";
import type { Tag } from "@/application/dto/tag.dto";
import type { Bookmark } from "@/application/dto/bookmark.dto";
import type { PaginatedResponse } from "@/application/dto/pagination.dto";

import { mockUser, mockAuthResponse, mockRefreshResponse } from "./data/auth.mock";
import { mockArticles } from "./data/articles.mock";
import { mockTags } from "./data/tags.mock";
import { mockBookmarks } from "./data/bookmarks.mock";
import { createMockPresignedUrl, createMockFileRecord } from "./data/files.mock";

// ---------------------------------------------------------------------------
// Mock mode detection
// ---------------------------------------------------------------------------
export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_MOCK_MODE === "true";
}

// ---------------------------------------------------------------------------
// In-memory data store (resets to initial data on page refresh)
// ---------------------------------------------------------------------------
let articles: Article[] = structuredClone(mockArticles);
let tags: Tag[] = structuredClone(mockTags);
let bookmarks: Bookmark[] = structuredClone(mockBookmarks);

let articleIdCounter = mockArticles.length;
let tagIdCounter = mockTags.length;
let bookmarkIdCounter = mockBookmarks.length;

// ---------------------------------------------------------------------------
// Network delay simulation
// ---------------------------------------------------------------------------
function delay(): Promise<void> {
  const ms = 200 + Math.random() * 300; // 200~500ms
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// URL parsing utility
// ---------------------------------------------------------------------------
function parsePath(fullPath: string): { path: string; params: URLSearchParams } {
  const [path, queryString] = fullPath.split("?");
  return { path, params: new URLSearchParams(queryString || "") };
}

function matchRoute(
  path: string,
  pattern: string
): { matched: boolean; params: Record<string, string> } {
  const pathParts = path.split("/").filter(Boolean);
  const patternParts = pattern.split("/").filter(Boolean);

  if (pathParts.length !== patternParts.length) {
    return { matched: false, params: {} };
  }

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return { matched: false, params: {} };
    }
  }

  return { matched: true, params };
}

// ---------------------------------------------------------------------------
// Pagination helper
// ---------------------------------------------------------------------------
function paginate<T>(
  items: T[],
  page: number,
  limit: number
): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  const paginatedItems = items.slice(start, start + limit);

  return {
    items: paginatedItems,
    pagination: {
      total,
      page: safePage,
      limit,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1,
    },
  };
}

// ---------------------------------------------------------------------------
// Filter / Sort helpers
// ---------------------------------------------------------------------------
function applyAndFilters<T>(
  items: T[],
  andFilters: string | null
): T[] {
  if (!andFilters) return items;

  try {
    const filters: Record<string, unknown> = JSON.parse(andFilters);
    return items.filter((item) => {
      const rec = item as Record<string, unknown>;
      return Object.entries(filters).every(([key, value]) => rec[key] === value);
    });
  } catch {
    return items;
  }
}

function applySort<T>(
  items: T[],
  sortBy: string | null,
  sortDirection: string | null
): T[] {
  if (!sortBy) return items;

  const dir = sortDirection === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[sortBy];
    const bVal = (b as Record<string, unknown>)[sortBy];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * dir;
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * dir;
    }
    return String(aVal ?? "").localeCompare(String(bVal ?? "")) * dir;
  });
}

// ---------------------------------------------------------------------------
// Mock request handler
// ---------------------------------------------------------------------------
interface MockRequestOptions {
  method: string;
  body?: unknown;
}

export async function handleMockRequest<T>(
  fullPath: string,
  options: MockRequestOptions
): Promise<T> {
  await delay();

  const { path, params: searchParams } = parsePath(fullPath);
  const method = options.method.toUpperCase();
  const body = (options.body ?? {}) as Record<string, unknown>;

  // -----------------------------------------------------------------------
  // Auth
  // -----------------------------------------------------------------------
  if (path === "/v1/auth/email/signup" && method === "POST") {
    return mockAuthResponse as T;
  }

  if (path === "/v1/auth/email/signin" && method === "POST") {
    return mockAuthResponse as T;
  }

  if (path === "/v1/auth/refresh" && method === "POST") {
    return mockRefreshResponse as T;
  }

  if (path === "/v1/auth/me" && method === "GET") {
    return mockUser as T;
  }

  // -----------------------------------------------------------------------
  // Articles
  // -----------------------------------------------------------------------
  if (path === "/v1/data/articles" && method === "GET") {
    const andFilters = searchParams.get("andFilters");
    const sortBy = searchParams.get("sortBy");
    const sortDirection = searchParams.get("sortDirection");
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");

    let result = applyAndFilters(articles, andFilters);
    result = applySort(result, sortBy, sortDirection);
    return paginate(result, page, limit) as T;
  }

  const articleDetailMatch = matchRoute(path, "/v1/data/articles/:id");
  if (articleDetailMatch.matched && method === "GET") {
    const article = articles.find((a) => a.id === articleDetailMatch.params.id);
    if (!article) throw new Error("Article not found.");
    return article as T;
  }

  if (path === "/v1/data/articles" && method === "POST") {
    articleIdCounter++;
    const now = new Date().toISOString();
    const newArticle: Article = {
      id: `article-${articleIdCounter}`,
      title: (body.title as string) || "",
      content: (body.content as string) || "",
      coverImage: body.coverImage as string | undefined,
      category: body.category as string | undefined,
      isPublished: (body.isPublished as boolean) ?? false,
      tags: (body.tags as string[]) || [],
      createdBy: "user-1",
      createdAt: now,
      updatedAt: now,
    };
    articles.unshift(newArticle);
    return newArticle as T;
  }

  const articleUpdateMatch = matchRoute(path, "/v1/data/articles/:id");
  if (articleUpdateMatch.matched && method === "PATCH") {
    const idx = articles.findIndex((a) => a.id === articleUpdateMatch.params.id);
    if (idx === -1) throw new Error("Article not found.");
    articles[idx] = {
      ...articles[idx],
      ...body,
      id: articles[idx].id,
      createdBy: articles[idx].createdBy,
      createdAt: articles[idx].createdAt,
      updatedAt: new Date().toISOString(),
    };
    return articles[idx] as T;
  }

  const articleDeleteMatch = matchRoute(path, "/v1/data/articles/:id");
  if (articleDeleteMatch.matched && method === "DELETE") {
    articles = articles.filter((a) => a.id !== articleDeleteMatch.params.id);
    return undefined as T;
  }

  // -----------------------------------------------------------------------
  // Tags
  // -----------------------------------------------------------------------
  if (path === "/v1/data/tags" && method === "GET") {
    const sortBy = searchParams.get("sortBy");
    const sortDirection = searchParams.get("sortDirection");
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "50");

    const sorted = applySort(tags, sortBy, sortDirection);
    return paginate(sorted, page, limit) as T;
  }

  if (path === "/v1/data/tags" && method === "POST") {
    tagIdCounter++;
    const newTag: Tag = {
      id: `tag-${tagIdCounter}`,
      name: (body.name as string) || "",
      slug: (body.slug as string) || "",
      createdBy: "user-1",
      createdAt: new Date().toISOString(),
    };
    tags.push(newTag);
    return newTag as T;
  }

  const tagDeleteMatch = matchRoute(path, "/v1/data/tags/:id");
  if (tagDeleteMatch.matched && method === "DELETE") {
    tags = tags.filter((t) => t.id !== tagDeleteMatch.params.id);
    return undefined as T;
  }

  // -----------------------------------------------------------------------
  // Bookmarks
  // -----------------------------------------------------------------------
  if (path === "/v1/data/bookmarks" && method === "GET") {
    const andFilters = searchParams.get("andFilters");
    const sortBy = searchParams.get("sortBy");
    const sortDirection = searchParams.get("sortDirection");
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "20");

    let result = applyAndFilters(bookmarks, andFilters);
    result = applySort(result, sortBy, sortDirection);
    return paginate(result, page, limit) as T;
  }

  if (path === "/v1/data/bookmarks" && method === "POST") {
    bookmarkIdCounter++;
    const newBookmark: Bookmark = {
      id: `bookmark-${bookmarkIdCounter}`,
      articleId: (body.articleId as string) || "",
      createdBy: "user-1",
      createdAt: new Date().toISOString(),
    };
    bookmarks.push(newBookmark);
    return newBookmark as T;
  }

  const bookmarkDeleteMatch = matchRoute(path, "/v1/data/bookmarks/:id");
  if (bookmarkDeleteMatch.matched && method === "DELETE") {
    bookmarks = bookmarks.filter((b) => b.id !== bookmarkDeleteMatch.params.id);
    return undefined as T;
  }

  // -----------------------------------------------------------------------
  // Files
  // -----------------------------------------------------------------------
  if (path === "/v1/files/presigned-url" && method === "POST") {
    const filename = (body.filename as string) || "file.png";
    return createMockPresignedUrl(filename) as T;
  }

  if (path === "/v1/files" && method === "POST") {
    return createMockFileRecord(body) as T;
  }

  // -----------------------------------------------------------------------
  // Unmatched route
  // -----------------------------------------------------------------------
  throw new Error(`[Mock] Unhandled request: ${method} ${path}`);
}
