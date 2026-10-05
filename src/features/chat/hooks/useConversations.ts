'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';
import { ConversationItem, ChatUser } from '../types/chat.types';
import { useAuth } from '@/hooks/useAuth';

export const CONVERSATIONS_QUERY_KEY = ['conversations'] as const;

export function useConversations() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await chatApi.getConversations();
      return res.data || [];
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

export function useTotalUnreadCount() {
  const { data: conversations = [] } = useConversations();
  return conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
}

export function useGetOrCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (receiverId: string) => {
      const res = await chatApi.getOrCreateConversation(receiverId);
      return res.data;
    },
    onSuccess: (newConv) => {
      if (newConv) {
        queryClient.setQueryData<ConversationItem[]>(
          CONVERSATIONS_QUERY_KEY,
          (old = []) => {
            const exists = old.some((c) => c.id === newConv.id);
            if (exists) {
              return old.map((c) => (c.id === newConv.id ? { ...c, ...newConv } : c));
            }
            return [newConv, ...old];
          },
        );
      }
    },
  });
}
