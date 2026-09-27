'use client';

import { useQuery } from '@tanstack/react-query';
import { groupsApi } from '../api/groups.api';
import { groupsKeys } from './query-keys';
import { useAuth } from '@/hooks/useAuth';

export function useGroupMembership(groupId: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: groupsKeys.membership(groupId),
    queryFn: async () => {
      if (!groupId) throw new Error('Group ID is required');
      const response = await groupsApi.getMembershipStatus(groupId);
      return response.data;
    },
    enabled: Boolean(groupId) && isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });
}
