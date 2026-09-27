'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { groupsApi } from '../api/groups.api';
import { groupsKeys } from './query-keys';
import { GroupQueryParams } from '../types/groups.types';

export function useGroups(params?: { search?: string; limit?: number }) {
  const queryParams: GroupQueryParams = {
    search: params?.search?.trim() || undefined,
    limit: params?.limit || 20,
  };

  return useInfiniteQuery({
    queryKey: groupsKeys.list(queryParams),
    queryFn: async ({ pageParam }) => {
      const response = await groupsApi.getGroups({
        ...queryParams,
        cursor: pageParam ? String(pageParam) : undefined,
      });
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
  });
}
