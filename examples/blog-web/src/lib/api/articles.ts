import { bkendFetch } from "@/infrastructure/api/client";
import type {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleFilters,
} from "@/application/dto/article.dto";
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/application/dto/pagination.dto";

interface GetArticlesParams extends PaginationParams {
  filters?: ArticleFilters;
}

export async function getArticles(
  params: GetArticlesParams = {}
): Promise<PaginatedResponse<Article>> {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortDirection = "desc",
    filters,
  } = params;

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy,
    sortDirection,
  });

  if (filters && Object.keys(filters).length > 0) {
    const cleanFilters: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        cleanFilters[key] = value;
      }
    }
    if (Object.keys(cleanFilters).length > 0) {
      searchParams.set("andFilters", JSON.stringify(cleanFilters));
    }
  }

  return bkendFetch<PaginatedResponse<Article>>(
    `/v1/data/articles?${searchParams.toString()}`
  );
}

export async function getArticle(id: string): Promise<Article> {
  return bkendFetch<Article>(`/v1/data/articles/${id}`);
}

export async function createArticle(
  data: CreateArticleRequest
): Promise<Article> {
  return bkendFetch<Article>("/v1/data/articles", {
    method: "POST",
    body: data,
  });
}

export async function updateArticle(
  id: string,
  data: UpdateArticleRequest
): Promise<Article> {
  return bkendFetch<Article>(`/v1/data/articles/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteArticle(id: string): Promise<void> {
  return bkendFetch<void>(`/v1/data/articles/${id}`, {
    method: "DELETE",
  });
}

// --- Public (no auth required) ---

export async function getPublishedArticles(
  params: { page?: number; limit?: number } = {}
): Promise<PaginatedResponse<Article>> {
  const { page = 1, limit = 10 } = params;

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: "createdAt",
    sortDirection: "desc",
    andFilters: JSON.stringify({ isPublished: true }),
  });

  return bkendFetch<PaginatedResponse<Article>>(
    `/v1/data/articles?${searchParams.toString()}`,
    { skipAuth: true }
  );
}

export async function getPublishedArticle(id: string): Promise<Article> {
  return bkendFetch<Article>(`/v1/data/articles/${id}`, {
    skipAuth: true,
  });
}
