"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import {
  updateProfile,
  changePassword,
  deleteAccount,
  getAvatarUploadUrl,
} from "@/lib/api/users";
import { useAuthStore } from "@/stores/auth-store";
import { useSignOut } from "./use-auth";
import type { UpdateProfileRequest, ChangePasswordRequest } from "@/application/dto/user.dto";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateProfileRequest }) =>
      updateProfile(userId, data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
  });
}

export function useDeleteAccount() {
  const signOut = useSignOut();

  return useMutation({
    mutationFn: (userId: string) => deleteAccount(userId),
    onSuccess: () => {
      signOut();
    },
  });
}

export function useGetAvatarUploadUrl() {
  return useMutation({
    mutationFn: ({ userId, filename }: { userId: string; filename: string }) =>
      getAvatarUploadUrl(userId, filename),
  });
}
