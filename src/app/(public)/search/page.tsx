'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  X,
  Clock,
  User as UserIcon,
  BookOpen,
  Users,
  FileText,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { ROUTES } from '@/constants/routes';
import { useSearchHistory } from '@/features/search/hooks/useSearchHistory';
import { useSearchGlobal } from '@/features/search/hooks/useSearchGlobal';
import {
  SearchScope,
  SearchHistoryItem,
} from '@/features/search/types/search.types';
import { cn } from '@/lib/utils/cn';

const TABS: { id: SearchScope; label: string; icon: React.ElementType }[] = [
  { id: 'ALL', label: 'All', icon: Search },
  { id: 'USERS', label: 'People', icon: UserIcon },
  { id: 'DUAS', label: 'Duas', icon: BookOpen },
  { id: 'GROUPS', label: 'Groups', icon: Users },
  { id: 'POSTS', label: 'Posts', icon: FileText },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get('q') || '';
  const scopeParam = (searchParams.get('type') as SearchScope) || 'ALL';

  const [inputVal, setInputVal] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<SearchScope>(scopeParam);

  const {
    history,
    isLoading: isHistoryLoading,
    addHistory,
    deleteHistoryItem,
    clearAllHistory,
  } = useSearchHistory();

  const { results, isLoading, isFetching } = useSearchGlobal({
    query: queryParam,
    type: activeTab,
    limit: 25,
    enabled: queryParam.trim().length > 0,
  });

  // Sync state when URL params change
  useEffect(() => {
    setInputVal(queryParam);
  }, [queryParam]);

  useEffect(() => {
    setActiveTab(scopeParam);
  }, [scopeParam]);

  // Record history when arriving with a query
  useEffect(() => {
    if (queryParam.trim()) {
      addHistory({
        query: queryParam.trim(),
        entityType: 'KEYWORD',
      });
    }
  }, [queryParam, addHistory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (trimmed) {
      router.push(
        `${ROUTES.SEARCH}?q=${encodeURIComponent(trimmed)}&type=${activeTab}`
      );
    }
  };

  const handleTabChange = (tabId: SearchScope) => {
    setActiveTab(tabId);
    if (queryParam.trim()) {
      router.push(
        `${ROUTES.SEARCH}?q=${encodeURIComponent(queryParam.trim())}&type=${tabId}`
      );
    }
  };

  const handleSelectHistoryItem = (item: SearchHistoryItem) => {
    addHistory({
      query: item.query,
      entityType: item.entityType || 'KEYWORD',
      entityId: item.entityId,
      entityName: item.entityName,
      entityAvatar: item.entityAvatar,
      entitySubtext: item.entitySubtext,
    });

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

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a]">
      <Container size="xl" className="h-full px-0 sm:px-4">
        <div className="flex h-full justify-center gap-4 lg:gap-6">
          <Sidebar />

          <main className="w-full max-w-2xl min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-4 pb-20 sm:pb-8 space-y-4 px-2 sm:px-0">
            {/* RESULTS CONTENT */}
            {queryParam.trim() ? (
              <div className="space-y-4">
                {isLoading ? (
                  /* Loading skeleton */
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-white p-4 border border-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#242526] animate-pulse space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-1/3 rounded bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
                            <div className="h-3 w-1/4 rounded bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !results || results.total === 0 ? (
                  /* Empty state */
                  <div className="rounded-xl bg-white p-8 text-center border border-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#242526]">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f2f5] text-[#65676b] dark:bg-[#3a3b3c] dark:text-[#b0b3b8] mb-3">
                      <Search className="h-7 w-7" />
                    </div>
                    <h2 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
                      We didn&apos;t find any results for &quot;{queryParam}
                      &quot;
                    </h2>
                    <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-1 max-w-sm mx-auto">
                      Make sure all words are spelled correctly or try different
                      keywords for people, duas, or groups.
                    </p>
                  </div>
                ) : (
                  /* Results list by active category */
                  <div className="space-y-4">
                    {/* PEOPLE */}
                    {(activeTab === 'ALL' || activeTab === 'USERS') &&
                      results.users.length > 0 && (
                        <div className="rounded-xl bg-white p-4 border border-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#242526] space-y-3">
                          <div className="flex items-center justify-between border-b border-[#e4e6eb] dark:border-[#393a3b] pb-2">
                            <h2 className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb] flex items-center gap-1.5">
                              <UserIcon className="h-4 w-4 text-primary-500" />
                              People ({results.users.length})
                            </h2>
                          </div>
                          <div className="divide-y divide-[#e4e6eb] dark:divide-[#393a3b]">
                            {results.users.map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center justify-between py-3 first:pt-1 last:pb-1"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 font-bold text-sm">
                                    {user.avatarUrl ? (
                                      <Image
                                        src={user.avatarUrl}
                                        alt={user.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                      />
                                    ) : (
                                      <span>
                                        {user.name.charAt(0).toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <Link
                                      href={ROUTES.USER_PROFILE(user.username)}
                                      className="font-bold text-sm text-[#050505] hover:underline dark:text-[#e4e6eb] truncate block"
                                    >
                                      {user.name}
                                    </Link>
                                    <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                                      @{user.username}
                                    </p>
                                  </div>
                                </div>
                                <Link
                                  href={ROUTES.USER_PROFILE(user.username)}
                                  className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-600 hover:bg-primary-100 dark:bg-primary-950/40 dark:text-primary-400 transition-colors"
                                >
                                  View Profile
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* DUAS */}
                    {(activeTab === 'ALL' || activeTab === 'DUAS') &&
                      results.duas.length > 0 && (
                        <div className="rounded-xl bg-white p-4 border border-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#242526] space-y-3">
                          <div className="flex items-center justify-between border-b border-[#e4e6eb] dark:border-[#393a3b] pb-2">
                            <h2 className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb] flex items-center gap-1.5">
                              <BookOpen className="h-4 w-4 text-emerald-500" />
                              Duas & Supplications ({results.duas.length})
                            </h2>
                          </div>
                          <div className="divide-y divide-[#e4e6eb] dark:divide-[#393a3b]">
                            {results.duas.map((dua) => (
                              <div
                                key={dua.id}
                                className="py-3 first:pt-1 last:pb-1 space-y-1.5"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-0.5">
                                    <Link
                                      href={ROUTES.DUA_DETAIL(dua.id)}
                                      className="font-bold text-sm text-[#050505] hover:underline dark:text-[#e4e6eb] block"
                                    >
                                      {dua.title}
                                    </Link>
                                    {dua.category && (
                                      <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                        {dua.category.name}
                                      </span>
                                    )}
                                  </div>
                                  <Link
                                    href={ROUTES.DUA_DETAIL(dua.id)}
                                    className="rounded-lg bg-[#f0f2f5] px-3 py-1.5 text-xs font-bold text-[#050505] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] transition-colors shrink-0"
                                  >
                                    Read Dua
                                  </Link>
                                </div>
                                {dua.arabicText && (
                                  <p
                                    dir="rtl"
                                    className="font-arabic text-sm text-[#050505] dark:text-[#e4e6eb] leading-relaxed pt-1"
                                  >
                                    {dua.arabicText}
                                  </p>
                                )}
                                {dua.meaningBangla && (
                                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] line-clamp-2">
                                    {dua.meaningBangla}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* GROUPS */}
                    {(activeTab === 'ALL' || activeTab === 'GROUPS') &&
                      results.groups.length > 0 && (
                        <div className="rounded-xl bg-white p-4 border border-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#242526] space-y-3">
                          <div className="flex items-center justify-between border-b border-[#e4e6eb] dark:border-[#393a3b] pb-2">
                            <h2 className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb] flex items-center gap-1.5">
                              <Users className="h-4 w-4 text-blue-500" />
                              Groups ({results.groups.length})
                            </h2>
                          </div>
                          <div className="divide-y divide-[#e4e6eb] dark:divide-[#393a3b]">
                            {results.groups.map((group) => (
                              <div
                                key={group.id}
                                className="flex items-center justify-between py-3 first:pt-1 last:pb-1"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 font-bold">
                                    <Users className="h-5 w-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <Link
                                      href={ROUTES.GROUPS.DETAIL(
                                        group.slug || group.id
                                      )}
                                      className="font-bold text-sm text-[#050505] hover:underline dark:text-[#e4e6eb] truncate block"
                                    >
                                      {group.name}
                                    </Link>
                                    <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                                      {group._count?.members || 0} members •{' '}
                                      {group.visibility.toLowerCase()}
                                    </p>
                                  </div>
                                </div>
                                <Link
                                  href={ROUTES.GROUPS.DETAIL(
                                    group.slug || group.id
                                  )}
                                  className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 transition-colors"
                                >
                                  View Group
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* POSTS */}
                    {(activeTab === 'ALL' || activeTab === 'POSTS') &&
                      results.posts.length > 0 && (
                        <div className="rounded-xl bg-white p-4 border border-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#242526] space-y-3">
                          <div className="flex items-center justify-between border-b border-[#e4e6eb] dark:border-[#393a3b] pb-2">
                            <h2 className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb] flex items-center gap-1.5">
                              <FileText className="h-4 w-4 text-purple-500" />
                              Posts ({results.posts.length})
                            </h2>
                          </div>
                          <div className="divide-y divide-[#e4e6eb] dark:divide-[#393a3b]">
                            {results.posts.map((post) => (
                              <div
                                key={post.id}
                                className="py-3 first:pt-1 last:pb-1 space-y-2"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 font-bold text-xs">
                                    {post.author.avatarUrl ? (
                                      <Image
                                        src={post.author.avatarUrl}
                                        alt={post.author.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                      />
                                    ) : (
                                      <span>
                                        {post.author.name
                                          .charAt(0)
                                          .toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <Link
                                      href={ROUTES.USER_PROFILE(
                                        post.author.username
                                      )}
                                      className="font-bold text-xs text-[#050505] hover:underline dark:text-[#e4e6eb]"
                                    >
                                      {post.author.name}
                                    </Link>
                                    <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                                      {new Date(
                                        post.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                {post.content && (
                                  <p className="text-sm text-[#050505] dark:text-[#e4e6eb]">
                                    {post.content}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            ) : (
              /* DEDICATED SEARCH HISTORY VIEW (When query is empty) */
              <div className="rounded-xl bg-white p-4 border border-[#e4e6eb] shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] space-y-3">
                <div className="flex items-center justify-between border-b border-[#e4e6eb] dark:border-[#393a3b] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#65676b] dark:text-[#b0b3b8]" />
                    <h2 className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
                      Recent Searches
                    </h2>
                  </div>
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
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 animate-pulse py-1"
                      >
                        <div className="h-9 w-9 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3.5 w-1/2 rounded bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <div className="py-8 text-center text-[#65676b] dark:text-[#b0b3b8]">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-[#8a8d91]" />
                    <p className="text-sm font-medium">No recent searches</p>
                    <p className="text-xs text-[#8a8d91] mt-0.5">
                      Search for people, duas, or groups to see them here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectHistoryItem(item)}
                        className="group flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 hover:bg-[#f2f2f2] active:bg-[#e4e6eb] dark:hover:bg-[#3a3b3c] dark:active:bg-[#4e4f50] cursor-pointer transition-colors"
                      >
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
                                <span>
                                  {(item.entityName || item.query)
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
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

                        {/* Single Delete ✕ Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
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
          </main>

          <RightSidebar />
        </div>
      </Container>
    </div>
  );
}
