import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import {
  AddSearchHistoryInput,
  GlobalSearchResult,
  SearchHistoryItem,
  SearchScope,
} from '../types/search.types';

export const searchApi = {
  // Ultra-fast global search across Users, Duas, Groups, Posts
  searchGlobal: async (params: {
    q: string;
    type?: SearchScope;
    limit?: number;
  }): Promise<GlobalSearchResult> => {
    const { data } = await apiClient.get<ApiResponse<GlobalSearchResult>>(
      API_ENDPOINTS.SEARCH.GLOBAL,
      { params },
    );
    return data.data;
  },

  // Get user's recent search history
  getSearchHistory: async (limit: number = 15): Promise<SearchHistoryItem[]> => {
    const { data } = await apiClient.get<ApiResponse<SearchHistoryItem[]>>(
      API_ENDPOINTS.SEARCH.HISTORY,
      { params: { limit } },
    );
    return data.data;
  },

  // Add query or entity to search history
  addSearchHistory: async (
    input: AddSearchHistoryInput,
  ): Promise<SearchHistoryItem> => {
    const { data } = await apiClient.post<ApiResponse<SearchHistoryItem>>(
      API_ENDPOINTS.SEARCH.HISTORY,
      input,
    );
    return data.data;
  },

  // Single delete search history item
  deleteSearchHistoryItem: async (id: string): Promise<boolean> => {
    await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.SEARCH.DELETE_HISTORY(id),
    );
    return true;
  },

  // Clear all search history
  clearSearchHistory: async (): Promise<boolean> => {
    await apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.SEARCH.CLEAR_HISTORY);
    return true;
  },
};
