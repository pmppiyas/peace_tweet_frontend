'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { groupsApi } from '../api/groups.api';
import { groupsKeys } from './query-keys';

export function useGroupPosts(groupId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: groupsKeys.posts(groupId),
    queryFn: async ({ pageParam }) => {
      const response = await groupsApi.getGroupPosts(groupId, {
        limit: 20,
        cursor: pageParam ? String(pageParam) : undefined,
      });
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    enabled: Boolean(groupId) && enabled,
    staleTime: 1000 * 60 * 2,
  });
}
