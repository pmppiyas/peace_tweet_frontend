'use client';

import React, { useEffect, useRef } from 'react';
import { GroupDetail } from '../types/groups.types';
import { GroupCard } from './GroupCard';
import { GroupListItem } from './GroupListItem';
import { GroupCardSkeleton } from './GroupSkeleton';
import { GroupsEmptyState } from './GroupsEmptyState';

export interface GroupListProps {
  groups: GroupDetail[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  emptyType?: 'discover' | 'my-groups' | 'search';
  searchQuery?: string;
  layout?: 'list' | 'grid';
  header?: React.ReactNode;
}

export function GroupList({
  groups,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  emptyType = 'discover',
  searchQuery,
  layout = 'grid',
  header,
}: GroupListProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !fetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.1,
      },
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    if (layout === 'list') {
      return (
        <div className="rounded-2xl border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] overflow-hidden shadow-2xs">
          {header}
          <div className="divide-y divide-[#e4e6eb] dark:divide-[#393a3b]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 sm:p-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-black/10 dark:bg-white/10" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    if (layout === 'list') {
      return (
        <div className="rounded-2xl border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] overflow-hidden shadow-2xs">
          {header}
          <div className="p-4 sm:p-6">
            <GroupsEmptyState type={emptyType} searchQuery={searchQuery} />
          </div>
        </div>
      );
    }
    return <GroupsEmptyState type={emptyType} searchQuery={searchQuery} />;
  }

  if (layout === 'list') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] overflow-hidden shadow-2xs">
          {header}
          <div className="divide-y divide-[#e4e6eb] dark:divide-[#393a3b]">
            {groups.map((group) => (
              <GroupListItem key={group.id} group={group} />
            ))}
          </div>
        </div>

        {/* Infinite Scroll Sentinel */}
        <div ref={loadMoreRef} className="h-4 w-full" />

        {/* Loading next page skeletons */}
        {isFetchingNextPage && (
          <div className="rounded-2xl border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] divide-y divide-[#e4e6eb] dark:divide-[#393a3b] overflow-hidden shadow-2xs">
            <div className="flex items-center justify-between p-3.5 sm:p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-black/10 dark:bg-white/10" />
                <div className="space-y-2">
                  <div className="h-4 w-28 rounded bg-black/10 dark:bg-white/10" />
                  <div className="h-3 w-36 rounded bg-black/10 dark:bg-white/10" />
                </div>
              </div>
              <div className="h-8 w-20 rounded-xl bg-black/10 dark:bg-white/10" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      <div ref={loadMoreRef} className="h-4 w-full" />

      {/* Loading next page skeletons */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          <GroupCardSkeleton />
          <GroupCardSkeleton />
        </div>
      )}
    </div>
  );
}
