'use client';

import { useQuery } from '@tanstack/react-query';
import { bloodApi } from '../api/blood.api';
import { bloodKeys } from './query-keys';

export function useBloodRequest(id: string) {
  return useQuery({
    queryKey: bloodKeys.requestDetail(id),
    queryFn: async () => {
      const response = await bloodApi.getRequestById(id);
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}
