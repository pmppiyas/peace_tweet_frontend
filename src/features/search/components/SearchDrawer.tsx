'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Search,
  X,
  Clock,
  User as UserIcon,
  BookOpen,
  Users,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { useSearchGlobal } from '../hooks/useSearchGlobal';
import { soundEffects } from '@/lib/sound/soundEffects';
import {
  SearchEntityType,
  SearchHistoryItem,
  SearchUserItem,
  SearchDuaItem,
  SearchGroupItem,
} from '../types/search.types';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function SearchDrawer({
  isOpen,
  onClose,
  initialQuery = '',
}: SearchDrawerProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    history,
    isLoading: isHistoryLoading,
    addHistory,
    deleteHistoryItem,
    clearAllHistory,
  } = useSearchHistory();

  const {
    results,
    isLoading: isSearchLoading,
    debouncedQuery,
  } = useSearchGlobal({
    query,
    type: 'ALL',
    limit: 6,
    enabled: isOpen,
  });

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent background scrolling when search drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Execute search submission
  const executeSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    addHistory({
      query: trimmed,
      entityType: 'KEYWORD',
    });

    onClose();
    router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(trimmed)}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleSelectHistoryItem = (item: SearchHistoryItem) => {
    // Re-record to float it to top
    addHistory({
      query: item.query,
      entityType: item.entityType || 'KEYWORD',
      entityId: item.entityId,
      entityName: item.entityName,
      entityAvatar: item.entityAvatar,
      entitySubtext: item.entitySubtext,
    });

    onClose();

    if (item.entityType === 'USER' && item.entitySubtext) {
      const username = item.entitySubtext.replace('@', '');
      router.push(ROUTES.USER_PROFILE(username));
    } else if (item.entityType === 'DUA' && item.entityId) {
      router.push(ROUTES.DUA_DETAIL(item.entityId));
    } else if (item.entityType === 'GROUP' && item.entityId) {
      router.push(ROUTES.GROUPS.DETAIL(item.entityId));
    } else {
      router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(item.query)}`);
    }
  };

  const handleSelectUser = (user: SearchUserItem) => {
    addHistory({
      query: user.name,
      entityType: 'USER',
      entityId: user.id,
      entityName: user.name,
      entityAvatar: user.avatarUrl,
      entitySubtext: `@${user.username}`,
    });

    onClose();
    router.push(ROUTES.USER_PROFILE(user.username));
  };

  const handleSelectDua = (dua: SearchDuaItem) => {
    addHistory({
      query: dua.title,
      entityType: 'DUA',
      entityId: dua.id,
      entityName: dua.title,
      entitySubtext: dua.category?.name || 'Dua',
    });

    onClose();
    router.push(ROUTES.DUA_DETAIL(dua.id));
  };

  const handleSelectGroup = (group: SearchGroupItem) => {
    addHistory({
      query: group.name,
      entityType: 'GROUP',
      entityId: group.slug || group.id,
      entityName: group.name,
      entityAvatar: group.avatarUrl,
      entitySubtext: `${group._count?.members || 0} members`,
    });

    onClose();
    router.push(ROUTES.GROUPS.DETAIL(group.slug || group.id));
  };

  const isQueryEmpty = query.trim().length === 0;

  return (
    <>
      {/* Backdrop for desktop & mobile */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity md:bg-black/20"
        aria-hidden="true"
      />

      {/* Global Search Drawer Container */}
      <div
        ref={containerRef}
        className="fixed inset-x-0 top-0 z-50 flex flex-col bg-white shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)] transition-all dark:bg-[#242526] md:left-0 md:right-auto md:w-[360px] lg:w-[380px] md:max-h-[88vh] md:rounded-br-2xl md:border-r md:border-b md:border-[#e4e6eb] dark:md:border-[#393a3b] h-full md:h-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Header: Back Arrow + Quick Search Pill Input */}
        <div className="flex h-14 items-center gap-2 px-3 border-b border-[#e4e6eb] dark:border-[#393a3b] shrink-0">
          {/* Back button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#65676b] hover:bg-[#f0f2f5] active:scale-95 transition-all dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Quick Search Pill Input */}
          <form
            onSubmit={handleFormSubmit}
            className="relative flex flex-1 items-center"
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search PeaceTweet"
              className="h-10 w-full rounded-full bg-[#f0f2f5] pl-4 pr-9 text-sm text-[#050505] placeholder-[#65676b] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary-500/40 dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8] dark:focus:bg-[#18191a]"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear input"
                className="absolute right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#bcc0c4] text-white hover:bg-[#a8adb3] dark:bg-[#4e4f50] dark:hover:bg-[#606266] transition-colors"
              >
                <X className="h-3 w-3 stroke-[3]" />
              </button>
            )}
          </form>
        </div>

        {/* Search Drawer Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain py-2 px-2 pb-20 md:pb-2 no-scrollbar scrollbar-none">
          {/* STATE 1: Empty Query -> Recent Searches */}
          {isQueryEmpty && (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
                  Recent searches
                </span>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearAllHistory()}
                    className="text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400 p-1"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {isHistoryLoading ? (
                <div className="space-y-2 p-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 animate-pulse py-1.5"
                    >
                      <div className="h-9 w-9 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 w-3/4 rounded bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
                        <div className="h-2.5 w-1/2 rounded bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f2f5] text-[#65676b] dark:bg-[#3a3b3c] dark:text-[#b0b3b8] mb-2">
                    <Clock className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-[#65676b] dark:text-[#b0b3b8]">
                    No recent searches
                  </p>
                  <p className="text-xs text-[#8a8d91] dark:text-[#8a8d91] mt-0.5">
                    Search for people, duas, groups, and posts
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectHistoryItem(item)}
                      className="group flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 hover:bg-[#f2f2f2] active:bg-[#e4e6eb] dark:hover:bg-[#3a3b3c] dark:active:bg-[#4e4f50] cursor-pointer transition-colors"
                    >
                      {/* Left: Avatar/Icon + Titles */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {item.entityType === 'USER' ? (
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 font-bold text-xs">
                            {item.entityAvatar ? (
                              <Image
                                src={item.entityAvatar}
                                alt={item.entityName || item.query}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <span>{(item.entityName || item.query).charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                        ) : item.entityType === 'DUA' ? (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <BookOpen className="h-4.5 w-4.5" />
                          </div>
                        ) : item.entityType === 'GROUP' ? (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                            <Users className="h-4.5 w-4.5" />
                          </div>
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0f2f5] text-[#65676b] dark:bg-[#3a3b3c] dark:text-[#b0b3b8]">
                            <Clock className="h-4.5 w-4.5" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[#050505] dark:text-[#e4e6eb]">
                            {item.entityName || item.query}
                          </p>
                          {item.entitySubtext && (
                            <p className="truncate text-xs text-[#65676b] dark:text-[#b0b3b8]">
                              {item.entitySubtext}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Single Delete (✕) button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEffects.playDelete();
                          deleteHistoryItem(item.id);
                        }}
                        aria-label="Remove search"
                        title="Remove from history"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#65676b] hover:bg-[#e4e6eb] active:scale-90 transition-all dark:text-[#b0b3b8] dark:hover:bg-[#4e4f50]"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STATE 2: User is typing -> Live Search Suggestions */}
          {!isQueryEmpty && (
            <div className="space-y-2">
              {/* Row 1: Search for "{query}" */}
              <div
                onClick={() => executeSearch(query)}
                className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 hover:bg-[#f2f2f2] active:bg-[#e4e6eb] dark:hover:bg-[#3a3b3c] dark:active:bg-[#4e4f50] cursor-pointer transition-colors"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
                  <Search className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#050505] dark:text-[#e4e6eb]">
                    Search for{' '}
                    <span className="font-bold text-primary-600 dark:text-primary-400">
                      &quot;{query}&quot;
                    </span>
                  </p>
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                    Search all posts, people, duas, and groups
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#65676b] dark:text-[#b0b3b8]" />
              </div>

              {/* Live Categorized Results */}
              {isSearchLoading && !results ? (
                <div className="space-y-2 p-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 animate-pulse py-1"
                    >
                      <div className="h-9 w-9 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 w-3/4 rounded bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
                        <div className="h-2.5 w-1/3 rounded bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* People */}
                  {results?.users && results.users.length > 0 && (
                    <div className="pt-1">
                      <p className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-[#b0b3b8]">
                        People
                      </p>
                      <div className="space-y-0.5">
                        {results.users.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            className="flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-[#f2f2f2] active:bg-[#e4e6eb] dark:hover:bg-[#3a3b3c] dark:active:bg-[#4e4f50] cursor-pointer transition-colors"
                          >
                            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 font-bold text-xs">
                              {user.avatarUrl ? (
                                <Image
                                  src={user.avatarUrl}
                                  alt={user.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <span>{user.name.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#050505] dark:text-[#e4e6eb]">
                                {user.name}
                              </p>
                              <p className="truncate text-xs text-[#65676b] dark:text-[#b0b3b8]">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Duas */}
                  {results?.duas && results.duas.length > 0 && (
                    <div className="pt-1">
                      <p className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-[#b0b3b8]">
                        Duas
                      </p>
                      <div className="space-y-0.5">
                        {results.duas.map((dua) => (
                          <div
                            key={dua.id}
                            onClick={() => handleSelectDua(dua)}
                            className="flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-[#f2f2f2] active:bg-[#e4e6eb] dark:hover:bg-[#3a3b3c] dark:active:bg-[#4e4f50] cursor-pointer transition-colors"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                              <BookOpen className="h-4.5 w-4.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#050505] dark:text-[#e4e6eb]">
                                {dua.title}
                              </p>
                              <p className="truncate text-xs text-[#65676b] dark:text-[#b0b3b8]">
                                {dua.category?.name || 'Supplication'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Groups */}
                  {results?.groups && results.groups.length > 0 && (
                    <div className="pt-1">
                      <p className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-[#b0b3b8]">
                        Groups
                      </p>
                      <div className="space-y-0.5">
                        {results.groups.map((group) => (
                          <div
                            key={group.id}
                            onClick={() => handleSelectGroup(group)}
                            className="flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-[#f2f2f2] active:bg-[#e4e6eb] dark:hover:bg-[#3a3b3c] dark:active:bg-[#4e4f50] cursor-pointer transition-colors"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                              <Users className="h-4.5 w-4.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#050505] dark:text-[#e4e6eb]">
                                {group.name}
                              </p>
                              <p className="truncate text-xs text-[#65676b] dark:text-[#b0b3b8]">
                                {group._count?.members || 0} members •{' '}
                                {group.visibility.toLowerCase()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Action: See all results */}
                  <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#393a3b]">
                    <button
                      type="button"
                      onClick={() => executeSearch(query)}
                      className="w-full rounded-lg bg-[#f0f2f5] py-2 text-center text-xs font-bold text-primary-600 hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:text-primary-400 dark:hover:bg-[#4e4f50] transition-colors"
                    >
                      See all results for &quot;{query}&quot;
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
