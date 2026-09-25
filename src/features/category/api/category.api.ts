import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import { Category } from '@/types/category.types';

export const categoryApi = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>(
      API_ENDPOINTS.CATEGORIES.LIST,
    );
    return data;
  },

  getCategoryBySlug: async (slug: string): Promise<ApiResponse<Category>> => {
    const { data } = await apiClient.get<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORIES.DETAIL(slug),
    );
    return data;
  },
};
