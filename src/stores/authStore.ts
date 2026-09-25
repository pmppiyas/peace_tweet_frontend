import { create } from 'zustand';
import { sessionStorage } from '@/lib/auth/session';
import { tokenStorage } from '@/lib/auth/token';
import { User } from '@/types/user.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    if (user) {
      sessionStorage.setUser(user);
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      sessionStorage.clearUser();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setTokens: (accessToken, refreshToken) => {
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);
  },

  logout: () => {
    tokenStorage.clearTokens();
    sessionStorage.clearUser();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  initialize: () => {
    const token = tokenStorage.getAccessToken();
    const user = sessionStorage.getUser();
    if (token && user) {
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
