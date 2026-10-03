'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, GetNotificationsApiResponse } from '../api/notifications.api';
import { NotificationQueryParams } from '../types/notification.types';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (params?: NotificationQueryParams) => ['notifications', 'list', params] as const,
  unreadCount: () => ['notifications', 'unread-count'] as const,
};

// Hook to fetch notifications with optional filter (e.g. isRead)
export function useNotifications(params?: NotificationQueryParams, enabled = true) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: async () => {
      const response = await notificationsApi.getNotifications({
        limit: 40,
        ...params,
      });
      return response;
    },
    enabled,
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 30, // Poll every 30 seconds
    placeholderData: (previousData) => previousData,
  });
}

// Hook to fetch unread notification count for the badge
export function useUnreadNotificationsCount(enabled = true) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const response = await notificationsApi.getUnreadCount();
      return response?.data?.unreadCount || 0;
    },
    enabled,
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 20, // Poll every 20 seconds
  });
}

// Hook to mark a single notification as read
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      // Optimistically update lists
      queryClient.setQueriesData<GetNotificationsApiResponse>(
        { queryKey: notificationKeys.all },
        (old) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: old.data.map((item) =>
              item.id === id ? { ...item, isRead: true } : item,
            ),
            meta: {
              ...old.meta,
              unreadCount: Math.max(0, (old.meta?.unreadCount || 1) - 1),
            },
          };
        },
      );

      // Optimistically decrement unread count
      queryClient.setQueryData<number>(
        notificationKeys.unreadCount(),
        (old = 0) => Math.max(0, old - 1),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

// Hook to mark all notifications as read
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      // Optimistically mark all as read in lists
      queryClient.setQueriesData<GetNotificationsApiResponse>(
        { queryKey: notificationKeys.all },
        (old) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: old.data.map((item) => ({ ...item, isRead: true })),
            meta: {
              ...old.meta,
              unreadCount: 0,
            },
          };
        },
      );

      // Optimistically set unread count to 0
      queryClient.setQueryData<number>(notificationKeys.unreadCount(), 0);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

// Hook to delete a notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      queryClient.setQueriesData<GetNotificationsApiResponse>(
        { queryKey: notificationKeys.all },
        (old) => {
          if (!old || !old.data) return old;
          const wasUnread = old.data.find((item) => item.id === id && !item.isRead);
          return {
            ...old,
            data: old.data.filter((item) => item.id !== id),
            meta: {
              ...old.meta,
              total: Math.max(0, (old.meta?.total || 1) - 1),
              unreadCount: wasUnread
                ? Math.max(0, (old.meta?.unreadCount || 1) - 1)
                : old.meta?.unreadCount,
            },
          };
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
