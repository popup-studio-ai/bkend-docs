"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { signUp, signIn, getMe, googleCallback } from "@/lib/api/auth";
import { tokenStorage } from "@/infrastructure/storage/token-storage";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import type { SignInRequest, GoogleCallbackRequest } from "@/application/dto/auth.dto";

export function useMe() {
  const hasToken = typeof window !== "undefined" && tokenStorage.hasTokens();
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getMe,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
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
      await new Promise(resolve => setTimeout(resolve, 10));
      const user = await getMe();
      setUser(user);
      queryClient.setQueryData(queryKeys.auth.me(), user);
    },
  });
}

export function useGoogleCallback() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: GoogleCallbackRequest) => googleCallback(data),
    onSuccess: async (oauthResponse) => {
      tokenStorage.setTokens(oauthResponse.accessToken, oauthResponse.refreshToken);
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
  const resetCart = useCartStore((s) => s.setItemCount);

  return () => {
    tokenStorage.clearTokens();
    clearUser();
    resetCart(0);
    queryClient.clear();
    window.location.href = "/";
  };
}
