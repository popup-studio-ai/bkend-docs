import { tokenStorage } from "@/infrastructure/storage/token-storage";
import { isMockMode, handleMockRequest } from "@/infrastructure/mock/mock-handler";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID!;
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || "dev";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  skipAuth?: boolean;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Project-Id": PROJECT_ID,
        "X-Environment": ENVIRONMENT,
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      tokenStorage.clear();
      return false;
    }

    const data: RefreshResponse = await response.json();
    tokenStorage.setAccessToken(data.accessToken);
    tokenStorage.setRefreshToken(data.refreshToken);
    return true;
  } catch {
    tokenStorage.clear();
    return false;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  if (isMockMode()) {
    return handleMockRequest<T>(endpoint, {
      method: options.method || "GET",
      body: options.body,
    });
  }

  const { body, skipAuth = false, headers: customHeaders, ...restOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Project-Id": PROJECT_ID,
    "X-Environment": ENVIRONMENT,
    ...((customHeaders as Record<string, string>) || {}),
  };

  if (!skipAuth) {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  const config: RequestInit = {
    ...restOptions,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  let response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401 && !skipAuth) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken();
    }

    const refreshed = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;

    if (refreshed) {
      const newToken = tokenStorage.getAccessToken();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
      }
      response = await fetch(`${BASE_URL}${endpoint}`, {
        ...config,
        headers,
      });
    } else {
      tokenStorage.clear();
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
      throw new Error("Session expired. Please sign in again.");
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorBody.message || `Request failed (${response.status})`,
      errorBody
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}
