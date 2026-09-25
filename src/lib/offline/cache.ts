import { Dua } from '@/types/dua.types';
import { storage } from '../storage/local-storage';

const OFFLINE_DUAS_KEY = 'peacetweet_offline_duas';

export const offlineCache = {
  getOfflineDuas(): Dua[] {
    return storage.get<Dua[]>(OFFLINE_DUAS_KEY, []);
  },

  cacheDuas(duas: Dua[]): void {
    const existing = this.getOfflineDuas();
    const map = new Map<string, Dua>();
    existing.forEach((d) => map.set(d.id, d));
    duas.forEach((d) => map.set(d.id, d));
    storage.set(OFFLINE_DUAS_KEY, Array.from(map.values()));
  },

  clearCache(): void {
    storage.remove(OFFLINE_DUAS_KEY);
  },
};
