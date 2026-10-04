import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import { CreateShareInput, ShareResponse } from '../types/feed.types';

export const sharesApi = {
  createShare: async (input: CreateShareInput): Promise<ApiResponse<ShareResponse>> => {
    const { data } = await apiClient.post<ApiResponse<ShareResponse>>(
      API_ENDPOINTS.SHARES.CREATE,
      input,
    );
    return data;
  },
};
