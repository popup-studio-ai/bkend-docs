export interface UpdateProfileRequest {
  name: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AvatarUploadUrlRequest {
  filename: string;
  contentType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
}

export interface AvatarUploadUrlResponse {
  url: string;
  key: string;
}

export interface UpdateAvatarRequest {
  s3Key: string;
}
