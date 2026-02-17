export interface SignUpRequest {
  method: "password";
  email: string;
  password: string;
  name: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  image?: string; // Backend uses 'image' field, not 'avatarUrl'
  createdAt: string;
  updatedAt: string;
}
