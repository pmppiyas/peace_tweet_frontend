import { useQuery } from '@tanstack/react-query';
import { bookmarkApi } from '../api/bookmark.api';
import { useAuth } from '@/hooks/useAuth';

export function useBookmarks(params?: { page?: number; limit?: number; search?: string }) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['saved-duas', params],
    queryFn: () => bookmarkApi.getSavedDuas(params),
    select: (res) => ({
      items: res.data,
      meta: res.meta,
    }),
    enabled: isAuthenticated,
  });
}
