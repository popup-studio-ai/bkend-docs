import { bkendFetch } from "@/infrastructure/api/client";
import type {
  SignInRequest,
  AuthResponse,
  UserProfile,
  GoogleCallbackRequest,
  OAuthResponse,
} from "@/application/dto/auth.dto";

export async function signUp(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
  return bkendFetch<AuthResponse>("/v1/auth/email/signup", {
    method: "POST",
    body: { method: "password", ...data },
    skipAuth: true,
  });
}

export async function signIn(data: SignInRequest): Promise<AuthResponse> {
  return bkendFetch<AuthResponse>("/v1/auth/email/signin", {
    method: "POST",
    body: { method: "password", ...data },
    skipAuth: true,
  });
}

export async function getMe(): Promise<UserProfile> {
  return bkendFetch<UserProfile>("/v1/auth/me");
}

export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  return bkendFetch<AuthResponse>("/v1/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    skipAuth: true,
  });
}

export async function googleCallback(data: GoogleCallbackRequest): Promise<OAuthResponse> {
  return bkendFetch<OAuthResponse>("/v1/auth/google/callback", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}
