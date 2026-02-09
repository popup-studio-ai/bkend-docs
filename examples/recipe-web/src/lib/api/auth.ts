import { apiClient } from "@/infrastructure/api/client";
import type {
  SignUpRequest,
  SignInRequest,
  AuthResponse,
  UserProfile,
} from "@/application/dto/auth.dto";

export const authApi = {
  signUp(data: SignUpRequest): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/v1/auth/email/signup", {
      method: "POST",
      body: data,
      skipAuth: true,
    });
  },

  signIn(data: SignInRequest): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/v1/auth/email/signin", {
      method: "POST",
      body: data,
      skipAuth: true,
    });
  },

  me(): Promise<UserProfile> {
    return apiClient<UserProfile>("/v1/auth/me");
  },
};
