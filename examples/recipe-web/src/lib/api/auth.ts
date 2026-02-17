import { bkendFetch } from "@/infrastructure/api/client";
import type {
  SignUpRequest,
  SignInRequest,
  AuthResponse,
  UserProfile,
} from "@/application/dto/auth.dto";

export async function signUp(data: Omit<SignUpRequest, "method">): Promise<AuthResponse> {
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
