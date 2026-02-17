import { bkendFetch } from "@/infrastructure/api/client";
import type { UserProfile } from "@/application/dto/auth.dto";
import type {
  UpdateProfileRequest,
  ChangePasswordRequest,
  AvatarUploadUrlRequest,
  AvatarUploadUrlResponse,
  UpdateAvatarRequest,
} from "@/application/dto/user.dto";

export async function updateProfile(
  userId: string,
  data: UpdateProfileRequest
): Promise<UserProfile> {
  return bkendFetch<UserProfile>(`/v1/users/${userId}/profile`, {
    method: "PATCH",
    body: data,
  });
}

export async function getAvatarUploadUrl(
  userId: string,
  data: AvatarUploadUrlRequest
): Promise<AvatarUploadUrlResponse> {
  return bkendFetch<AvatarUploadUrlResponse>(
    `/v1/users/${userId}/avatar/upload-url`,
    {
      method: "POST",
      body: data,
    }
  );
}

export async function updateAvatar(
  userId: string,
  data: UpdateAvatarRequest
): Promise<UserProfile> {
  return bkendFetch<UserProfile>(`/v1/users/${userId}/avatar`, {
    method: "PATCH",
    body: data,
  });
}

export async function changePassword(
  data: ChangePasswordRequest
): Promise<void> {
  return bkendFetch<void>("/v1/auth/password/change", {
    method: "POST",
    body: data,
  });
}

export async function deleteAccount(userId: string): Promise<void> {
  return bkendFetch<void>(`/v1/users/${userId}`, {
    method: "DELETE",
  });
}
