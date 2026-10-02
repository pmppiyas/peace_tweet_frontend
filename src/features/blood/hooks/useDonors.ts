'use client';

import { useQuery } from '@tanstack/react-query';
import { bloodApi } from '../api/blood.api';
import { bloodKeys } from './query-keys';
import { DonorQueryParams } from '../types/blood.types';

export function useDonors(params?: DonorQueryParams) {
  return useQuery({
    queryKey: bloodKeys.donorList(params),
    queryFn: async () => {
      const response = await bloodApi.getDonors(params);
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}
