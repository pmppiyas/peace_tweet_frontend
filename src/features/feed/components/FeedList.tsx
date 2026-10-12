'use client';

import React, { useEffect, useRef } from 'react';
import { FeedItem as FeedItemType } from '../types/feed.types';
import { FeedItem } from './FeedItem';
import { FeedSkeleton } from './FeedSkeleton';
import { EmptyFeed } from './EmptyFeed';
import { useLanguage } from '@/providers/LanguageProvider';

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
  const { locale } = useLanguage();

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
        rootMargin: '300px',
        threshold: 0,
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
    <div className="w-full">
      {items.map((post, index) => (
        <React.Fragment key={post.id}>
          {index > 0 && (
            <hr className="border-0 border-t border-[#e4e6eb] dark:border-[#393a3b]" />
          )}
          <FeedItem post={post} />
        </React.Fragment>
      ))}

      {/* Infinite Scroll Sentinel */}
      <div ref={loadMoreRef} className="h-px w-full pointer-events-none" />

      {/* Loading More Skeleton */}
      {isFetchingNextPage && (
        <div className="border-t border-[#e4e6eb] dark:border-[#393a3b]">
          <FeedSkeleton />
        </div>
      )}

      {/* End of Feed */}
      {!hasNextPage && items.length > 5 && (
        <div className="py-6 text-center text-xs text-[#65676b] dark:text-[#b0b3b8] border-t border-[#e4e6eb] dark:border-[#393a3b]">
          {locale === 'bn'
            ? '✨ আপনি সকল সাম্প্রতিক পোস্ট দেখে ফেলেছেন'
            : "✨ You're all caught up with the latest posts"}
        </div>
      )}
    </div>
  );
}
