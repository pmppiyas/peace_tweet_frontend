import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkApi } from '../api/bookmark.api';
import { useAuth } from '@/hooks/useAuth';
import { SavedItemParams, TimeSlot } from '@/types/saved.types';

export function useSavedItems(params?: SavedItemParams) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['saved-items', params],
    queryFn: () => bookmarkApi.getSavedItems(params),
    select: (res) => ({
      items: res.data || [],
      meta: res.meta,
    }),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useBookmarks(params?: SavedItemParams) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['saved-duas', params],
    queryFn: () => bookmarkApi.getSavedDuas(params),
    select: (res) => ({
      items: res.data || [],
      meta: res.meta,
    }),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useUpdateTimeSlotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      type,
      timeSlot,
    }: {
      id: string;
      type: 'DUA' | 'POST';
      timeSlot: TimeSlot | null;
    }) => bookmarkApi.updateTimeSlot({ id, type, timeSlot }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-items'] });
      queryClient.invalidateQueries({ queryKey: ['saved-duas'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
