'use client';

import React, { useEffect, useRef } from 'react';
import { FeedItem as FeedItemType } from '../types/feed.types';
import { FeedItem } from './FeedItem';
import { FeedSkeleton } from './FeedSkeleton';
import { EmptyFeed } from './EmptyFeed';

interface FeedListProps {
  items: FeedItemType[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
}

export function FeedList({
  items,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: FeedListProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver for smooth infinite scroll
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

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

    const currentEl = loadMoreRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!items || items.length === 0) {
    return <EmptyFeed />;
  }

  return (
    <div className="space-y-4">
      {items.map((post) => (
        <FeedItem key={post.id} post={post} />
      ))}

      {/* Infinite Scroll Sentinel */}
      <div ref={loadMoreRef} className="h-4 w-full" />

      {/* Loading More Skeleton */}
      {isFetchingNextPage && (
        <div className="pt-2">
          <FeedSkeleton />
        </div>
      )}

      {/* End of Feed */}
      {!hasNextPage && items.length > 5 && (
        <div className="py-6 text-center text-xs text-[#65676b] dark:text-[#b0b3b8]">
          ✨ আপনি সকল সাম্প্রতিক পোস্ট দেখে ফেলেছেন
        </div>
      )}
    </div>
  );
}
