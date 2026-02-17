"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import {
  updateProfile,
  getAvatarUploadUrl,
  updateAvatar,
  changePassword,
  deleteAccount
} from "@/lib/api/users";
import { useAuthStore } from "@/stores/auth-store";
import { useSignOut } from "./use-auth";
import type {
  UpdateProfileRequest,
  ChangePasswordRequest,
  AvatarUploadUrlRequest,
  UpdateAvatarRequest,
} from "@/application/dto/user.dto";

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

export function useGetAvatarUploadUrl() {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: AvatarUploadUrlRequest }) =>
      getAvatarUploadUrl(userId, data),
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateAvatarRequest }) =>
      updateAvatar(userId, data),
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
