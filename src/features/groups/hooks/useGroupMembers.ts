'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { groupsApi } from '../api/groups.api';
import { groupsKeys } from './query-keys';
import { GroupMemberRole, MemberQueryParams } from '../types/groups.types';

export function useGroupMembers(
  groupId: string,
  params?: { search?: string; role?: GroupMemberRole; limit?: number },
) {
  const queryParams: MemberQueryParams = {
    search: params?.search?.trim() || undefined,
    role: params?.role,
    limit: params?.limit || 20,
  };

  return useInfiniteQuery({
    queryKey: groupsKeys.members(groupId, queryParams),
    queryFn: async ({ pageParam }) => {
      const response = await groupsApi.getMembers(groupId, {
        ...queryParams,
        cursor: pageParam ? String(pageParam) : undefined,
      });
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    enabled: Boolean(groupId),
    staleTime: 1000 * 60 * 2,
  });
}
