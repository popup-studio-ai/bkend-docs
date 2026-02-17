"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { signUp, signIn, getMe } from "@/lib/api/auth";
import { tokenStorage } from "@/infrastructure/storage/token-storage";
import { useAuthStore } from "@/stores/auth-store";
import type { SignInRequest } from "@/application/dto/auth.dto";

export function useMe() {
  const hasToken = typeof window !== "undefined" && tokenStorage.hasTokens();

  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getMe,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: SignInRequest) => signIn(data),
    onSuccess: async (authResponse) => {
      tokenStorage.setTokens(authResponse.accessToken, authResponse.refreshToken);

      // Ensure localStorage write completes
      await new Promise(resolve => setTimeout(resolve, 10));

      const user = await getMe();
      setUser(user);
      queryClient.setQueryData(queryKeys.auth.me(), user);
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string }) =>
      signUp(data),
    onSuccess: async (authResponse) => {
      tokenStorage.setTokens(authResponse.accessToken, authResponse.refreshToken);

      // Ensure localStorage write completes
      await new Promise(resolve => setTimeout(resolve, 10));

      const user = await getMe();
      setUser(user);
      queryClient.setQueryData(queryKeys.auth.me(), user);
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((s) => s.clearUser);

  return () => {
    tokenStorage.clearTokens();
    clearUser();
    queryClient.clear();
    window.location.href = "/sign-in";
  };
}
