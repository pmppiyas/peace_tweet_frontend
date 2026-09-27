'use client';

import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { FriendCard } from './FriendCard';
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
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="py-6 flex justify-center">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#65676b] dark:text-[#b0b3b8]">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
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
