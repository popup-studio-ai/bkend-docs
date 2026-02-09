import type { AuthResponse, UserDto } from "@/application/dto/auth.dto";

const MOCK_USER: UserDto = {
  id: "user-1",
  email: "demo@bkend.ai",
  name: "Demo User",
  createdAt: "2025-01-15T09:00:00.000Z",
  updatedAt: "2025-01-15T09:00:00.000Z",
};

const MOCK_AUTH_RESPONSE: AuthResponse = {
  accessToken: "mock-access-token-xyz",
  refreshToken: "mock-refresh-token-xyz",
  user: MOCK_USER,
};

export function handleAuthRoutes(
  method: string,
  path: string,
  _body?: unknown
): unknown | null {
  if (method === "POST" && path === "/v1/auth/email/signup") {
    return { ...MOCK_AUTH_RESPONSE };
  }

  if (method === "POST" && path === "/v1/auth/email/signin") {
    return { ...MOCK_AUTH_RESPONSE };
  }

  if (method === "POST" && path === "/v1/auth/refresh") {
    return {
      accessToken: "mock-access-token-refreshed",
      refreshToken: "mock-refresh-token-refreshed",
      user: MOCK_USER,
    };
  }

  if (method === "GET" && path === "/v1/auth/me") {
    return { ...MOCK_USER };
  }

  return null;
}
