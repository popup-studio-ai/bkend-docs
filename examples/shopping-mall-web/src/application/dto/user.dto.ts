export interface UpdateProfileRequest {
  name: string;
  image?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UploadUrlResponse {
  url: string;
  key: string;
}
