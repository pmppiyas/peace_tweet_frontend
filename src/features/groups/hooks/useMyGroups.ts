'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { groupsApi } from '../api/groups.api';
import { groupsKeys } from './query-keys';
import { GroupQueryParams } from '../types/groups.types';
import { useAuth } from '@/hooks/useAuth';

export function useMyGroups(params?: { search?: string; limit?: number }) {
  const { isAuthenticated } = useAuth();
  const queryParams: GroupQueryParams = {
    search: params?.search?.trim() || undefined,
    limit: params?.limit || 20,
  };

  return useInfiniteQuery({
    queryKey: groupsKeys.myGroups(queryParams),
    queryFn: async ({ pageParam }) => {
      const response = await groupsApi.getMyGroups({
        ...queryParams,
        cursor: pageParam ? String(pageParam) : undefined,
      });
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });
}
