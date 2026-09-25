import { APP_CONFIG } from '@/constants/config';
import { User } from '@/types/user.types';
import { storage } from '../storage/local-storage';

export const sessionStorage = {
  getUser(): User | null {
    return storage.get<User | null>(APP_CONFIG.USER_STORAGE_KEY, null);
  },

  setUser(user: User): void {
    storage.set(APP_CONFIG.USER_STORAGE_KEY, user);
  },

  clearUser(): void {
    storage.remove(APP_CONFIG.USER_STORAGE_KEY);
  },
};
