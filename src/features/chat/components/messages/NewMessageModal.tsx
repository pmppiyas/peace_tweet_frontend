'use client';

import React, { useState, useEffect } from 'react';
import { ChatAvatar } from '../ChatAvatar';
import { Search, Loader2, UserCheck, MessageSquare, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { friendsApi } from '@/features/friends/api/friends.api';
import { searchApi } from '@/features/search/api/search.api';
import { chatApi } from '@/features/chat/api/chat.api';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { ChatUser, ConversationItem } from '@/features/chat/types/chat.types';
import { cn } from '@/lib/utils/cn';

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (conversation: ConversationItem) => void;
}

export function NewMessageModal({
  isOpen,
  onClose,
  onSelectConversation,
}: NewMessageModalProps) {
  const { locale } = useLanguage();
  const { user: authUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<ChatUser[]>([]);
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Load friends when modal opens
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      return;
    }

    let isMounted = true;
    setIsLoadingFriends(true);
    friendsApi
      .getFriends({ limit: 30 })
      .then((res) => {
        if (!isMounted) return;
        const list = (res.data?.items || [])
          .map((item) => ({
            id: item.user.id,
            name: item.user.name,
            username: item.user.username,
            avatarUrl: item.user.avatarUrl || item.user.avatar || null,
          }))
          .filter((u) => u.id !== authUser?.id);
        setFriends(list);
      })
      .catch((err) => {
        console.error('Failed to load friends:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingFriends(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, authUser?.id]);

  // Debounced search for users (always exclude current user)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      searchApi
        .searchGlobal({ q: trimmed, type: 'USERS', limit: 20 })
        .then((res) => {
          const users: ChatUser[] = (res.users || [])
            .map((u) => ({
              id: u.id,
              name: u.name,
              username: u.username,
              avatarUrl: u.avatarUrl,
              userStatus: u.userStatus,
            }))
            .filter((u) => u.id !== authUser?.id);
          setSearchResults(users);
        })
        .catch((err) => {
          console.error('Search failed:', err);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, authUser?.id]);

  const handleSelectUser = async (targetUser: ChatUser) => {
    if (isCreating || !targetUser?.id || targetUser.id === authUser?.id) return;
    setIsCreating(true);
    setSelectedUserId(targetUser.id);

    try {
      const res = await chatApi.getOrCreateConversation(targetUser.id);
      if (res.data) {
        onSelectConversation(res.data);
        onClose();
      }
    } catch (err) {
      console.error('Failed to start conversation:', err);
    } finally {
      setIsCreating(false);
      setSelectedUserId(null);
    }
  };

  const { searchFriends, searchOthers } = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return { searchFriends: friends, searchOthers: [] };
    }
    const friendIdSet = new Set(friends.map((f) => f.id));
    const sf: ChatUser[] = [];
    const so: ChatUser[] = [];
    searchResults.forEach((u) => {
      if (friendIdSet.has(u.id)) {
        sf.push(u);
      } else {
        so.push(u);
      }
    });
    return { searchFriends: sf, searchOthers: so };
  }, [searchQuery, friends, searchResults]);

  const totalUsersCount = searchFriends.length + searchOthers.length;

  const renderModalUserRow = (u: ChatUser, isFriend: boolean) => {
    const isPendingThis = isCreating && selectedUserId === u.id;
    return (
      <button
        key={u.id}
        type="button"
        onClick={() => handleSelectUser(u)}
        disabled={isCreating}
        className="w-full flex items-center justify-between p-2.5 md:p-3 rounded-2xl hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors text-left group cursor-pointer disabled:opacity-60"
      >
        <div className="flex items-center gap-3 md:gap-3.5 min-w-0">
          <ChatAvatar
            src={u.avatarUrl}
            name={u.name}
            size="md"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm md:text-base font-bold text-[#050505] dark:text-[#e4e6eb] truncate group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {u.name}
              </p>
              {isFriend && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                  {locale === 'bn' ? 'ফ্রেন্ড' : 'Friend'}
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-[#65676b] dark:text-[#b0b3b8] truncate">
              @{u.username}
            </p>
          </div>
        </div>

        <div className="shrink-0 pl-2">
          {isPendingThis ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-xs md:text-sm font-bold text-primary-600 dark:text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
              {locale === 'bn' ? 'চ্যাট করুন' : 'Chat'}
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={locale === 'bn' ? 'নতুন মেসেজ' : 'New Message'}
      description={
        locale === 'bn'
          ? 'মেসেজ পাঠাতে একজন ব্যবহারকারী বা বন্ধু নির্বাচন করুন'
          : 'Select a user or friend to start messaging'
      }
      className="w-full max-w-md md:max-w-lg lg:max-w-xl p-5 md:p-6 rounded-3xl shadow-2xl flex flex-col"
    >
      <div className="space-y-4 flex flex-col flex-1 min-h-0">
        {/* Search Input */}
        <div className="relative flex items-center shrink-0">
          <Search className="absolute left-3.5 md:left-4 h-4 w-4 md:h-5 md:w-5 text-[#65676b] dark:text-[#b0b3b8] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === 'bn' ? 'নাম বা ইউজারনেম দিয়ে খুঁজুন...' : 'Search by name or @username...'
            }
            className="w-full rounded-2xl bg-[#f0f2f5] dark:bg-[#3a3b3c] pl-10 md:pl-12 pr-10 py-2.5 md:py-3 text-sm md:text-base text-[#050505] dark:text-[#e4e6eb] placeholder-[#65676b] dark:placeholder-[#b0b3b8] outline-hidden focus:ring-2 focus:ring-primary-500 transition-all"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1.5 rounded-full text-[#65676b] hover:bg-[#e4e6eb] dark:hover:bg-[#4e4f50] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Users List */}
        <div className="flex-1 min-h-0 max-h-[300px] md:max-h-[350px] lg:max-h-[400px] overflow-y-auto space-y-2.5 pr-1 -mr-1 overscroll-contain pb-2">
          {isSearching || isLoadingFriends ? (
            <div className="py-10 md:py-14 flex flex-col items-center justify-center gap-2.5 text-[#65676b] dark:text-[#b0b3b8]">
              <Loader2 className="h-7 w-7 animate-spin text-primary-500" />
              <p className="text-xs md:text-sm font-medium">{locale === 'bn' ? 'খোঁজা হচ্ছে...' : 'Loading users...'}</p>
            </div>
          ) : totalUsersCount === 0 ? (
            <div className="py-10 md:py-14 text-center text-[#65676b] dark:text-[#b0b3b8]">
              <MessageSquare className="h-9 w-9 md:h-10 md:w-10 mx-auto mb-2 opacity-40 text-primary-500" />
              <p className="text-sm md:text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
                {searchQuery.trim()
                  ? locale === 'bn'
                    ? 'কোনো ব্যবহারকারী পাওয়া যায়নি'
                    : 'No users found'
                  : locale === 'bn'
                    ? 'এখনো কোনো ফ্রেন্ড তালিকায় নেই'
                    : 'No friends in list yet'}
              </p>
              <p className="text-xs md:text-sm mt-1 max-w-sm mx-auto">
                {searchQuery.trim()
                  ? locale === 'bn'
                    ? 'বানান পরীক্ষা করুন বা অন্য নাম লিখুন'
                    : 'Try searching with another username'
                  : locale === 'bn'
                    ? 'উপরে ইউজারনেম দিয়ে যেকোনো ব্যবহারকারীকে খুঁজে বের করুন'
                    : 'Type a name or username above to find anyone'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Friends (Top) */}
              {searchFriends.length > 0 && (
                <div className="space-y-1">
                  {searchQuery.trim() && (
                    <div className="px-2 py-0.5 text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider flex items-center justify-between">
                      <span>{locale === 'bn' ? 'ফ্রেন্ডস' : 'Friends'}</span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded-full">
                        {searchFriends.length}
                      </span>
                    </div>
                  )}
                  {searchFriends.map((u) => renderModalUserRow(u, true))}
                </div>
              )}

              {/* Others (Bottom) */}
              {searchOthers.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 py-0.5 text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider flex items-center justify-between">
                    <span>{locale === 'bn' ? 'অন্যান্য' : 'Others'}</span>
                    <span className="text-[10px] bg-gray-100 dark:bg-[#3a3b3c] text-[#65676b] dark:text-[#b0b3b8] font-bold px-1.5 py-0.5 rounded-full">
                      {searchOthers.length}
                    </span>
                  </div>
                  {searchOthers.map((u) => renderModalUserRow(u, false))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
