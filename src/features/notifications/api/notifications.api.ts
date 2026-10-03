import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import {
  NotificationItem,
  NotificationQueryParams,
  NotificationsMeta,
  UnreadCountResponse,
} from '../types/notification.types';

export interface GetNotificationsApiResponse {
  success: boolean;
  message: string;
  meta: NotificationsMeta;
  data: NotificationItem[];
}

export const notificationsApi = {
  // Get notifications list with optional filters and pagination
  getNotifications: async (
    params?: NotificationQueryParams,
  ): Promise<GetNotificationsApiResponse> => {
    const { data } = await apiClient.get<GetNotificationsApiResponse>(
      API_ENDPOINTS.NOTIFICATIONS.LIST,
      { params },
    );
    return data;
  },

  // Get total unread count for badge
  getUnreadCount: async (): Promise<ApiResponse<UnreadCountResponse>> => {
    const { data } = await apiClient.get<ApiResponse<UnreadCountResponse>>(
      API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT,
    );
    return data;
  },

  // Mark single notification as read
  markAsRead: async (id: string): Promise<ApiResponse<{ success: boolean; data: NotificationItem }>> => {
    const { data } = await apiClient.patch<ApiResponse<{ success: boolean; data: NotificationItem }>>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id),
    );
    return data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    const { data } = await apiClient.patch<ApiResponse<{ success: boolean; message: string }>>(
      API_ENDPOINTS.NOTIFICATIONS.READ_ALL,
    );
    return data;
  },

  // Delete a notification
  deleteNotification: async (id: string): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    const { data } = await apiClient.delete<ApiResponse<{ success: boolean; message: string }>>(
      API_ENDPOINTS.NOTIFICATIONS.DELETE(id),
    );
    return data;
  },
};
