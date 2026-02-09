import type { AuthResponse, UserProfile } from "@/application/dto/auth.dto";

export const MOCK_USER: UserProfile = {
  id: "mock-user-001",
  email: "demo@bkend.ai",
  name: "Demo Chef",
  createdAt: "2025-01-15T09:00:00.000Z",
  updatedAt: "2025-02-01T12:00:00.000Z",
};

export const MOCK_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2NrLXVzZXItMDAxIiwiZW1haWwiOiJjaGVmQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA5MDAwMDAwLCJleHAiOjE3MDkwODY0MDB9.mock-signature";

export const MOCK_REFRESH_TOKEN = "mock-refresh-token-abc123";

export function createAuthResponse(): AuthResponse {
  return {
    accessToken: MOCK_ACCESS_TOKEN,
    refreshToken: MOCK_REFRESH_TOKEN,
    user: MOCK_USER,
  };
}

export function createMeResponse(): UserProfile {
  return { ...MOCK_USER };
}
