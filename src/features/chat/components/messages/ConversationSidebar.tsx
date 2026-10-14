'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, SquarePen, X, MessageSquare, AlertCircle, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { ConversationItem } from '@/features/chat/types/chat.types';
import { ConversationItemView } from './ConversationItemView';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

interface ConversationSidebarProps {
  conversations: ConversationItem[];
  selectedConversationId?: string;
  onSelectConversation: (conversation: ConversationItem) => void;
  onOpenNewMessage: () => void;
  isLoading: boolean;
  isError: boolean;
  totalUnreadCount?: number;
}

export function ConversationSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onOpenNewMessage,
  isLoading,
  isError,
  totalUnreadCount = 0,
}: ConversationSidebarProps) {
  const { locale } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations by participant name or username
  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return conversations;

    return conversations.filter((c) => {
      const p = c.otherUser || c.participant;
      if (!p) return false;
      const name = p.name?.toLowerCase() || '';
      const username = p.username?.toLowerCase() || '';
      const lastMsg = c.lastMessageText?.toLowerCase() || '';
      return name.includes(q) || username.includes(q) || lastMsg.includes(q);
    });
  }, [conversations, searchQuery]);

  return (
    <aside className="w-full h-full flex flex-col bg-white dark:bg-[#18191a] md:bg-transparent overflow-hidden select-none py-2 sm:py-3 lg:py-4 pr-0 md:pr-1">
      {/* Top Header */}
      <div className="px-2 pb-2.5 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href={ROUTES.HOME}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e4e6eb]/70 hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
            title={locale === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#050505] dark:text-white truncate">
            {locale === 'bn' ? 'মেসেজ' : 'Chats'}
          </h1>
          {totalUnreadCount > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </span>
          )}
        </div>

        {/* New Message Action Button */}
        <button
          type="button"
          onClick={onOpenNewMessage}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e4e6eb]/70 hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] hover:text-primary-600 dark:hover:text-primary-400 transition-all cursor-pointer shadow-2xs group"
          title={locale === 'bn' ? 'নতুন মেসেজ শুরু করুন' : 'New Message'}
        >
          <SquarePen className="h-4.5 w-4.5 stroke-[2.2] group-hover:scale-105 transition-transform" />
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="px-2 pb-2 shrink-0">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-[#65676b] dark:text-[#b0b3b8] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === 'bn'
                ? 'মেসেজ বা ফ্রেন্ড খুঁজুন...'
                : 'Search chats or friends...'
            }
            className="w-full rounded-xl bg-[#e4e6eb]/70 dark:bg-[#3a3b3c] pl-9 pr-8 py-2 text-sm text-[#050505] dark:text-[#e4e6eb] placeholder-[#65676b] dark:placeholder-[#b0b3b8] outline-hidden focus:ring-2 focus:ring-primary-500/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 rounded-full text-[#65676b] hover:bg-[#d8dadf] dark:hover:bg-[#4e4f50] transition-colors"
              title={locale === 'bn' ? 'মুছে ফেলুন' : 'Clear'}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Conversations List Scroll Area */}
      <div className="flex-1 overflow-y-auto px-1 space-y-0.5 overscroll-contain no-scrollbar scrollbar-none">
        {isLoading ? (
          // Loading Skeletons
          <div className="space-y-1 p-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-2.5 py-2 rounded-xl animate-pulse"
              >
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700/60 shrink-0" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="h-3.5 bg-gray-200 dark:bg-gray-700/60 rounded-md w-3/5" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700/60 rounded-md w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 text-center text-[#65676b] dark:text-[#b0b3b8]">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500 opacity-80" />
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
              {locale === 'bn'
                ? 'কথোপকথন লোড করতে ব্যর্থ হয়েছে'
                : 'Failed to load conversations'}
            </p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="py-12 px-4 text-center text-[#65676b] dark:text-[#b0b3b8]">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30 text-primary-500" />
            <p className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
              {searchQuery.trim()
                ? locale === 'bn'
                  ? 'কোনো ফলাফল পাওয়া যায়নি'
                  : 'No conversations found'
                : locale === 'bn'
                  ? 'এখনো কোনো মেসেজ নেই'
                  : 'No messages yet'}
            </p>
            <p className="text-xs mt-1 max-w-[220px] mx-auto leading-relaxed">
              {searchQuery.trim()
                ? locale === 'bn'
                  ? 'অন্য নাম বা ইউজারনেম দিয়ে আবার চেষ্টা করুন'
                  : 'Try searching with a different name'
                : locale === 'bn'
                  ? 'কাউকে মেসেজ পাঠাতে উপরের বোতামে চাপুন'
                  : 'Click the button above to start your first chat'}
            </p>
            {!searchQuery.trim() && (
              <button
                type="button"
                onClick={onOpenNewMessage}
                className="mt-4 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs transition-colors shadow-xs"
              >
                {locale === 'bn' ? 'মেসেজ শুরু করুন' : 'Start a chat'}
              </button>
            )}
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItemView
              key={conv.id}
              conversation={conv}
              isSelected={conv.id === selectedConversationId}
              onSelect={onSelectConversation}
            />
          ))
        )}
      </div>
    </aside>
  );
}
