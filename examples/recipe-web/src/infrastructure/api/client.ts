import { tokenStorage } from "@/infrastructure/storage/token-storage";
import { isMockMode, handleMockRequest } from "@/infrastructure/mock/mock-handler";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID!;
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || "dev";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  skipAuth?: boolean;
}

interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

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
    window.location.href = "/signin";
    throw new Error("Token refresh failed");
  }

  const data = await response.json();
  tokenStorage.setAccessToken(data.accessToken);
  if (data.refreshToken) {
    tokenStorage.setRefreshToken(data.refreshToken);
  }
  return data.accessToken;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  if (isMockMode()) {
    return handleMockRequest<T>(endpoint, { method: options.method, body: options.body });
  }

  const { body, skipAuth = false, headers: customHeaders, ...rest } = options;

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
    ...rest,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  let response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401 && !skipAuth) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        onTokenRefreshed(newToken);
        headers["Authorization"] = `Bearer ${newToken}`;
        response = await fetch(`${BASE_URL}${endpoint}`, {
          ...config,
          headers,
        });
      } catch {
        isRefreshing = false;
        tokenStorage.clear();
        window.location.href = "/signin";
        throw new Error("Authentication failed");
      }
    } else {
      const newToken = await new Promise<string>((resolve) => {
        subscribeTokenRefresh(resolve);
      });
      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(`${BASE_URL}${endpoint}`, {
        ...config,
        headers,
      });
    }
  }

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      statusCode: response.status,
      message: response.statusText,
    }));
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
