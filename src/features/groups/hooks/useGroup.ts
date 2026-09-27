'use client';

import { useQuery } from '@tanstack/react-query';
import { groupsApi } from '../api/groups.api';
import { groupsKeys } from './query-keys';

export function useGroup(slugOrId: string) {
  return useQuery({
    queryKey: groupsKeys.detail(slugOrId),
    queryFn: async () => {
      if (!slugOrId) throw new Error('Group slug or ID is required');
      const response = await groupsApi.getGroupBySlug(slugOrId);
      return response.data;
    },
    enabled: Boolean(slugOrId),
    staleTime: 1000 * 60 * 3,
  });
}
