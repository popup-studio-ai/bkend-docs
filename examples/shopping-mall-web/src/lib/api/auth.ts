import { apiClient } from "@/infrastructure/api/client";
import type { AuthResponse, SignInInput, SignUpInput, UserDto } from "@/application/dto/auth.dto";

export const authApi = {
  signUp(input: SignUpInput): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/v1/auth/email/signup", {
      method: "POST",
      body: {
        method: "password",
        email: input.email,
        password: input.password,
        name: input.name,
      },
      skipAuth: true,
    });
  },

  signIn(input: SignInInput): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/v1/auth/email/signin", {
      method: "POST",
      body: {
        email: input.email,
        password: input.password,
      },
      skipAuth: true,
    });
  },

  getMe(): Promise<UserDto> {
    return apiClient<UserDto>("/v1/auth/me");
  },

  refresh(refreshToken: string): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/v1/auth/refresh", {
      method: "POST",
      body: { refreshToken },
      skipAuth: true,
    });
  },
};
