import { useQuery } from '@tanstack/react-query';
import { feedApi } from '../api/feed.api';
import { FeedFilters } from '../types/feed.types';

export function useFeed(filters?: FeedFilters) {
  return useQuery({
    queryKey: ['feed', filters],
    queryFn: () => feedApi.getFeed(filters),
    select: (response) => ({
      duas: response.data,
      meta: response.meta,
    }),
  });
}
