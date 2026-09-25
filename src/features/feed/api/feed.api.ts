import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import { Dua } from '@/types/dua.types';
import { FeedFilters } from '../types/feed.types';

export const feedApi = {
  getFeed: async (params?: FeedFilters): Promise<ApiResponse<Dua[]>> => {
    const { data } = await apiClient.get<ApiResponse<Dua[]>>(
      API_ENDPOINTS.DUAS.LIST,
      { params },
    );
    return data;
  },
};
