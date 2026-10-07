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
import { useAuth } from '@/hooks/useAuth';
import { useChatStore } from '@/stores/useChatStore';
import { ROUTES } from '@/constants/routes';
import { ConversationSidebar } from './ConversationSidebar';
import { ChatView } from './ChatView';
import { EmptyChatPlaceholder } from './EmptyChatPlaceholder';
import { NewMessageModal } from './NewMessageModal';
import { cn } from '@/lib/utils/cn';

export function MessagesLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const urlConvId = searchParams.get('conversationId');
  const urlUserId = searchParams.get('userId');

  const { data: conversations = [], isLoading, isError } = useConversations();
  const totalUnreadCount = useTotalUnreadCount();

  const [directSelectedConv, setDirectSelectedConv] =
    useState<ConversationItem | null>(null);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);

  // Derive currently selected conversation from URL param or immediate selection
  const selectedConversation = useMemo(() => {
    if (!urlConvId) return directSelectedConv;
    const match = conversations.find((c) => c.id === urlConvId);
    return match || directSelectedConv || null;
  }, [urlConvId, conversations, directSelectedConv]);

  // Sync active conversation with global store so navbar badge & socket listeners stay in sync
  useEffect(() => {
    const activeId = urlConvId || null;
    useChatStore.getState().setCurrentActiveConversationId(activeId);
    return () => {
      useChatStore.getState().setCurrentActiveConversationId(null);
    };
  }, [urlConvId]);

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
          old.map((c) => (c.id === selectedConversation.id ? { ...c, unreadCount: 0 } : c)),
      );
    }
  }, [selectedConversation, queryClient]);

  // Handle ?userId= deep linking
  useEffect(() => {
    if (urlUserId && !urlConvId) {
      chatApi
        .getOrCreateConversation(urlUserId)
        .then((res) => {
          if (res.data) {
            setDirectSelectedConv(res.data);
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
    }
  }, [urlUserId, urlConvId, router]);

  const handleSelectConversation = (conversation: ConversationItem) => {
    setDirectSelectedConv(conversation);
    if ((conversation.unreadCount || 0) > 0) {
      queryClient.setQueryData<ConversationItem[]>(
        CONVERSATIONS_QUERY_KEY,
        (old = []) =>
          old.map((c) => (c.id === conversation.id ? { ...c, unreadCount: 0 } : c)),
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

  return (
    <div className="w-full h-[100dvh] md:h-[calc(100vh-56px)] flex bg-white dark:bg-[#18191a] overflow-hidden">
      {/* 1. Left Column: Conversations Sidebar */}
      <div
        className={cn(
          'w-full md:w-[320px] lg:w-[360px] xl:w-[380px] h-full shrink-0 flex flex-col',
          selectedConversation ? 'hidden md:flex' : 'flex'
        )}
      >
        <ConversationSidebar
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={handleSelectConversation}
          onOpenNewMessage={() => setIsNewMessageModalOpen(true)}
          isLoading={isLoading}
          isError={isError}
          totalUnreadCount={totalUnreadCount}
        />
      </div>

      {/* 2. Center Column: Active Chat or Empty Placeholder */}
      <div
        className={cn(
          'flex-1 h-full flex flex-col min-w-0 overflow-hidden',
          selectedConversation ? 'flex' : 'hidden md:flex'
        )}
      >
        {selectedConversation ? (
          <ChatView
            key={selectedConversation.id}
            conversation={selectedConversation}
            onBack={handleBackToSidebar}
          />
        ) : (
          <EmptyChatPlaceholder
            onOpenNewMessage={() => setIsNewMessageModalOpen(true)}
          />
        )}
      </div>

      {/* 3. New Message User Search Modal */}
      <NewMessageModal
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
        onSelectConversation={handleSelectConversation}
      />
    </div>
  );
}
