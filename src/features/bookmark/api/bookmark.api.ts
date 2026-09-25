import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import { SavedDuaItem } from '@/types/dua.types';

export const bookmarkApi = {
  saveDua: async (duaId: string): Promise<ApiResponse<unknown>> => {
    const { data } = await apiClient.post<ApiResponse<unknown>>(
      API_ENDPOINTS.DUAS.SAVE(duaId),
    );
    return data;
  },

  unsaveDua: async (duaId: string): Promise<ApiResponse<{ message: string }>> => {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.DUAS.UNSAVE(duaId),
    );
    return data;
  },

  getSavedDuas: async (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<SavedDuaItem[]>> => {
    const { data } = await apiClient.get<ApiResponse<SavedDuaItem[]>>(
      API_ENDPOINTS.USERS.SAVED_DUAS,
      { params },
    );
    return data;
  },
};
