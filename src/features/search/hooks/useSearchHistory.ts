'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchApi } from '../api/search.api';
import { AddSearchHistoryInput, SearchHistoryItem } from '../types/search.types';
import { useAuth } from '@/hooks/useAuth';

const LOCAL_STORAGE_KEY = 'peacetweet_guest_search_history';

function getGuestHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestHistory(items: SearchHistoryItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items.slice(0, 15)));
  } catch {
    // Ignore storage quota errors
  }
}

export function useSearchHistory() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const historyQuery = useQuery<SearchHistoryItem[]>({
    queryKey: ['searchHistory', isAuthenticated],
    queryFn: async () => {
      if (isAuthenticated) {
        try {
          return await searchApi.getSearchHistory(15);
        } catch {
          return getGuestHistory();
        }
      }
      return getGuestHistory();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Optimistic Add to History
  const addMutation = useMutation({
    mutationFn: async (input: AddSearchHistoryInput) => {
      if (isAuthenticated) {
        return await searchApi.addSearchHistory(input);
      }
      // Guest fallback
      const newItem: SearchHistoryItem = {
        id: `guest_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        userId: 'guest',
        query: input.query,
        entityType: input.entityType || 'KEYWORD',
        entityId: input.entityId || null,
        entityName: input.entityName || null,
        entityAvatar: input.entityAvatar || null,
        entitySubtext: input.entitySubtext || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const prev = getGuestHistory().filter(
        (h) => h.query.toLowerCase() !== input.query.toLowerCase(),
      );
      const updated = [newItem, ...prev];
      saveGuestHistory(updated);
      return newItem;
    },
    onMutate: async (newInput) => {
      await queryClient.cancelQueries({ queryKey: ['searchHistory', isAuthenticated] });
      const previousHistory =
        queryClient.getQueryData<SearchHistoryItem[]>(['searchHistory', isAuthenticated]) || [];

      // Deduplicate: remove identical query if exists, then prepend to top
      const filtered = previousHistory.filter(
        (item) => item.query.toLowerCase() !== newInput.query.toLowerCase(),
      );

      const optimisticItem: SearchHistoryItem = {
        id: `temp_${Date.now()}`,
        userId: 'me',
        query: newInput.query,
        entityType: newInput.entityType || 'KEYWORD',
        entityId: newInput.entityId || null,
        entityName: newInput.entityName || null,
        entityAvatar: newInput.entityAvatar || null,
        entitySubtext: newInput.entitySubtext || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<SearchHistoryItem[]>(
        ['searchHistory', isAuthenticated],
        [optimisticItem, ...filtered],
      );

      return { previousHistory };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(
          ['searchHistory', isAuthenticated],
          context.previousHistory,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory', isAuthenticated] });
    },
  });

  // Optimistic Single Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isAuthenticated && !id.startsWith('guest_') && !id.startsWith('temp_')) {
        return await searchApi.deleteSearchHistoryItem(id);
      }
      const updated = getGuestHistory().filter((item) => item.id !== id);
      saveGuestHistory(updated);
      return true;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['searchHistory', isAuthenticated] });
      const previousHistory =
        queryClient.getQueryData<SearchHistoryItem[]>(['searchHistory', isAuthenticated]) || [];

      queryClient.setQueryData<SearchHistoryItem[]>(
        ['searchHistory', isAuthenticated],
        previousHistory.filter((item) => item.id !== id),
      );

      return { previousHistory };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(
          ['searchHistory', isAuthenticated],
          context.previousHistory,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory', isAuthenticated] });
    },
  });

  // Optimistic Clear All
  const clearMutation = useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        return await searchApi.clearSearchHistory();
      }
      saveGuestHistory([]);
      return true;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['searchHistory', isAuthenticated] });
      const previousHistory =
        queryClient.getQueryData<SearchHistoryItem[]>(['searchHistory', isAuthenticated]) || [];

      queryClient.setQueryData<SearchHistoryItem[]>(
        ['searchHistory', isAuthenticated],
        [],
      );

      return { previousHistory };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(
          ['searchHistory', isAuthenticated],
          context.previousHistory,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory', isAuthenticated] });
    },
  });

  return {
    history: historyQuery.data || [],
    isLoading: historyQuery.isLoading,
    addHistory: addMutation.mutate,
    deleteHistoryItem: deleteMutation.mutate,
    clearAllHistory: clearMutation.mutate,
  };
}
