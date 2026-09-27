'use client';

import React, { useEffect, useRef } from 'react';
import { GroupDetail } from '../types/groups.types';
import { GroupCard } from './GroupCard';
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
}

export function GroupList({
  groups,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  emptyType = 'discover',
  searchQuery,
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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return <GroupsEmptyState type={emptyType} searchQuery={searchQuery} />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
