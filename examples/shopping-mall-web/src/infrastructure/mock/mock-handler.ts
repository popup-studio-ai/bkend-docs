/**
 * Mock mode handler
 *
 * When NEXT_PUBLIC_MOCK_MODE=true environment variable is set,
 * operates with in-memory mock data without actual API calls.
 */

import type { PaginatedResponse, PaginationDto } from "@/application/dto/pagination.dto";
import { handleAuthRoutes } from "./data/auth.mock";
import {
  getProducts,
  findProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./data/products.mock";
import {
  getCarts,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "./data/carts.mock";
import {
  getOrders,
  findOrder,
  createOrder,
  updateOrderStatus,
} from "./data/orders.mock";
import {
  getReviews,
  createReview,
  deleteReview,
} from "./data/reviews.mock";
import { handleFilesRoutes } from "./data/files.mock";

export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_MOCK_MODE === "true";
}

interface MockRequestOptions {
  method?: string;
  body?: unknown;
}

// --- URL parsing util ---

interface ParsedUrl {
  pathname: string;
  searchParams: URLSearchParams;
}

function parseEndpoint(endpoint: string): ParsedUrl {
  const [pathname, queryString] = endpoint.split("?");
  return {
    pathname,
    searchParams: new URLSearchParams(queryString || ""),
  };
}

interface RouteMatch {
  params: Record<string, string>;
}

function matchRoute(pathname: string, pattern: string): RouteMatch | null {
  const pathParts = pathname.split("/").filter(Boolean);
  const patternParts = pattern.split("/").filter(Boolean);

  if (pathParts.length !== patternParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return { params };
}

// --- Pagination util ---

function paginate<T>(
  items: T[],
  searchParams: URLSearchParams
): PaginatedResponse<T> {
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const sortBy = searchParams.get("sortBy");
  const sortDirection = searchParams.get("sortDirection") || "desc";

  let filtered = [...items];

  // Parse andFilters
  const andFiltersStr = searchParams.get("andFilters");
  if (andFiltersStr) {
    try {
      const filters = JSON.parse(andFiltersStr) as Record<string, unknown>;
      for (const [key, value] of Object.entries(filters)) {
        filtered = filtered.filter((item) => {
          const itemValue = (item as Record<string, unknown>)[key];
          return String(itemValue) === String(value);
        });
      }
    } catch {
      // Ignore parse errors
    }
  }

  // Sort
  if (sortBy) {
    filtered.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortBy];
      const bVal = (b as Record<string, unknown>)[sortBy];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let cmp = 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  const pagination: PaginationDto = {
    total,
    page,
    limit,
    totalPages,
  };

  return { items: paged, pagination };
}

// --- Delay util (simulates real API feel) ---

function delay(ms: number = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Main handler ---

export async function handleMockRequest<T>(
  endpoint: string,
  options: MockRequestOptions = {}
): Promise<T> {
  await delay();

  const method = (options.method || "GET").toUpperCase();
  const body = options.body as Record<string, unknown> | undefined;
  const { pathname, searchParams } = parseEndpoint(endpoint);

  // --- Auth ---
  const authResult = handleAuthRoutes(method, pathname, body);
  if (authResult !== null) return authResult as T;

  // --- Files ---
  const filesResult = handleFilesRoutes(method, pathname, body);
  if (filesResult !== null) return filesResult as T;

  // --- Products ---
  if (method === "GET" && pathname === "/v1/data/products") {
    return paginate(getProducts(), searchParams) as T;
  }

  const productDetailMatch = matchRoute(pathname, "/v1/data/products/:id");
  if (productDetailMatch) {
    const { id } = productDetailMatch.params;

    if (method === "GET") {
      const product = findProduct(id);
      if (!product) throw mockNotFound("Product not found.");
      return product as T;
    }
    if (method === "PATCH") {
      const updated = updateProduct(id, body || {});
      if (!updated) throw mockNotFound("Product not found.");
      return updated as T;
    }
    if (method === "DELETE") {
      const deleted = deleteProduct(id);
      if (!deleted) throw mockNotFound("Product not found.");
      return undefined as T;
    }
  }

  if (method === "POST" && pathname === "/v1/data/products") {
    return createProduct(body || {}) as T;
  }

  // --- Carts ---
  if (method === "GET" && pathname === "/v1/data/carts") {
    return paginate(getCarts(), searchParams) as T;
  }

  if (method === "POST" && pathname === "/v1/data/carts") {
    return addCartItem(body || {}) as T;
  }

  const cartDetailMatch = matchRoute(pathname, "/v1/data/carts/:id");
  if (cartDetailMatch) {
    const { id } = cartDetailMatch.params;

    if (method === "PATCH") {
      const updated = updateCartItem(id, body || {});
      if (!updated) throw mockNotFound("Cart item not found.");
      return updated as T;
    }
    if (method === "DELETE") {
      const deleted = removeCartItem(id);
      if (!deleted) throw mockNotFound("Cart item not found.");
      return undefined as T;
    }
  }

  // --- Orders ---
  if (method === "GET" && pathname === "/v1/data/orders") {
    return paginate(getOrders(), searchParams) as T;
  }

  if (method === "POST" && pathname === "/v1/data/orders") {
    return createOrder(body || {}) as T;
  }

  const orderDetailMatch = matchRoute(pathname, "/v1/data/orders/:id");
  if (orderDetailMatch) {
    const { id } = orderDetailMatch.params;

    if (method === "GET") {
      const order = findOrder(id);
      if (!order) throw mockNotFound("Order not found.");
      return order as T;
    }
    if (method === "PATCH") {
      try {
        const updated = updateOrderStatus(id, body || {});
        if (!updated) throw mockNotFound("Order not found.");
        return updated as T;
      } catch (e) {
        throw mockBadRequest((e as Error).message);
      }
    }
  }

  // --- Reviews ---
  if (method === "GET" && pathname === "/v1/data/reviews") {
    return paginate(getReviews(), searchParams) as T;
  }

  if (method === "POST" && pathname === "/v1/data/reviews") {
    return createReview(body || {}) as T;
  }

  const reviewDetailMatch = matchRoute(pathname, "/v1/data/reviews/:id");
  if (reviewDetailMatch) {
    const { id } = reviewDetailMatch.params;

    if (method === "DELETE") {
      const deleted = deleteReview(id);
      if (!deleted) throw mockNotFound("Review not found.");
      return undefined as T;
    }
  }

  // --- No match ---
  console.warn(`[Mock] Unmatched request: ${method} ${pathname}`);
  throw mockNotFound(`No mock handler: ${method} ${pathname}`);
}

// --- Error util ---

class MockApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = { message };
  }
}

function mockNotFound(message: string): MockApiError {
  return new MockApiError(404, message);
}

function mockBadRequest(message: string): MockApiError {
  return new MockApiError(400, message);
}
