'use client';

import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { FriendCard } from './FriendCard';
import { FriendListItem } from './FriendListItem';
import { FriendCardSkeleton } from './FriendsPageSkeleton';
import { FriendsEmptyState } from './FriendsEmptyState';
import { FriendItem } from '../types/friends.types';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/providers/LanguageProvider';

export interface FriendListProps {
  items: FriendItem[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  refetch: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
  isSearching?: boolean;
  layout?: 'list' | 'grid';
  showUnfriend?: boolean;
  header?: React.ReactNode;
}

export function FriendList({
  items,
  isLoading,
  isError,
  refetch,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isSearching,
  layout = 'list',
  showUnfriend = true,
  header,
}: FriendListProps) {
  const { locale } = useLanguage();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Auto infinite-scroll observer
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '100px' },
    );

    const target = loadMoreRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  // Initial loading state
  if (isLoading) {
    if (layout === 'list') {
      return (
        <div className="rounded-2xl border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] overflow-hidden shadow-2xs">
          {header}
          <div className="divide-y divide-[#e4e6eb] dark:divide-[#393a3b]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 sm:p-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-black/10 dark:bg-white/10" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 rounded bg-black/10 dark:bg-white/10" />
                    <div className="h-3 w-36 rounded bg-black/10 dark:bg-white/10" />
                  </div>
                </div>
                <div className="h-8 w-20 rounded-xl bg-black/10 dark:bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <FriendCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-8 text-center space-y-3 bg-red-50 dark:bg-red-950/30 rounded-3xl border border-red-200 dark:border-red-900">
        <p className="text-sm font-semibold text-red-800 dark:text-red-300">
          {locale === 'bn'
            ? 'বন্ধুদের তালিকা লোড করা যাচ্ছে না'
            : 'Failed to load friends list.'}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          {locale === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
        </Button>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    if (layout === 'list') {
      return (
        <div className="rounded-2xl border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] overflow-hidden shadow-2xs">
          {header}
          <div className="p-6">
            <FriendsEmptyState
              type="friends"
              message={
                isSearching
                  ? locale === 'bn'
                    ? 'এই নামে কোনো বন্ধু পাওয়া যায়নি'
                    : 'No friends found matching your search'
                  : undefined
              }
            />
          </div>
        </div>
      );
    }
    return (
      <FriendsEmptyState
        type="friends"
        message={
          isSearching
            ? locale === 'bn'
              ? 'এই নামে কোনো বন্ধু পাওয়া যায়নি'
              : 'No friends found matching your search'
            : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {items.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] overflow-hidden shadow-2xs">
          {header}
          <div className="divide-y divide-[#e4e6eb] dark:divide-[#393a3b]">
            {items.map((friend) => (
              <FriendListItem
                key={friend.id}
                friend={friend}
                showUnfriend={showUnfriend}
              />
            ))}
          </div>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="py-6 flex justify-center">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#65676b] dark:text-[#b0b3b8]">
              <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
              <span>{locale === 'bn' ? 'আরও লোড হচ্ছে...' : 'Loading more friends...'}</span>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              className="rounded-xl text-xs"
            >
              {locale === 'bn' ? 'আরও দেখুন' : 'Load more'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
