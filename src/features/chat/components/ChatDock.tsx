'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { SquarePen, X, Search, MessageSquare } from 'lucide-react';
import { useChatStore } from '@/stores/useChatStore';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { useConversations, useTotalUnreadCount } from '@/features/chat';
import { ActiveChat } from '../types/chat.types';
import { ChatBox } from './ChatBox';
import { cn } from '@/lib/utils/cn';

export function ChatDock() {
  const { isAuthenticated } = useAuth();
  const { locale } = useLanguage();
  const activeChats = useChatStore((state) => state.activeChats);
  const toggleMinimize = useChatStore((state) => state.toggleMinimize);
  const closeChat = useChatStore((state) => state.closeChat);
  const isUserOnline = useChatStore((state) => state.isUserOnline);
  const totalUnread = useTotalUnreadCount();

  const [isFloatingMessengerOpen, setIsFloatingMessengerOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close floating messenger when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!isFloatingMessengerOpen) return;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsFloatingMessengerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isFloatingMessengerOpen]);

  if (!isAuthenticated) {
    return null;
  }

  const openChats = activeChats.filter((c) => !c.isMinimized);
  const minimizedChats = activeChats.filter((c) => c.isMinimized);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-50 flex items-end gap-3 pointer-events-none select-none">
      {/* 1. Open Chat Windows (side-by-side to the left) */}
      <div className="flex items-end gap-3 pointer-events-auto">
        {openChats.map((activeChat) => (
          <ChatBox key={activeChat.user.id} activeChat={activeChat} />
        ))}
      </div>

      {/* 2. Floating Right Stack: Minimized Chat Heads + Compose Button */}
      <div className="flex flex-col items-center gap-2.5 pointer-events-auto relative">
        {/* Floating Messenger Popover (anchored above the compose button) */}
        {isFloatingMessengerOpen && (
          <div
            ref={popoverRef}
            className="absolute bottom-16 right-0 z-50"
          >
            <FloatingMessengerPanel
              onClose={() => setIsFloatingMessengerOpen(false)}
            />
          </div>
        )}

        {/* Minimized Chat Heads (stacked vertically like Facebook) */}
        {minimizedChats.map((activeChat) => {
          const isOnline = isUserOnline(activeChat.user.id);

          return (
            <div
              key={activeChat.user.id}
              className="relative group cursor-pointer animate-in fade-in zoom-in-90 duration-150"
            >
              {/* Tooltip on left */}
              <div className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1c1e21] text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                {activeChat.user.name}
              </div>

              {/* Close Button on Hover */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeChat(activeChat.user.id);
                }}
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gray-700 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md z-30 cursor-pointer"
                title="Close"
              >
                <X className="h-2.5 w-2.5 stroke-[3]" />
              </button>

              {/* Circular Avatar */}
              <div
                onClick={() => toggleMinimize(activeChat.user.id)}
                className="relative h-12 w-12 sm:h-13 sm:w-13 rounded-full overflow-hidden bg-primary-500 text-white font-bold flex items-center justify-center text-sm shadow-xl border-2 border-white dark:border-[#242526] hover:scale-105 active:scale-95 transition-transform"
              >
                {activeChat.user.avatarUrl ? (
                  <Image
                    src={activeChat.user.avatarUrl}
                    alt={activeChat.user.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span>{activeChat.user.name?.charAt(0) || 'U'}</span>
                )}
              </div>

              {/* Online indicator */}
              {isOnline && (
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#242526] shadow-2xs" />
              )}
            </div>
          );
        })}

        {/* Floating Compose / Messenger Button (White circle with SquarePen icon) */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsFloatingMessengerOpen((prev) => !prev)}
          className={cn(
            'relative h-12 w-12 sm:h-13 sm:w-13 rounded-full bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer text-[#050505] dark:text-[#e4e6eb] group',
            isFloatingMessengerOpen && 'ring-2 ring-primary-500/50 bg-gray-50 dark:bg-[#2d2e2f]',
          )}
          title={locale === 'bn' ? 'নতুন মেসেজ' : 'New message'}
        >
          <SquarePen className="h-5 w-5 stroke-[2.2]" />

          {/* Unread Message Badge */}
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-[#242526] shadow-sm">
              {totalUnread > 9 ? '9+' : totalUnread}
            </span>
          )}

          {/* Tooltip on left */}
          <div className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1c1e21] text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
            {locale === 'bn' ? 'নতুন চ্যাট' : 'New chat'}
          </div>
        </button>
      </div>
    </div>
  );
}

