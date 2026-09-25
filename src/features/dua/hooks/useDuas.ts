'use client';

import { useQuery } from '@tanstack/react-query';
import { duaApi } from '../api/dua.api';

export function useDuas(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['duas', params],
    queryFn: async () => {
      const res = await duaApi.getAllDuas(params);
      return {
        items: res.data || [],
        meta: res.meta,
      };
    },
  });
}
