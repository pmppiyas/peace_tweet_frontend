'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { friendsApi } from '../api/friends.api';
import { PaginatedFriendRequestsResponse } from '../types/friends.types';
import { friendsKeys } from './useFriends';

// Hook for fetching received pending friend requests
export function useReceivedFriendRequests(enabled = true) {
  return useInfiniteQuery({
    queryKey: friendsKeys.receivedRequests(),
    queryFn: async ({ pageParam }) => {
      const response = await friendsApi.getReceivedFriendRequests({
        limit: 20,
        cursor: pageParam ? String(pageParam) : undefined,
      });
      const data =
        (response?.data as PaginatedFriendRequestsResponse) || response;
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    enabled,
    staleTime: 1000 * 60, // 1 minute
  });
}

// Hook for fetching sent pending friend requests
export function useSentFriendRequests(enabled = true) {
  return useInfiniteQuery({
    queryKey: friendsKeys.sentRequests(),
    queryFn: async ({ pageParam }) => {
      const response = await friendsApi.getSentFriendRequests({
        limit: 20,
        cursor: pageParam ? String(pageParam) : undefined,
      });
      const data =
        (response?.data as PaginatedFriendRequestsResponse) || response;
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    enabled,
    staleTime: 1000 * 60, // 1 minute
  });
}

// Hook for fetching count of received requests (for badge display)
export function usePendingRequestsCount(enabled = true) {
  return useQuery({
    queryKey: [...friendsKeys.receivedRequests(), 'count'],
    queryFn: async () => {
      const response = await friendsApi.getReceivedFriendRequests({ limit: 50 });
      const data =
        (response?.data as PaginatedFriendRequestsResponse) || response;
      return data?.items?.length || 0;
    },
    enabled,
    staleTime: 1000 * 30, // 30 seconds
  });
}
