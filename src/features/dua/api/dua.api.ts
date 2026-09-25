import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import { Dua } from '@/types/dua.types';

export const duaApi = {
  getDuaById: async (id: string): Promise<ApiResponse<Dua>> => {
    const { data } = await apiClient.get<ApiResponse<Dua>>(
      API_ENDPOINTS.DUAS.DETAIL(id),
    );
    return data;
  },

  getAllDuas: async (params?: Record<string, unknown>): Promise<ApiResponse<Dua[]>> => {
    const { data } = await apiClient.get<ApiResponse<Dua[]>>(
      API_ENDPOINTS.DUAS.LIST,
      { params },
    );
    return data;
  },
};