interface FloatingMessengerPanelProps {
  onClose: () => void;
}

function FloatingMessengerPanel({ onClose }: FloatingMessengerPanelProps) {
  const { locale } = useLanguage();
  const { data: conversations = [], isLoading } = useConversations();
  const openChat = useChatStore((state) => state.openChat);
  const isUserOnline = useChatStore((state) => state.isUserOnline);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    const participant = conv.otherUser || conv.participant;
    if (!participant) return false;
    const name = participant.name || '';
    const username = participant.username || '';
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || username.toLowerCase().includes(q);
  });

  const formatMessageTime = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return locale === 'bn' ? 'এইমাত্র' : 'Just now';
    if (diffMins < 60) return `${diffMins}${locale === 'bn' ? 'মি' : 'm'}`;
    if (diffHours < 24) return `${diffHours}${locale === 'bn' ? 'ঘ' : 'h'}`;
    if (diffDays === 1) return locale === 'bn' ? 'গতকাল' : '1d';
    return `${diffDays}${locale === 'bn' ? 'দিন' : 'd'}`;
  };

  return (
    <div className="w-[320px] sm:w-[350px] max-h-[460px] rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="p-3 border-b border-[#e4e6eb] dark:border-[#393a3b] flex items-center justify-between">
        <h3 className="font-bold text-base text-[#050505] dark:text-[#e4e6eb]">
          {locale === 'bn' ? 'চ্যাট' : 'Chats'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full text-[#65676b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-[#e4e6eb] dark:border-[#393a3b]">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-[#65676b] dark:text-[#b0b3b8] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'bn' ? 'মেসেঞ্জারে খুঁজুন...' : 'Search Messenger...'}
            className="w-full rounded-full bg-[#f0f2f5] dark:bg-[#3a3b3c] py-1.5 pl-9 pr-3 text-xs sm:text-sm text-[#050505] dark:text-[#e4e6eb] placeholder:text-[#65676b] dark:placeholder:text-[#b0b3b8] border-none outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-transparent p-1.5 max-h-[350px]">
        {isLoading ? (
          <div className="p-6 text-center text-xs text-[#65676b] dark:text-[#b0b3b8]">
            {locale === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#65676b] dark:text-[#b0b3b8] space-y-1">
            <MessageSquare className="h-6 w-6 mx-auto opacity-50 mb-1" />
            <p className="font-semibold text-sm text-[#050505] dark:text-[#e4e6eb]">
              {searchQuery
                ? locale === 'bn'
                  ? 'কোনো ফলাফল পাওয়া যায়নি'
                  : 'No conversations found'
                : locale === 'bn'
                ? 'কোনো চ্যাট নেই'
                : 'No conversations yet'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const participant = conv.otherUser || conv.participant;
            if (!participant) return null;
            const isOnline = isUserOnline(participant.id);
            const hasUnread = conv.unreadCount > 0;

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => {
                  openChat(participant, conv.id);
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 p-2 rounded-xl transition-colors text-left hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] cursor-pointer',
                  hasUnread && 'bg-primary-50/40 dark:bg-primary-950/20',
                )}
              >
                <div className="relative shrink-0">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden bg-primary-500 text-white font-bold flex items-center justify-center text-xs">
                    {participant.avatarUrl ? (
                      <Image
                        src={participant.avatarUrl}
                        alt={participant.name || 'User'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span>{participant.name?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white dark:border-[#242526]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p
                      className={cn(
                        'text-xs truncate',
                        hasUnread
                          ? 'font-bold text-[#050505] dark:text-white'
                          : 'font-semibold text-[#050505] dark:text-[#e4e6eb]',
                      )}
                    >
                      {participant.name}
                    </p>
                    {conv.lastMessageAt && (
                      <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] shrink-0">
                        {formatMessageTime(conv.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      'text-[11px] truncate mt-0.5',
                      hasUnread
                        ? 'font-semibold text-[#050505] dark:text-[#e4e6eb]'
                        : 'text-[#65676b] dark:text-[#b0b3b8]',
                    )}
                  >
                    {conv.lastMessageText || (locale === 'bn' ? 'মেসেজ পাঠান' : 'Start chatting')}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
