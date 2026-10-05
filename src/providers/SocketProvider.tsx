'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { initSocket, getSocket, disconnectSocket } from '@/lib/socket/socketClient';
import { useChatStore } from '@/stores/useChatStore';
import { ChatMessage, ConversationItem, MessagesResponse } from '@/features/chat/types/chat.types';
import { CONVERSATIONS_QUERY_KEY } from '@/features/chat/hooks/useConversations';
import { MESSAGES_QUERY_KEY } from '@/features/chat/hooks/useChatMessages';
import { playMessageSound } from '@/features/chat/utils/sound';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export const useSocketContext = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socketRef.current) {
        disconnectSocket();
        socketRef.current = null;
      }
      return;
    }

    const socket = initSocket();
    socketRef.current = socket;
    if (!socket) return;

    // Listeners
    const handleConnect = () => {
      // Socket connected
    };

    const handleOnlineList = (userIds: string[]) => {
      useChatStore.getState().setOnlineUserIds(userIds);
    };

    const handleUserStatus = (payload: { userId: string; status: 'online' | 'offline' }) => {
      useChatStore.getState().setUserOnlineStatus(payload.userId, payload.status === 'online');
    };

    const handleMessageReceived = (message: ChatMessage) => {
      // 1. Play incoming chime
      playMessageSound();

      const convId = message.conversationId;
      const activeChats = useChatStore.getState().activeChats;
      const isOpenAndActive = activeChats.some(
        (c) => c.conversationId === convId && !c.isMinimized,
      );

      // If chat is open and active, mark it as read immediately
      if (isOpenAndActive) {
        socket.emit('message:read', {
          conversationId: convId,
          receiverId: message.senderId,
        });
      }

      // 2. Append message to messages cache
      queryClient.setQueryData<MessagesResponse>(
        MESSAGES_QUERY_KEY(convId),
        (old) => {
          const list = old?.messages || old?.items || [];
          if (list.some((m) => m.id === message.id)) return old!;
          const nextList = [...list, message];
          return {
            ...old,
            messages: nextList,
            items: nextList,
            nextCursor: old?.nextCursor ?? null,
          };
        },
      );

      // 3. Update conversations list cache (bump to top & update snippet)
      queryClient.setQueryData<ConversationItem[]>(
        CONVERSATIONS_QUERY_KEY,
        (old = []) => {
          const index = old.findIndex((c) => c.id === convId);
          if (index !== -1) {
            const current = old[index];
            const updated: ConversationItem = {
              ...current,
              lastMessageText: message.text,
              lastMessageAt: message.createdAt,
              unreadCount: isOpenAndActive ? 0 : (current.unreadCount || 0) + 1,
            };
            const nextList = [...old];
            nextList.splice(index, 1);
            return [updated, ...nextList];
          }

          // If conversation wasn't found in current cache, invalidate to fetch fresh
          queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
          return old;
        },
      );
    };

    const handleMessageSent = (message: ChatMessage) => {
      const convId = message.conversationId;

      queryClient.setQueryData<MessagesResponse>(
        MESSAGES_QUERY_KEY(convId),
        (old) => {
          const list = old?.messages || old?.items || [];
          if (list.some((m) => m.id === message.id)) return old!;
          const nextList = [...list, message];
          return {
            ...old,
            messages: nextList,
            items: nextList,
            nextCursor: old?.nextCursor ?? null,
          };
        },
      );
    };

    const handleMessageSeen = (payload: { conversationId: string; seenBy: string; seenAt: string }) => {
      queryClient.setQueryData<MessagesResponse>(
        MESSAGES_QUERY_KEY(payload.conversationId),
        (old) => {
          if (!old) return old!;
          const list = old.messages || old.items || [];
          const updated = list.map((m) =>
            m.senderId === user.id ? { ...m, isRead: true, readAt: payload.seenAt } : m,
          );
          return {
            ...old,
            messages: updated,
            items: updated,
          };
        },
      );
    };

    const handleMessageTyping = (payload: {
      senderId: string;
      senderName?: string;
      conversationId: string;
      isTyping: boolean;
    }) => {
      if (payload.senderId !== user.id) {
        useChatStore.getState().setTyping(payload.conversationId, {
          senderId: payload.senderId,
          senderName: payload.senderName,
          isTyping: payload.isTyping,
        });
      }
    };

    const handleMessageUpdated = (message: ChatMessage) => {
      const convId = message.conversationId;
      queryClient.setQueryData<MessagesResponse>(
        MESSAGES_QUERY_KEY(convId),
        (old) => {
          if (!old) return old!;
          const list = old.messages || old.items || [];
          const updated = list.map((m) => (m.id === message.id ? { ...m, ...message } : m));
          return {
            ...old,
            messages: updated,
            items: updated,
          };
        },
      );
    };

    const handleMessageDeleted = (message: ChatMessage) => {
      const convId = message.conversationId;
      queryClient.setQueryData<MessagesResponse>(
        MESSAGES_QUERY_KEY(convId),
        (old) => {
          if (!old) return old!;
          const list = old.messages || old.items || [];
          const updated = list.map((m) =>
            m.id === message.id ? { ...m, ...message, isDeleted: true } : m,
          );
          return {
            ...old,
            messages: updated,
            items: updated,
          };
        },
      );
    };

    const handleConversationUpdated = (payload: {
      conversationId: string;
      lastMessageText: string;
      lastMessageAt: string;
      senderId: string;
      unreadDelta?: number;
    }) => {
      queryClient.setQueryData<ConversationItem[]>(
        CONVERSATIONS_QUERY_KEY,
        (old = []) => {
          const index = old.findIndex((c) => c.id === payload.conversationId);
          if (index !== -1) {
            const current = old[index];
            const updated: ConversationItem = {
              ...current,
              lastMessageText: payload.lastMessageText,
              lastMessageAt: payload.lastMessageAt,
            };
            const nextList = [...old];
            nextList.splice(index, 1);
            return [updated, ...nextList];
          }
          queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
          return old;
        },
      );
    };

    socket.on('connect', handleConnect);
    socket.on('users:online_list', handleOnlineList);
    socket.on('user:status', handleUserStatus);
    socket.on('message:received', handleMessageReceived);
    socket.on('message:sent', handleMessageSent);
    socket.on('message:seen', handleMessageSeen);
    socket.on('message:typing', handleMessageTyping);
    socket.on('message:updated', handleMessageUpdated);
    socket.on('message:deleted', handleMessageDeleted);
    socket.on('conversation:updated', handleConversationUpdated);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('users:online_list', handleOnlineList);
      socket.off('user:status', handleUserStatus);
      socket.off('message:received', handleMessageReceived);
      socket.off('message:sent', handleMessageSent);
      socket.off('message:seen', handleMessageSeen);
      socket.off('message:typing', handleMessageTyping);
      socket.off('message:updated', handleMessageUpdated);
      socket.off('message:deleted', handleMessageDeleted);
      socket.off('conversation:updated', handleConversationUpdated);
    };
  }, [isAuthenticated, user?.id, queryClient]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected: Boolean(socketRef.current?.connected),
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
