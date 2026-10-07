'use client';

import React from 'react';
import { ChatAvatar } from './ChatAvatar';
import { usePathname } from 'next/navigation';
import { SquarePen, X } from 'lucide-react';
import { useChatStore } from '@/stores/useChatStore';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTotalUnreadCount } from '@/features/chat';
import { ActiveChat } from '../types/chat.types';
import { ChatBox } from './ChatBox';
import { cn } from '@/lib/utils/cn';

export function ChatDock() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { locale } = useLanguage();
  const activeChats = useChatStore((state) => state.activeChats);
  const toggleMinimize = useChatStore((state) => state.toggleMinimize);
  const closeChat = useChatStore((state) => state.closeChat);
  const isUserOnline = useChatStore((state) => state.isUserOnline);
  const isMessengerOpen = useChatStore((state) => state.isMessengerDropdownOpen);
  const setIsMessengerOpen = useChatStore((state) => state.setIsMessengerDropdownOpen);
  const totalUnread = useTotalUnreadCount();

  const isMessagesPage = pathname === '/messages' || pathname.startsWith('/messages/');

  if (!isAuthenticated) {
    return null;
  }

  const openChats = activeChats.filter((c) => !c.isMinimized);
  const minimizedChats = activeChats.filter((c) => c.isMinimized);

  return (
    <div className={cn(isMessagesPage && 'hidden')}>
      {/* 1. Open Chat Windows (Mobile: Full-screen Messenger view; Desktop: Bottom-right docked) */}
      {openChats.length > 0 && (
        <div className="fixed inset-0 z-50 sm:inset-auto sm:bottom-4 md:bottom-6 sm:right-20 sm:z-50 pointer-events-auto flex items-end sm:gap-3">
          {openChats.map((activeChat, idx) => (
            <ChatBox
              key={activeChat.user.id}
              activeChat={activeChat}
              isMobileActive={idx === openChats.length - 1}
            />
          ))}
        </div>
      )}

      {/* 2. Floating Right Stack: Minimized Chat Heads + Compose Button */}
      {/* On mobile: hidden when a chat is open in full-screen; visible on desktop */}
      <div
        className={cn(
          'fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-center gap-2.5 pointer-events-auto select-none',
          openChats.length > 0 && 'hidden sm:flex',
        )}
      >
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
                className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <ChatAvatar
                  src={activeChat.user.avatarUrl}
                  name={activeChat.user.name}
                  size="lg"
                  isOnline={isOnline}
                  className="rounded-full shadow-xl border-2 border-white dark:border-[#242526]"
                />
              </div>
            </div>
          );
        })}

        {/* Floating Compose / Messenger Button (White circle with SquarePen icon) */}
        {/* Opens the SAME top MessengerDropdown as Navbar */}
        <button
          type="button"
          data-messenger-trigger="true"
          onClick={() => setIsMessengerOpen((prev) => !prev)}
          className={cn(
            'relative h-12 w-12 sm:h-13 sm:w-13 rounded-full bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer text-[#050505] dark:text-[#e4e6eb] group',
            isMessengerOpen && 'ring-2 ring-primary-500/50 bg-gray-50 dark:bg-[#2d2e2f]',
          )}
          title={locale === 'bn' ? 'মেসেজ' : 'Messages'}
          aria-expanded={isMessengerOpen}
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
            {locale === 'bn' ? 'মেসেজ' : 'Messages'}
          </div>
        </button>
      </div>
    </div>
  );
}
