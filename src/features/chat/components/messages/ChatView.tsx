'use client';

import React, { useState, useEffect } from 'react';
import { ConversationItem, ChatUser } from '@/features/chat/types/chat.types';
import { useChatMessages } from '@/features/chat/hooks/useChatMessages';
import { useChatStore } from '@/stores/useChatStore';
import { useAuth } from '@/hooks/useAuth';
import { ChatViewHeader } from './ChatViewHeader';
import { MessageFeed } from './MessageFeed';
import { MessageComposerView } from './MessageComposerView';
import { ConversationDetailsPanel } from './ConversationDetailsPanel';

interface ChatViewProps {
  conversation: ConversationItem;
  onBack?: () => void;
}

export function ChatView({ conversation, onBack }: ChatViewProps) {
  const { user } = useAuth();
  const participant = conversation.otherUser || conversation.participant;
  const isUserOnline = useChatStore((state) => state.isUserOnline);
  const typingMap = useChatStore((state) => state.typingMap);

  const isOnline = isUserOnline(participant?.id);
  const typingStatus = typingMap[conversation.id];
  const isOtherUserTyping = Boolean(typingStatus?.isTyping);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const {
    messages,
    isLoading,
    sendMessage,
    isSending,
    editMessage,
    deleteMessage,
    handleTyping,
    markAsRead,
    hasOlderMessages,
    isFetchingOlder,
    fetchOlderMessages,
  } = useChatMessages(conversation.id, participant?.id);

  // Automatically mark as read when conversation is opened
  useEffect(() => {
    if (conversation.id && (conversation.unreadCount || 0) > 0) {
      markAsRead();
    }
  }, [conversation.id, conversation.unreadCount, markAsRead]);

  const handleStartEdit = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setEditingText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText('');
  };

  const handleSaveEdit = async (messageId: string, newText: string) => {
    setEditingMessageId(null);
    setEditingText('');
    await editMessage(messageId, newText);
  };

  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage(messageId);
  };

  const handleQuickSalam = () => {
    sendMessage('আসসালামু আলাইকুম ওয়ারাহমাতুল্লাহ্').catch(console.error);
  };

  if (!participant) {
    return null;
  }

  return (
    <div className="flex-1 h-full flex overflow-hidden">
      {/* Center Chat Main Column */}
      <div className="flex-1 h-full flex flex-col min-w-0 bg-white dark:bg-[#18191a] overflow-hidden">
        {/* Chat Top Header */}
        <ChatViewHeader
          user={participant}
          isOnline={isOnline}
          isTyping={isOtherUserTyping}
          isDetailsOpen={isDetailsOpen}
          onToggleDetails={() => setIsDetailsOpen((prev) => !prev)}
          onBack={onBack}
        />

        {/* Scrollable Message Feed */}
        <MessageFeed
          messages={messages}
          currentUserId={user?.id}
          otherUser={participant}
          isOtherUserTyping={isOtherUserTyping}
          isLoading={isLoading}
          hasOlderMessages={hasOlderMessages}
          isFetchingOlder={isFetchingOlder}
          onFetchOlderMessages={fetchOlderMessages}
          onStartEdit={handleStartEdit}
          onDeleteMessage={handleDeleteMessage}
        />

        {/* Bottom Message Composer */}
        <MessageComposerView
          onSendMessage={sendMessage}
          isSending={isSending}
          onTyping={handleTyping}
          editingMessageId={editingMessageId}
          editingText={editingText}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      {/* Right Column / Drawer: Conversation Details Panel */}
      <ConversationDetailsPanel
        user={participant}
        isOnline={isOnline}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onQuickSalam={handleQuickSalam}
      />
    </div>
  );
}
