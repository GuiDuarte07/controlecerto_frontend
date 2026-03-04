import { create } from "zustand";
import type { InfoUserResponse } from "@/types";
import { clearTokens, setTokens } from "@/lib/api/client";

interface AuthState {
  user: InfoUserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: InfoUserResponse) => void;
  login: (user: InfoUserResponse, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true }),

  login: (user, accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
