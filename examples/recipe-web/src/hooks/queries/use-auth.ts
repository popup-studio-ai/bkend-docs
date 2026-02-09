"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import { tokenStorage } from "@/infrastructure/storage/token-storage";
import { queryKeys } from "./keys";
import type { SignInRequest, SignUpRequest } from "@/application/dto/auth.dto";

export function useMe() {
  const { setUser, setLoading } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      try {
        const user = await authApi.me();
        setUser(user);
        return user;
      } catch {
        setLoading(false);
        return null;
      }
    },
    enabled: tokenStorage.hasTokens(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSignIn() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInRequest) => authApi.signIn(data),
    onSuccess: (response) => {
      tokenStorage.setAccessToken(response.accessToken);
      tokenStorage.setRefreshToken(response.refreshToken);
      setUser(response.user);
      queryClient.setQueryData(queryKeys.auth.me, response.user);
      router.push("/recipes");
    },
  });
}

export function useSignUp() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<SignUpRequest, "method">) =>
      authApi.signUp({ ...data, method: "password" }),
    onSuccess: (response) => {
      tokenStorage.setAccessToken(response.accessToken);
      tokenStorage.setRefreshToken(response.refreshToken);
      setUser(response.user);
      queryClient.setQueryData(queryKeys.auth.me, response.user);
      router.push("/recipes");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    router.push("/signin");
  };
}
