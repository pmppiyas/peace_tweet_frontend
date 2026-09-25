'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { feedApi } from '../api/feed.api';
import { FeedFilters, PostType } from '../types/feed.types';

export function useFeed(typeFilter?: PostType) {
  return useInfiniteQuery({
    queryKey: ['feed', { type: typeFilter }],
    queryFn: async ({ pageParam }) => {
      const filters: FeedFilters = {
        limit: 20,
        cursor: pageParam ? String(pageParam) : undefined,
        type: typeFilter,
      };
      const response = await feedApi.getFeed(filters);
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2, // 2 minutes fresh cache
  });
}
