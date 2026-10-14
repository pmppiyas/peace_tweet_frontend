import { useMutation, useQuery } from '@tanstack/react-query';
import { feedbackApi } from '../api/feedback.api';
import { CreateFeedbackPayload } from '../types/feedback.types';

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: (payload: CreateFeedbackPayload) =>
      feedbackApi.submitFeedback(payload),
  });
}

export function useMyFeedback(params?: {
  page?: number;
  limit?: number;
  type?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ['feedback', 'my', params],
    queryFn: () =>
      feedbackApi.getMyFeedback({
        page: params?.page,
        limit: params?.limit,
        type: params?.type,
      }),
    enabled: params?.enabled !== false,
  });
}
