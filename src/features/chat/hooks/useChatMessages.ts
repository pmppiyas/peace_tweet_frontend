'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';
import { ChatMessage, MessagesResponse, ConversationItem } from '../types/chat.types';
import { getSocket } from '@/lib/socket/socketClient';
import { useAuth } from '@/hooks/useAuth';
import { CONVERSATIONS_QUERY_KEY } from './useConversations';

export const MESSAGES_QUERY_KEY = (conversationId: string) =>
  ['messages', conversationId] as const;

export function useChatMessages(conversationId?: string, receiverId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isTempConv = conversationId?.startsWith('temp_');
  const validConvId = isTempConv ? '' : conversationId || '';

  // Fetch messages query
  const messagesQuery = useQuery({
    queryKey: MESSAGES_QUERY_KEY(validConvId),
    queryFn: async () => {
      if (!validConvId) return { messages: [], nextCursor: null, hasMore: false };
      const res = await chatApi.getMessages(validConvId, { limit: 50 });
      return res.data;
    },
    enabled: Boolean(validConvId),
    staleTime: 1000 * 10,
    select: (data) => {
      // Sort messages chronologically (oldest first)
      const list = data?.messages || data?.items || [];
      const sorted = [...list].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      return {
        ...data,
        messages: sorted,
        items: sorted,
      };
    },
  });

  // Typing debounce timer ref
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef<boolean>(false);

  // Send typing status to socket
  const handleTyping = useCallback(
    (text: string) => {
      const socket = getSocket();
      if (!socket || !receiverId) return;

      const isTypingNow = text.trim().length > 0;

      if (isTypingNow && !isTypingRef.current) {
        isTypingRef.current = true;
        socket.emit('message:typing', {
          receiverId,
          conversationId: validConvId,
          isTyping: true,
        });
      }

      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }

      typingTimerRef.current = setTimeout(() => {
        if (isTypingRef.current) {
          isTypingRef.current = false;
          socket.emit('message:typing', {
            receiverId,
            conversationId: validConvId,
            isTyping: false,
          });
        }
      }, 2000);
    },
    [receiverId, validConvId],
  );

  // Send Message Mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!text.trim() || !receiverId) {
        throw new Error('Message text and receiver are required');
      }

      const socket = getSocket();

      // Clear typing indicator before sending
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (isTypingRef.current) {
        isTypingRef.current = false;
        socket?.emit('message:typing', {
          receiverId,
          conversationId: validConvId,
          isTyping: false,
        });
      }

      // Try Socket first for real-time delivery
      if (socket && socket.connected) {
        return new Promise<ChatMessage>((resolve, reject) => {
          socket.emit(
            'message:send',
            {
              receiverId,
              text: text.trim(),
              conversationId: validConvId || undefined,
            },
            (response: any) => {
              if (response?.success && response.data) {
                resolve(response.data);
              } else {
                // Fallback to REST if socket acknowledgement failed
                chatApi
                  .sendMessage(receiverId, text.trim(), validConvId || undefined)
                  .then((res) => resolve(res.data))
                  .catch(reject);
              }
            },
          );
        });
      }

      // Fallback to REST API
      const res = await chatApi.sendMessage(
        receiverId,
        text.trim(),
        validConvId || undefined,
      );
      return res.data;
    },
    onSuccess: (savedMessage) => {
      const convId = savedMessage.conversationId;

      // Update message list cache
      queryClient.setQueryData<MessagesResponse>(
        MESSAGES_QUERY_KEY(convId),
        (old) => {
          const prev = old?.messages || old?.items || [];
          if (prev.some((m) => m.id === savedMessage.id)) return old!;
          const nextList = [...prev, savedMessage];
          return {
            ...old,
            messages: nextList,
            items: nextList,
            nextCursor: old?.nextCursor || null,
            hasMore: old?.hasMore || false,
          };
        },
      );

      // Update conversations list cache
      queryClient.setQueryData<ConversationItem[]>(
        CONVERSATIONS_QUERY_KEY,
        (old = []) => {
          return old.map((c) => {
            if (c.id === convId) {
              return {
                ...c,
                lastMessageText: savedMessage.text,
                lastMessageAt: savedMessage.createdAt,
              };
            }
            return c;
          });
        },
      );
    },
  });

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!validConvId || !receiverId) return;

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('message:read', {
        conversationId: validConvId,
        receiverId,
      });
    }

    try {
      await chatApi.markAsRead(validConvId);
      // Reset unread count for this conversation in cache
      queryClient.setQueryData<ConversationItem[]>(
        CONVERSATIONS_QUERY_KEY,
        (old = []) => {
          return old.map((c) => (c.id === validConvId ? { ...c, unreadCount: 0 } : c));
        },
      );
    } catch {
      // Ignore background read error
    }
  }, [validConvId, receiverId, queryClient]);

  // Edit Message Mutation
  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, text }: { messageId: string; text: string }) => {
      const socket = getSocket();
      if (socket && socket.connected) {
        return new Promise<ChatMessage>((resolve, reject) => {
          socket.emit('message:edit', { messageId, text: text.trim() }, (response: any) => {
            if (response?.success && response.data) {
              resolve(response.data);
            } else {
              chatApi
                .editMessage(messageId, text.trim())
                .then((res) => resolve(res.data))
                .catch(reject);
            }
          });
        });
      }
      const res = await chatApi.editMessage(messageId, text.trim());
      return res.data;
    },
    onSuccess: (updatedMessage) => {
      const convId = updatedMessage.conversationId;
      queryClient.setQueryData<MessagesResponse>(
        MESSAGES_QUERY_KEY(convId),
        (old) => {
          if (!old) return old!;
          const list = old.messages || old.items || [];
          const updated = list.map((m) => (m.id === updatedMessage.id ? { ...m, ...updatedMessage } : m));
          return {
            ...old,
            messages: updated,
            items: updated,
          };
        },
      );
      // Update conversations list cache
      queryClient.setQueryData<ConversationItem[]>(
        CONVERSATIONS_QUERY_KEY,
        (old = []) => {
          return old.map((c) => (c.id === convId ? { ...c, lastMessageText: updatedMessage.text } : c));
        },
      );
    },
  });

  // Delete Message Mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const socket = getSocket();
      if (socket && socket.connected) {
        return new Promise<ChatMessage>((resolve, reject) => {
          socket.emit('message:delete', { messageId }, (response: any) => {
            if (response?.success && response.data) {
              resolve(response.data);
            } else {
              chatApi
                .deleteMessage(messageId)
                .then((res) => resolve(res.data))
                .catch(reject);
            }
          });
        });
      }
      const res = await chatApi.deleteMessage(messageId);
      return res.data;
    },
    onSuccess: (deletedMessage) => {
      const convId = deletedMessage.conversationId;
      queryClient.setQueryData<MessagesResponse>(
        MESSAGES_QUERY_KEY(convId),
        (old) => {
          if (!old) return old!;
          const list = old.messages || old.items || [];
          const updated = list.map((m) =>
            m.id === deletedMessage.id ? { ...m, ...deletedMessage, isDeleted: true } : m,
          );
          return {
            ...old,
            messages: updated,
            items: updated,
          };
        },
      );
      // Update conversations list cache
      queryClient.setQueryData<ConversationItem[]>(
        CONVERSATIONS_QUERY_KEY,
        (old = []) => {
          return old.map((c) => (c.id === convId ? { ...c, lastMessageText: deletedMessage.text } : c));
        },
      );
    },
  });

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  return {
    messages: messagesQuery.data?.messages || [],
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    editMessage: (messageId: string, text: string) =>
      editMessageMutation.mutateAsync({ messageId, text }),
    isEditing: editMessageMutation.isPending,
    deleteMessage: deleteMessageMutation.mutateAsync,
    isDeleting: deleteMessageMutation.isPending,
    handleTyping,
    markAsRead,
    refetch: messagesQuery.refetch,
  };
}
