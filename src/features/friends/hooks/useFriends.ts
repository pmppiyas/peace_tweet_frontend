'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { friendsApi } from '../api/friends.api';
import { PaginatedFriendsResponse } from '../types/friends.types';

export const friendsKeys = {
  all: ['friends'] as const,
  list: (search?: string) => ['friends', 'list', { search: search || '' }] as const,
  receivedRequests: () => ['friends', 'requests', 'received'] as const,
  sentRequests: () => ['friends', 'requests', 'sent'] as const,
  status: (userId: string) => ['friends', 'status', userId] as const,
  profile: (username: string) => ['users', 'profile', username] as const,
};

// Hook for fetching paginated friends list with search
export function useFriends(search?: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: friendsKeys.list(search),
    queryFn: async ({ pageParam }) => {
      const response = await friendsApi.getFriends({
        limit: 20,
        cursor: pageParam ? String(pageParam) : undefined,
        search: search?.trim() || undefined,
      });
      // Handle both direct and enveloped API response structures
      const data = (response?.data as PaginatedFriendsResponse) || response;
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes fresh cache
  });
}
