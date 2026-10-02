'use client';

import { useQuery } from '@tanstack/react-query';
import { bloodApi } from '../api/blood.api';
import { bloodKeys } from './query-keys';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';

export function useDonorStatus() {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: bloodKeys.donorMode(),
    queryFn: async () => {
      const response = await bloodApi.getDonorMode();
      const data = response?.data;
      if (data && user) {
        useAuthStore.getState().setUser({
          ...user,
          isDonor: data.isDonor,
          donationCount: data.donationCount ?? user.donationCount ?? 0,
        });
      }
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}
