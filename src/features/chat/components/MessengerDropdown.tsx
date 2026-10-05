'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MessageSquare, ExternalLink, X } from 'lucide-react';
import { useConversations } from '../hooks/useConversations';
import { useChatStore } from '@/stores/useChatStore';
import { useLanguage } from '@/providers/LanguageProvider';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';

interface MessengerDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

export function MessengerDropdown({
  isOpen,
  onClose,
  triggerRef,
}: MessengerDropdownProps) {
  const { locale } = useLanguage();
  const { data: conversations = [], isLoading } = useConversations();
  const openChat = useChatStore((state) => state.openChat);
  const isUserOnline = useChatStore((state) => state.isUserOnline);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!isOpen) return;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

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
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] max-w-[95vw] rounded-2xl border border-[#e4e6eb] bg-white shadow-2xl dark:border-[#393a3b] dark:bg-[#242526] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[520px]"
    >
      {/* Header */}
      <div className="p-3.5 pb-2 border-b border-[#e4e6eb] dark:border-[#393a3b] flex items-center justify-between">
        <h3 className="font-bold text-lg text-[#050505] dark:text-[#e4e6eb] flex items-center gap-2">
          <span>{locale === 'bn' ? 'চ্যাট' : 'Chats'}</span>
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-[#65676b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors"
          title={locale === 'bn' ? 'বন্ধ করুন' : 'Close'}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3.5 pt-2 pb-1.5">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-[#65676b] dark:text-[#b0b3b8] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === 'bn' ? 'মেসেঞ্জারে খুঁজুন...' : 'Search Messenger...'
            }
            className="w-full rounded-full bg-[#f0f2f5] dark:bg-[#3a3b3c] py-2 pl-9 pr-3 text-xs sm:text-sm text-[#050505] dark:text-[#e4e6eb] placeholder:text-[#65676b] dark:placeholder:text-[#b0b3b8] border-none focus:outline-hidden focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-transparent p-1.5">
        {isLoading ? (
          <div className="space-y-3 p-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-32 rounded-sm bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-48 rounded-sm bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f2f5] dark:bg-[#3a3b3c] text-[#65676b] dark:text-[#b0b3b8]">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-[#050505] dark:text-[#e4e6eb]">
              {searchQuery
                ? locale === 'bn'
                  ? 'কোনো ফলাফল পাওয়া যায়নি'
                  : 'No conversations found'
                : locale === 'bn'
                  ? 'কোনো মেসেজ নেই'
                  : 'No messages yet'}
            </p>
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] max-w-xs">
              {locale === 'bn'
                ? 'আপনার বন্ধুদের সাথে কানেক্ট করুন এবং কথা বলুন।'
                : 'Connect with your friends and start messaging.'}
            </p>
            <Link
              href={ROUTES.FRIENDS.HOME}
              onClick={onClose}
              className="mt-2 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
            >
              {locale === 'bn' ? 'বন্ধু তালিকা দেখুন' : 'View Friends'}
            </Link>
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
                  'w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors text-left hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]',
                  hasUnread && 'bg-primary-50/40 dark:bg-primary-950/20',
                )}
              >
                {/* Avatar with Online Status Dot */}
                <div className="relative shrink-0">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-primary-500 text-white font-bold flex items-center justify-center">
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
                    <span
                      className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#242526]"
                      title="Online"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p
                      className={cn(
                        'text-sm truncate',
                        hasUnread
                          ? 'font-bold text-[#050505] dark:text-white'
                          : 'font-semibold text-[#050505] dark:text-[#e4e6eb]',
                      )}
                    >
                      {participant.name}
                    </p>
                    {conv.lastMessageAt && (
                      <span
                        className={cn(
                          'text-[11px] shrink-0',
                          hasUnread
                            ? 'font-bold text-primary-600 dark:text-primary-400'
                            : 'text-[#65676b] dark:text-[#b0b3b8]',
                        )}
                      >
                        {formatMessageTime(conv.lastMessageAt)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p
                      className={cn(
                        'text-xs truncate',
                        hasUnread
                          ? 'font-semibold text-[#050505] dark:text-[#e4e6eb]'
                          : 'text-[#65676b] dark:text-[#b0b3b8]',
                      )}
                    >
                      {conv.lastMessageText ||
                        (locale === 'bn'
                          ? 'কথোপকথন শুরু করুন'
                          : 'Start a conversation')}
                    </p>
                    {hasUnread && (
                      <span className="h-2.5 w-2.5 rounded-full bg-primary-600 shrink-0" />
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-[#e4e6eb] dark:border-[#393a3b] bg-gray-50/50 dark:bg-[#202122] text-center">
        <Link
          href={ROUTES.FRIENDS.HOME}
          onClick={onClose}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
        >
          <span>{locale === 'bn' ? 'সকল বন্ধু ও মেসেজ দেখুন' : 'See all in Friends'}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
