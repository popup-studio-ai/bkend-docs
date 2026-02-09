import type { AuthResponse, UserProfile } from "@/application/dto/auth.dto";

export const mockUser: UserProfile = {
  id: "user-1",
  email: "demo@bkend.ai",
  name: "Demo User",
  avatarUrl: "https://picsum.photos/seed/avatar-1/200/200",
  createdAt: "2025-01-15T09:00:00.000Z",
  updatedAt: "2025-01-15T09:00:00.000Z",
};

export const mockAuthResponse: AuthResponse = {
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  tokenType: "Bearer",
  expiresIn: 3600,
};

export const mockRefreshResponse: AuthResponse = {
  accessToken: "mock-new-access-token",
  refreshToken: "mock-new-refresh-token",
  tokenType: "Bearer",
  expiresIn: 3600,
};
