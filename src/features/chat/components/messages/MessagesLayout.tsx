'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  useConversations,
  useTotalUnreadCount,
  CONVERSATIONS_QUERY_KEY,
} from '@/features/chat/hooks/useConversations';
import { chatApi } from '@/features/chat/api/chat.api';
import { ConversationItem } from '@/features/chat/types/chat.types';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import { useAuth } from '@/hooks/useAuth';
import { useChatStore } from '@/stores/useChatStore';
import { ROUTES } from '@/constants/routes';
import { ConversationSidebar } from './ConversationSidebar';
import { ChatView } from './ChatView';
import { EmptyChatPlaceholder } from './EmptyChatPlaceholder';
import { MessagesSkeleton, ChatViewSkeleton } from './MessagesSkeleton';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils/cn';

export function MessagesLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const urlConvId = searchParams.get('conversationId');
  const urlUserId = searchParams.get('userId');
  const urlUsername = searchParams.get('user') || searchParams.get('username');

  const { data: conversations = [], isLoading, isError } = useConversations();
  const totalUnreadCount = useTotalUnreadCount();

  const [directSelectedConv, setDirectSelectedConv] =
    useState<ConversationItem | null>(null);

  // Track visualViewport height on mobile when active chat is open to stick directly above keyboard
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  // Derive currently selected conversation from URL param or immediate selection
  const selectedConversation = useMemo(() => {
    if (urlConvId) {
      const match = conversations.find((c) => c.id === urlConvId);
      return match || directSelectedConv || null;
    }
    if (urlUsername) {
      const target = urlUsername.trim().toLowerCase();
      const match = conversations.find((c) => {
        const participant = c.otherUser || c.participant;
        return (
          participant?.username?.toLowerCase() === target ||
          participant?.id?.toLowerCase() === target
        );
      });
      return match || directSelectedConv || null;
    }
    if (urlUserId) {
      const match = conversations.find((c) => {
        const participant = c.otherUser || c.participant;
        return (
          participant?.id === urlUserId ||
          c.participantOneId === urlUserId ||
          c.participantTwoId === urlUserId
        );
      });
      return match || directSelectedConv || null;
    }
    return directSelectedConv || null;
  }, [urlConvId, urlUsername, urlUserId, conversations, directSelectedConv]);

  const isConvLoading = Boolean(
    ((urlUserId || urlUsername) && !selectedConversation) ||
    (urlConvId && !selectedConversation && isLoading)
  );

  // Sync active conversation with global store so navbar badge & socket listeners stay in sync
  useEffect(() => {
    const activeId = selectedConversation?.id || urlConvId || null;
    useChatStore.getState().setCurrentActiveConversationId(activeId);
    return () => {
      useChatStore.getState().setCurrentActiveConversationId(null);
    };
  }, [selectedConversation?.id, urlConvId]);

  // Auth Protection: Redirect to Login if unauthenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Optimistically clear unread count for selected conversation
  useEffect(() => {
    if (selectedConversation && (selectedConversation.unreadCount || 0) > 0) {
      queryClient.setQueryData<ConversationItem[]>(
        CONVERSATIONS_QUERY_KEY,
        (old = []) =>
          old.map((c) =>
            c.id === selectedConversation.id ? { ...c, unreadCount: 0 } : c
          )
      );
    }
  }, [selectedConversation, queryClient]);

  // Handle mobile visualViewport resize when virtual keyboard appears
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const vv = window.visualViewport;
    const updateViewportHeight = () => {
      if (window.innerWidth < 768) {
        setViewportHeight(vv.height);
      } else {
        setViewportHeight(null);
      }
    };

    updateViewportHeight();
    vv.addEventListener('resize', updateViewportHeight);
    window.addEventListener('resize', updateViewportHeight);

    return () => {
      vv.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('resize', updateViewportHeight);
    };
  }, [selectedConversation, isConvLoading]);

  // Handle ?user= / ?username= / ?userId= deep linking
  useEffect(() => {
    if (urlConvId) return;

    // Do not attempt to open chat with oneself
    if (
      (urlUserId && user?.id && urlUserId === user.id) ||
      (urlUsername &&
        user?.username &&
        urlUsername.toLowerCase() === user.username.toLowerCase())
    ) {
      router.replace('/messages', { scroll: false });
      return;
    }

    if (urlUsername) {
      const target = urlUsername.trim().toLowerCase();
      const match = conversations.find((c) => {
        const participant = c.otherUser || c.participant;
        return (
          participant?.username?.toLowerCase() === target ||
          participant?.id?.toLowerCase() === target
        );
      });

      if (match) {
        setDirectSelectedConv(match);
        router.replace(`/messages?conversationId=${match.id}`, {
          scroll: false,
        });
        return;
      }

      // Wait if conversations are still loading
      if (isLoading) return;

      // Not found in current conversations: fetch user by username to get ID & open/create conversation
      let isCancelled = false;
      apiClient
        .get<ApiResponse<{ id: string }>>(
          API_ENDPOINTS.USERS.PROFILE(urlUsername)
        )
        .then((userRes) => {
          const targetId = userRes.data?.data?.id;
          if (!targetId) throw new Error('User not found');
          return chatApi.getOrCreateConversation(targetId);
        })
        .then((convRes) => {
          if (!isCancelled && convRes?.data) {
            setDirectSelectedConv(convRes.data);
            queryClient.invalidateQueries({
              queryKey: CONVERSATIONS_QUERY_KEY,
            });
            router.replace(`/messages?conversationId=${convRes.data.id}`, {
              scroll: false,
            });
          }
        })
        .catch((err) => {
          console.error(
            'Failed to resolve conversation for username:',
            urlUsername,
            err
          );
        });

      return () => {
        isCancelled = true;
      };
    }

    if (urlUserId) {
      let isCancelled = false;
      chatApi
        .getOrCreateConversation(urlUserId)
        .then((res) => {
          if (!isCancelled && res.data) {
            setDirectSelectedConv(res.data);
            queryClient.invalidateQueries({
              queryKey: CONVERSATIONS_QUERY_KEY,
            });
            router.replace(`/messages?conversationId=${res.data.id}`, {
              scroll: false,
            });
          }
        })
        .catch((err) => {
          console.error(
            'Failed to get or create conversation with userId:',
            err
          );
        });

      return () => {
        isCancelled = true;
      };
    }
  }, [
    urlUsername,
    urlUserId,
    urlConvId,
    user,
    conversations,
    isLoading,
    queryClient,
    router,
  ]);

  const handleSelectConversation = (conversation: ConversationItem) => {
    setDirectSelectedConv(conversation);
    if ((conversation.unreadCount || 0) > 0) {
      queryClient.setQueryData<ConversationItem[]>(
        CONVERSATIONS_QUERY_KEY,
        (old = []) =>
          old.map((c) =>
            c.id === conversation.id ? { ...c, unreadCount: 0 } : c
          )
      );
    }
    router.replace(`/messages?conversationId=${conversation.id}`, {
      scroll: false,
    });
  };

  const handleBackToSidebar = () => {
    setDirectSelectedConv(null);
    useChatStore.getState().setCurrentActiveConversationId(null);
    router.replace('/messages', { scroll: false });
  };

  if (isAuthLoading || (isLoading && conversations.length === 0)) {
    return (
      <MessagesSkeleton
        hasSelectedConversation={Boolean(urlConvId || urlUserId || urlUsername)}
      />
    );
  }

  const hasTargetChat = Boolean(urlConvId || urlUserId || urlUsername);
  const isChatActive = Boolean(
    selectedConversation || isConvLoading || hasTargetChat
  );

  return (
    <div
      style={
        isChatActive && viewportHeight
          ? { height: `${viewportHeight}px` }
          : undefined
      }
      className={cn(
        'overflow-hidden bg-white dark:bg-[#18191a] sm:bg-[#f0f2f5]',
        isChatActive
          ? 'fixed top-0 left-0 right-0 z-40 md:relative md:top-auto md:left-auto md:right-auto md:z-auto h-[100dvh] md:h-[calc(100vh-3.5rem)]'
          : 'h-[calc(100vh-3.5rem)]'
      )}
    >
      <Container size="2xl" className="h-full px-0 sm:px-4 lg:px-6 2xl:px-8">
        <div className="flex h-full gap-4 lg:gap-6 2xl:gap-8">
          {/* 1. Left Sidebar: Chats / Conversations Sidebar (In place of main menu sidebar) */}
          <div
            className={cn(
              'w-full md:w-60 lg:w-60 xl:w-64 2xl:w-72 h-full shrink-0 flex flex-col',
              isChatActive ? 'hidden md:flex' : 'flex'
            )}
          >
            <ConversationSidebar
              conversations={conversations}
              selectedConversationId={selectedConversation?.id}
              onSelectConversation={handleSelectConversation}
              isLoading={isLoading}
              isError={isError}
              totalUnreadCount={totalUnreadCount}
            />
          </div>

          {/* 2. Main Area: Active Chat Window or Empty Placeholder */}
          <main
            className={cn(
              'flex-1 w-full min-w-0 h-full py-0 sm:py-3 lg:py-4 px-0',
              isChatActive ? 'flex' : 'hidden md:flex'
            )}
          >
            <div className="w-full h-full flex bg-white dark:bg-[#242526] sm:rounded-2xl sm:border sm:border-[#e4e6eb] sm:dark:border-[#393a3b] sm:shadow-2xs overflow-hidden">
              {selectedConversation ? (
                <ChatView
                  key={selectedConversation.id}
                  conversation={selectedConversation}
                  onBack={handleBackToSidebar}
                />
              ) : isChatActive ? (
                <ChatViewSkeleton onBack={handleBackToSidebar} />
              ) : (
                <EmptyChatPlaceholder />
              )}
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}

export default MessagesLayout;
