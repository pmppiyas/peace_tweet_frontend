'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  X,
  MessageSquare,
  AlertCircle,
  ArrowLeft,
  Loader2,
  UserX,
  MessageCircle,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { ConversationItem, ChatUser } from '@/features/chat/types/chat.types';
import { ConversationItemView } from './ConversationItemView';
import { useLanguage } from '@/providers/LanguageProvider';
import { useChatStore } from '@/stores/useChatStore';
import { searchApi } from '@/features/search/api/search.api';
import { chatApi } from '@/features/chat/api/chat.api';
import { useAuth } from '@/hooks/useAuth';
import { useFriends } from '@/features/friends/hooks/useFriends';
import { friendsApi } from '@/features/friends/api/friends.api';

interface ConversationSidebarProps {
  conversations: ConversationItem[];
  selectedConversationId?: string;
  onSelectConversation: (conversation: ConversationItem) => void;
  isLoading: boolean;
  isError: boolean;
  totalUnreadCount?: number;
}

export function ConversationSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading,
  isError,
  totalUnreadCount = 0,
}: ConversationSidebarProps) {
  const { locale } = useLanguage();
  const { user: authUser } = useAuth();
  const chatSearchQuery = useChatStore((state) => state.chatSearchQuery);
  const setChatSearchQuery = useChatStore((state) => state.setChatSearchQuery);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Fetch cached friends to accurately determine friendship status
  const { data: cachedFriendsData } = useFriends('', undefined, Boolean(authUser?.id));
  const allCachedFriendIds = useMemo(() => {
    const items = cachedFriendsData?.pages?.flatMap((p) => p?.items || []) || [];
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.friendId) set.add(item.friendId);
      if (item.user?.id) set.add(item.user.id);
    });
    return set;
  }, [cachedFriendsData]);

  const [friendResults, setFriendResults] = useState<ChatUser[]>([]);
  const [otherResults, setOtherResults] = useState<ChatUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [creatingForUserId, setCreatingForUserId] = useState<string | null>(null);

  const activeQuery = (chatSearchQuery || localSearchQuery).trim().toLowerCase();

  // Search users/friends debounced when searching - split into Friends (top) and Others (bottom)
  useEffect(() => {
    if (!activeQuery) {
      setFriendResults([]);
      setOtherResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    let isCancelled = false;

    const timer = setTimeout(async () => {
      try {
        const [friendsRes, globalRes] = await Promise.allSettled([
          friendsApi.getFriends({ search: activeQuery, limit: 20 }),
          searchApi.searchGlobal({ q: activeQuery, type: 'USERS', limit: 30 }),
        ]);

        if (isCancelled) return;

        // 1. Process friends search response
        const rawFriendItems: any[] =
          friendsRes.status === 'fulfilled'
            ? friendsRes.value?.data?.items ||
              friendsRes.value?.items ||
              (Array.isArray(friendsRes.value?.data) ? friendsRes.value.data : [])
            : [];

        const directFriends: ChatUser[] = rawFriendItems
          .map((item: any) => {
            const u = item.user || item;
            return {
              id: u.id || item.friendId,
              name: u.name,
              username: u.username,
              avatarUrl: u.avatarUrl || u.avatar || null,
              userStatus: u.userStatus,
            };
          })
          .filter((u) => u.id && u.id !== authUser?.id);

        // Combined set of known friend IDs
        const friendIdSet = new Set<string>(directFriends.map((f) => f.id));
        allCachedFriendIds.forEach((id) => friendIdSet.add(id));

        // 2. Process global users search response (always exclude self)
        const globalUsers: ChatUser[] =
          globalRes.status === 'fulfilled'
            ? (globalRes.value?.users || [])
                .map((u) => ({
                  id: u.id,
                  name: u.name,
                  username: u.username,
                  avatarUrl: u.avatarUrl || null,
                  userStatus: u.userStatus,
                }))
                .filter((u) => u.id && u.id !== authUser?.id)
            : [];

        // 3. Partition into Friends (top) and Others (bottom)
        const friendsList: ChatUser[] = [...directFriends];
        const addedFriendIds = new Set<string>(directFriends.map((f) => f.id));
        const othersList: ChatUser[] = [];

        globalUsers.forEach((u) => {
          if (friendIdSet.has(u.id)) {
            if (!addedFriendIds.has(u.id)) {
              friendsList.push(u);
              addedFriendIds.add(u.id);
            }
          } else {
            othersList.push(u);
          }
        });

        setFriendResults(friendsList);
        setOtherResults(othersList);
      } catch (err) {
        console.error('Failed to search friends and users:', err);
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [activeQuery, authUser?.id, allCachedFriendIds]);

  const handleSelectUser = async (targetUser: ChatUser) => {
    // Prevent starting conversation with oneself or multiple simultaneous requests
    if (creatingForUserId || !targetUser?.id || targetUser.id === authUser?.id) return;
    setCreatingForUserId(targetUser.id);
    try {
      const res = await chatApi.getOrCreateConversation(targetUser.id);
      if (res.data) {
        onSelectConversation(res.data);
        setLocalSearchQuery('');
        setChatSearchQuery('');
      }
    } catch (err) {
      console.error('Failed to open chat:', err);
    } finally {
      setCreatingForUserId(null);
    }
  };

  const renderUserItem = (user: ChatUser, isFriend: boolean) => {
    const isCreatingThis = creatingForUserId === user.id;
    return (
      <button
        key={user.id}
        type="button"
        disabled={Boolean(creatingForUserId)}
        onClick={() => handleSelectUser(user)}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[#e4e6eb]/70 dark:hover:bg-[#3a3b3c]/60 transition-colors text-left group cursor-pointer disabled:opacity-60"
      >
        {/* Avatar */}
        <div className="relative h-11 w-11 shrink-0 rounded-full overflow-hidden bg-primary-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name || 'User'}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span>{user.name?.charAt(0) || 'U'}</span>
          )}
        </div>

        {/* Name & Username */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[15px] font-bold text-[#050505] dark:text-[#e4e6eb] truncate leading-tight">
              {user.name}
            </p>
            {isFriend && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                {locale === 'bn' ? 'ফ্রেন্ড' : 'Friend'}
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#65676b] dark:text-[#b0b3b8] truncate mt-0.5 leading-normal">
            @{user.username}
          </p>
        </div>

        {/* Action Icon / Spinner */}
        <div className="shrink-0 text-primary-600 dark:text-primary-400">
          {isCreatingThis ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-primary-600 dark:text-primary-400 group-hover:scale-105 transition-transform shadow-2xs">
              <MessageCircle className="h-4 w-4" />
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <aside className="w-full h-full flex flex-col bg-white dark:bg-[#18191a] md:bg-transparent overflow-hidden select-none py-2 sm:py-3 lg:py-4 pr-0 md:pr-1">
      {/* Top Header (Desktop only - Mobile has title & search in the top navbar) */}
      <div className="hidden md:flex px-2 pb-2.5 items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href={ROUTES.HOME}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e4e6eb]/70 hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
            title={locale === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-[#050505] dark:text-white truncate">
            {locale === 'bn' ? 'মেসেজ' : 'Messages'}
          </h1>
          {totalUnreadCount > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Desktop Search Input Bar */}
      <div className="hidden md:block px-2 pb-2 shrink-0">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-[#65676b] dark:text-[#b0b3b8] pointer-events-none" />
          <input
            type="text"
            value={chatSearchQuery || localSearchQuery}
            onChange={(e) => {
              setLocalSearchQuery(e.target.value);
              setChatSearchQuery(e.target.value);
            }}
            placeholder={
              locale === 'bn'
                ? 'ফ্রেন্ড বা ইউজার খুঁজুন...'
                : 'Search friends or users...'
            }
            className="w-full rounded-xl bg-[#e4e6eb]/70 dark:bg-[#3a3b3c] pl-9 pr-8 py-2 text-sm text-[#050505] dark:text-[#e4e6eb] placeholder-[#65676b] dark:placeholder-[#b0b3b8] border-0 outline-none focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all"
          />
          {(chatSearchQuery || localSearchQuery) && (
            <button
              type="button"
              onClick={() => {
                setLocalSearchQuery('');
                setChatSearchQuery('');
              }}
              className="absolute right-2.5 p-1 rounded-full text-[#65676b] hover:bg-[#d8dadf] dark:hover:bg-[#4e4f50] transition-colors cursor-pointer"
              title={locale === 'bn' ? 'মুছে ফেলুন' : 'Clear'}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area: Conversations or Friends Search Results */}
      <div className="flex-1 overflow-y-auto px-1 space-y-0.5 overscroll-contain no-scrollbar scrollbar-none pb-16 md:pb-2">
        {activeQuery ? (
          // Friends & Others Search Results View
          isSearching ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#65676b] dark:text-[#b0b3b8]">
              <Loader2 className="h-6 w-6 animate-spin text-primary-500 mb-2" />
              <p className="text-xs font-medium">
                {locale === 'bn' ? 'খোঁজা হচ্ছে...' : 'Searching...'}
              </p>
            </div>
          ) : friendResults.length === 0 && otherResults.length === 0 ? (
            <div className="py-12 px-4 text-center text-[#65676b] dark:text-[#b0b3b8]">
              <UserX className="h-10 w-10 mx-auto mb-2 opacity-30 text-primary-500" />
              <p className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
                {locale === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No results found'}
              </p>
              <p className="text-xs mt-1 max-w-[220px] mx-auto leading-relaxed">
                {locale === 'bn'
                  ? 'অন্য নাম বা ইউজারনেম দিয়ে আবার চেষ্টা করুন'
                  : 'Try searching with a different name or username'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* 1. Friends Section (Top) */}
              {friendResults.length > 0 && (
                <div className="space-y-0.5">
                  <div className="px-2.5 py-1 text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider flex items-center justify-between">
                    <span>{locale === 'bn' ? 'ফ্রেন্ডস' : 'Friends'}</span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded-full">
                      {friendResults.length}
                    </span>
                  </div>
                  {friendResults.map((user) => renderUserItem(user, true))}
                </div>
              )}

              {/* 2. Others Section (Bottom) */}
              {otherResults.length > 0 && (
                <div className="space-y-0.5">
                  <div className="px-2.5 py-1 text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider flex items-center justify-between">
                    <span>{locale === 'bn' ? 'অন্যান্য' : 'Others'}</span>
                    <span className="text-[10px] bg-gray-100 dark:bg-[#3a3b3c] text-[#65676b] dark:text-[#b0b3b8] font-bold px-1.5 py-0.5 rounded-full">
                      {otherResults.length}
                    </span>
                  </div>
                  {otherResults.map((user) => renderUserItem(user, false))}
                </div>
              )}
            </div>
          )
        ) : isLoading ? (
          // Loading Skeletons
          <div className="space-y-0.5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-2 py-2 rounded-xl animate-pulse"
              >
                <div className="h-11 w-11 rounded-full bg-gray-200 dark:bg-gray-700/60 shrink-0" />
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
                ? 'মেসেজ লোড করতে ব্যর্থ হয়েছে'
                : 'Failed to load messages'}
            </p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="py-12 px-4 text-center text-[#65676b] dark:text-[#b0b3b8]">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30 text-primary-500" />
            <p className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
              {locale === 'bn' ? 'এখনো কোনো মেসেজ নেই' : 'No messages yet'}
            </p>
            <p className="text-xs mt-1 max-w-[220px] mx-auto leading-relaxed">
              {locale === 'bn'
                ? 'ফ্রেন্ড খুঁজতে ওপরের সার্চ আইকন ব্যবহার করুন'
                : 'Use search above to find a friend and start chatting'}
            </p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationItemView
              key={conversation.id}
              conversation={conversation}
              isSelected={conversation.id === selectedConversationId}
              onSelect={onSelectConversation}
            />
          ))
        )}
      </div>
    </aside>
  );
}
