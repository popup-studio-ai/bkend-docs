import { tokenStorage } from "@/infrastructure/storage/token-storage";
import { isMockMode, handleMockRequest } from "@/infrastructure/mock/mock-handler";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID ?? "";
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT ?? "dev";

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  skipAuth?: boolean;
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Project-Id": PROJECT_ID,
        "X-Environment": ENVIRONMENT,
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

export async function bkendFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  if (isMockMode()) {
    return handleMockRequest<T>(path, {
      method: (options.method as string) || "GET",
      body: options.body,
    });
  }

  const { body, skipAuth = false, headers: customHeaders, ...restOptions } = options;

  const headers: Record<string, string> = {
    "X-Project-Id": PROJECT_ID,
    "X-Environment": ENVIRONMENT,
    ...(customHeaders as Record<string, string>),
  };

  if (body !== undefined && body !== null) {
    headers["Content-Type"] = "application/json";
  }

  if (!skipAuth) {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let res = await fetch(`${API_URL}${path}`, {
    ...restOptions,
    headers,
    body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${path}`, {
        ...restOptions,
        headers,
        body:
          body !== undefined && body !== null
            ? JSON.stringify(body)
            : undefined,
      });
    } else {
      tokenStorage.clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
      throw new AuthError("Your session has expired. Please sign in again.");
    }
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message =
      errorBody.message || errorBody.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}
