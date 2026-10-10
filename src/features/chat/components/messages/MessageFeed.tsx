'use client';

import React, { useRef, useEffect, useState, UIEvent } from 'react';
import { ArrowDown, Loader2, MessageSquare } from 'lucide-react';
import { ChatMessage, ChatUser } from '@/features/chat/types/chat.types';
import { MessageFeedItem } from './MessageFeedItem';
import { useLanguage } from '@/providers/LanguageProvider';

interface MessageFeedProps {
  messages: ChatMessage[];
  currentUserId?: string;
  otherUser?: ChatUser;
  isOtherUserTyping: boolean;
  isLoading: boolean;
  hasOlderMessages: boolean;
  isFetchingOlder: boolean;
  onFetchOlderMessages: () => void;
  onStartEdit: (messageId: string, text: string) => void;
  onDeleteMessage: (messageId: string) => void;
}

export function MessageFeed({
  messages,
  currentUserId,
  otherUser,
  isOtherUserTyping,
  isLoading,
  hasOlderMessages,
  isFetchingOlder,
  onFetchOlderMessages,
  onStartEdit,
  onDeleteMessage,
}: MessageFeedProps) {
  const { locale } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const isFirstLoadRef = useRef(true);
  const prevMessagesLengthRef = useRef(messages.length);

  // Scroll to bottom helper
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    bottomAnchorRef.current?.scrollIntoView({ behavior });
  };

  // Scroll position change handler
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 120;
    setShowScrollBottom(!isNearBottom);

    // Auto-fetch older messages when scrolling to the top
    if (target.scrollTop < 60 && hasOlderMessages && !isFetchingOlder) {
      const prevHeight = target.scrollHeight;
      onFetchOlderMessages();
      // Restore scroll offset after DOM update
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          const newHeight = scrollContainerRef.current.scrollHeight;
          scrollContainerRef.current.scrollTop = newHeight - prevHeight;
        }
      });
    }
  };

  // Initial load auto-scroll
  useEffect(() => {
    if (!isLoading && messages.length > 0 && isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      scrollToBottom('auto');
    }
  }, [isLoading, messages.length]);

  // Handle new incoming messages
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      const container = scrollContainerRef.current;
      if (container) {
        const isNearBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight < 200;
        if (isNearBottom) {
          scrollToBottom('smooth');
        } else {
          setShowScrollBottom(true);
        }
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length]);

  // When other user starts typing, scroll to show typing if near bottom
  useEffect(() => {
    if (isOtherUserTyping) {
      const container = scrollContainerRef.current;
      if (container) {
        const isNearBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight < 180;
        if (isNearBottom) {
          scrollToBottom('smooth');
        }
      }
    }
  }, [isOtherUserTyping]);

  return (
    <div className="relative flex-1 min-h-0 flex flex-col bg-[#f8f9fa] dark:bg-[#18191a]">
      {/* Scrollable messages container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-5 space-y-2.5"
      >
        {/* Loader or "Load Earlier Messages" Button */}
        {hasOlderMessages && (
          <div className="flex justify-center pt-2 pb-1">
            {isFetchingOlder ? (
              <div className="flex items-center gap-2 text-xs text-[#65676b] dark:text-[#b0b3b8]">
                <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                <span>{locale === 'bn' ? 'আগের মেসেজ লোড হচ্ছে...' : 'Loading older messages...'}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onFetchOlderMessages}
                className="px-3 py-1 rounded-full bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] text-xs font-semibold text-[#65676b] dark:text-[#b0b3b8] hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 shadow-2xs transition-all cursor-pointer"
              >
                {locale === 'bn' ? 'পূর্ববর্তী মেসেজ দেখুন' : 'Load earlier messages'}
              </button>
            )}
          </div>
        )}

        {/* Loading state for entire feed */}
        {isLoading && messages.length === 0 ? (
          <div className="h-full flex flex-col justify-end p-3 sm:p-5 space-y-4">
            <div className="flex items-end gap-2 max-w-[80%] sm:max-w-[70%]">
              <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700/60 animate-pulse shrink-0" />
              <div className="h-12 w-52 sm:w-64 rounded-2xl rounded-bl-xs bg-gray-200 dark:bg-gray-700/60 animate-pulse" />
            </div>
            <div className="flex items-end justify-end">
              <div className="h-10 w-40 sm:w-48 rounded-2xl rounded-br-xs bg-primary-100 dark:bg-primary-950/40 animate-pulse" />
            </div>
            <div className="flex items-end gap-2 max-w-[80%] sm:max-w-[70%]">
              <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700/60 animate-pulse shrink-0" />
              <div className="h-16 w-60 sm:w-72 rounded-2xl rounded-bl-xs bg-gray-200 dark:bg-gray-700/60 animate-pulse" />
            </div>
            <div className="flex items-end justify-end">
              <div className="h-12 w-52 sm:w-60 rounded-2xl rounded-br-xs bg-primary-100 dark:bg-primary-950/40 animate-pulse" />
            </div>
          </div>
        ) : messages.length === 0 ? (
          /* Empty Conversation State */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#65676b] dark:text-[#b0b3b8]">
            <div className="h-16 w-16 rounded-full bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center text-primary-500 mb-3 shadow-xs">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-[#050505] dark:text-white">
              {locale === 'bn' ? 'কথোপকথন শুরু করুন' : 'Say Salam & start chatting'}
            </h3>
            <p className="text-xs max-w-xs mt-1 text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
              {locale === 'bn'
                ? 'প্রথম মেসেজটি পাঠিয়ে আন্তরিক যোগাযোগ গড়ে তুলুন'
                : 'Send your first message or a warm Salam to start your conversation'}
            </p>
          </div>
        ) : (
          /* Message List Items with Grouping */
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            const prevMsg = messages[index - 1];
            const nextMsg = messages[index + 1];

            // Show avatar only if next message is from a different sender or doesn't exist
            const showAvatar = !isMe && (!nextMsg || nextMsg.senderId !== msg.senderId);

            // Show date separator if message date differs from previous message date
            let showTimestampHeader = false;
            if (!prevMsg) {
              showTimestampHeader = true;
            } else {
              const prevDate = new Date(prevMsg.createdAt).toDateString();
              const currDate = new Date(msg.createdAt).toDateString();
              showTimestampHeader = prevDate !== currDate;
            }

            return (
              <MessageFeedItem
                key={msg.id}
                message={msg}
                isMe={isMe}
                showAvatar={showAvatar}
                showTimestampHeader={showTimestampHeader}
                otherUser={otherUser}
                onStartEdit={onStartEdit}
                onDeleteMessage={onDeleteMessage}
              />
            );
          })
        )}

        {/* Real-time Typing Indicator Bubble in Feed */}
        {isOtherUserTyping && (
          <div className="flex items-end gap-2 justify-start animate-in fade-in duration-200">
            <div className="h-7 w-7 rounded-full bg-primary-500 text-white font-bold flex items-center justify-center text-[10px] shadow-2xs shrink-0">
              {otherUser?.name?.trim().charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="bg-[#f0f2f5] dark:bg-[#3a3b3c] px-3.5 py-2 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" />
            </div>
          </div>
        )}

        {/* Bottom Anchor for Auto-scroll */}
        <div ref={bottomAnchorRef} className="h-1" />
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-150 cursor-pointer"
        >
          <span>{locale === 'bn' ? 'নতুন মেসেজ' : 'New messages'}</span>
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
