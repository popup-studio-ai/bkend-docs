import { bkendFetch } from "@/infrastructure/api/client";
import type { UserProfile } from "@/application/dto/auth.dto";
import type {
  UpdateProfileRequest,
  ChangePasswordRequest,
  UploadUrlResponse,
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

export async function getAvatarUploadUrl(
  userId: string,
  filename: string
): Promise<UploadUrlResponse> {
  return bkendFetch<UploadUrlResponse>(
    `/v1/users/${userId}/avatar/upload-url`,
    {
      method: "POST",
      body: { filename },
    }
  );
}
