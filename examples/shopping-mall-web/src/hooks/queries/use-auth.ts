"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import { tokenStorage } from "@/infrastructure/storage/token-storage";
import { queryKeys } from "./keys";
import type { SignInInput, SignUpInput } from "@/application/dto/auth.dto";

export function useMe() {
  const { setUser, setLoading } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      try {
        const user = await authApi.getMe();
        setUser(user);
        setLoading(false);
        return user;
      } catch {
        setUser(null);
        setLoading(false);
        return null;
      }
    },
    enabled: tokenStorage.hasTokens(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSignUp() {
  const { login } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SignUpInput) => authApi.signUp(input),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
      router.push("/products");
    },
  });
}

export function useSignIn() {
  const { login } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SignInInput) => authApi.signIn(input),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
      router.push("/products");
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    router.push("/signin");
  };
}
