'use client';

import React from 'react';
import { ChatAvatar } from '../ChatAvatar';
import { ConversationItem } from '@/features/chat/types/chat.types';
import { useChatStore } from '@/stores/useChatStore';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

interface ConversationItemViewProps {
  conversation: ConversationItem;
  isSelected: boolean;
  onSelect: (conversation: ConversationItem) => void;
}

export function ConversationItemView({
  conversation,
  isSelected,
  onSelect,
}: ConversationItemViewProps) {
  const { locale } = useLanguage();
  const isUserOnline = useChatStore((state) => state.isUserOnline);
  const typingMap = useChatStore((state) => state.typingMap);

  const participant = conversation.otherUser || conversation.participant;
  const isOnline = isUserOnline(participant?.id);
  const typingStatus = typingMap[conversation.id];
  const isTyping = Boolean(typingStatus?.isTyping);
  const hasUnread = (conversation.unreadCount || 0) > 0;

  const formatTimestamp = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (isToday) {
      return date.toLocaleTimeString(locale === 'bn' ? 'bn-BD' : 'en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }

    if (diffDays === 1) {
      return locale === 'bn' ? 'গতকাল' : 'Yesterday';
    }

    if (diffDays < 7) {
      return date.toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
        weekday: 'short',
      });
    }

    return date.toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const displayName = participant?.name || (locale === 'bn' ? 'ইউজার' : 'User');
  const firstLetter = displayName.trim().charAt(0).toUpperCase() || 'U';

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={cn(
        'w-full flex items-center gap-2.5 px-2 py-2 rounded-xl transition-colors text-left select-none cursor-pointer group',
        isSelected
          ? 'bg-[#e4e6eb] dark:bg-[#3a3b3c]'
          : 'hover:bg-[#e4e6eb]/70 dark:hover:bg-[#3a3b3c]/60'
      )}
    >
      {/* Avatar Container */}
      <ChatAvatar
        src={participant?.avatarUrl}
        name={displayName}
        size="md"
        isOnline={isOnline}
        className="shrink-0 transition-transform group-hover:scale-105"
      />

      {/* Conversation Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p
            className={cn(
              'text-[15px] truncate leading-tight',
              isSelected
                ? 'font-bold text-primary-700 dark:text-primary-400'
                : hasUnread
                  ? 'font-bold text-[#050505] dark:text-white'
                  : 'font-semibold text-[#050505] dark:text-[#e4e6eb]'
            )}
          >
            {displayName}
          </p>
          <span
            className={cn(
              'text-[11px] shrink-0',
              hasUnread
                ? 'font-bold text-primary-600 dark:text-primary-400'
                : 'text-[#65676b] dark:text-[#b0b3b8]'
            )}
          >
            {formatTimestamp(conversation.lastMessageAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <p
            className={cn(
              'text-[13px] truncate leading-normal',
              isTyping
                ? 'text-primary-600 dark:text-primary-400 font-semibold italic animate-pulse'
                : hasUnread
                  ? 'font-bold text-[#050505] dark:text-[#f0f2f5]'
                  : 'text-[#65676b] dark:text-[#b0b3b8]'
            )}
          >
            {isTyping
              ? locale === 'bn'
                ? 'টাইপ করছেন...'
                : 'typing...'
              : conversation.lastMessageText ||
                (locale === 'bn' ? 'মেসেজ পাঠান' : 'Send a message')}
          </p>

          {/* Unread Count Badge */}
          {hasUnread && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
