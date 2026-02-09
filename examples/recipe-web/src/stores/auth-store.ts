import { create } from "zustand";
import type { UserProfile } from "@/application/dto/auth.dto";
import { tokenStorage } from "@/infrastructure/storage/token-storage";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({ user, isAuthenticated: true, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () => {
    tokenStorage.clear();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
