'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { feedApi } from '../api/feed.api';
import { FeedFilters, PostType } from '../types/feed.types';

export function useFeed(filtersOrType?: PostType | FeedFilters) {
  const filters: FeedFilters =
    typeof filtersOrType === 'string'
      ? { type: filtersOrType }
      : filtersOrType || {};

  return useInfiniteQuery({
    queryKey: ['feed', filters],
    queryFn: async ({ pageParam }) => {
      const response = await feedApi.getFeed({
        ...filters,
        cursor: pageParam ? String(pageParam) : undefined,
      });
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2, // 2 minutes fresh cache
  });
}
