import { APP_CONFIG } from '@/constants/config';
import { storage } from '../storage/local-storage';

export const tokenStorage = {
  getAccessToken(): string | null {
    return storage.get<string | null>(APP_CONFIG.ACCESS_TOKEN_KEY, null);
  },

  setAccessToken(token: string): void {
    storage.set(APP_CONFIG.ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken(): string | null {
    return storage.get<string | null>(APP_CONFIG.REFRESH_TOKEN_KEY, null);
  },

  setRefreshToken(token: string): void {
    storage.set(APP_CONFIG.REFRESH_TOKEN_KEY, token);
  },

  clearTokens(): void {
    storage.remove(APP_CONFIG.ACCESS_TOKEN_KEY);
    storage.remove(APP_CONFIG.REFRESH_TOKEN_KEY);
  },
};
