export interface UpdateProfileRequest {
  name: string;
  image?: string; // Backend uses 'image' field, not 'avatarUrl'
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UploadUrlResponse {
  url: string;
  key: string;
}
