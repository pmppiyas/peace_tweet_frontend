import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import { CreateFeedbackPayload, FeedbackItem } from '../types/feedback.types';

export const feedbackApi = {
  submitFeedback: async (
    payload: CreateFeedbackPayload
  ): Promise<ApiResponse<FeedbackItem>> => {
    const { data } = await apiClient.post<ApiResponse<FeedbackItem>>(
      API_ENDPOINTS.FEEDBACK.CREATE,
      payload
    );
    return data;
  },

  getMyFeedback: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<ApiResponse<FeedbackItem[]>> => {
    const { data } = await apiClient.get<ApiResponse<FeedbackItem[]>>(
      API_ENDPOINTS.FEEDBACK.LIST,
      { params }
    );
    return data;
  },
};
