import { create } from "zustand";
import type { UserDto } from "@/application/dto/auth.dto";
import { tokenStorage } from "@/infrastructure/storage/token-storage";

interface AuthState {
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserDto | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: UserDto, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  setLoading: (isLoading) => set({ isLoading }),

  login: (user, accessToken, refreshToken) => {
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    tokenStorage.clear();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
