'use client';

import { useQuery } from '@tanstack/react-query';
import { bloodApi } from '../api/blood.api';
import { bloodKeys } from './query-keys';
import { BloodRequestQueryParams } from '../types/blood.types';

export function useBloodRequests(params?: BloodRequestQueryParams) {
  return useQuery({
    queryKey: bloodKeys.requestList(params),
    queryFn: async () => {
      const response = await bloodApi.getRequests(params);
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
