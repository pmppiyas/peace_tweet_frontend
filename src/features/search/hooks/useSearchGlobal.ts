'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../api/search.api';
import { GlobalSearchResult, SearchScope } from '../types/search.types';

export function useSearchGlobal({
  query,
  type = 'ALL',
  limit = 8,
  debounceMs = 180,
  enabled = true,
}: {
  query: string;
  type?: SearchScope;
  limit?: number;
  debounceMs?: number;
  enabled?: boolean;
}) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceMs]);

  const trimmed = debouncedQuery.trim();

  const searchQuery = useQuery<GlobalSearchResult>({
    queryKey: ['searchGlobal', trimmed, type, limit],
    queryFn: async () => {
      return await searchApi.searchGlobal({
        q: trimmed,
        type,
        limit,
      });
    },
    enabled: enabled && trimmed.length > 0,
    staleTime: 1000 * 30, // 30s cache
    placeholderData: (previousData) => previousData,
  });

  return {
    results: searchQuery.data,
    isLoading: searchQuery.isLoading && trimmed.length > 0,
    isFetching: searchQuery.isFetching,
    debouncedQuery: trimmed,
    error: searchQuery.error,
  };
}
