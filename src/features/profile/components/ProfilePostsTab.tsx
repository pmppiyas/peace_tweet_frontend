'use client';

import React from 'react';
import { useFeed } from '@/features/feed/hooks/useFeed';
import { FeedList } from '@/features/feed/components/FeedList';
import { FeedSkeleton } from '@/features/feed/components/FeedSkeleton';
import { PostComposer } from '@/features/feed/components/PostComposer';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export interface ProfilePostsTabProps {
  userId?: string;
  isOwner?: boolean;
  isViewAs?: boolean;
}

export function ProfilePostsTab({
  userId,
  isOwner,
  isViewAs,
}: ProfilePostsTabProps) {
  const { locale } = useLanguage();
  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useFeed(userId ? { authorId: userId } : undefined);

  // Flatten and deduplicate
  const allPosts = React.useMemo(() => {
    const raw = data?.pages.flatMap((page) => page?.items || []) || [];
    const seen = new Set<string>();
    return raw.filter((post) => {
      if (!post?.id || seen.has(post.id)) return false;
      seen.add(post.id);
      return true;
    });
  }, [data]);

  return (
    <div className="w-full space-y-0 sm:space-y-4 divide-y divide-[#e4e6eb] dark:divide-[#393a3b] sm:divide-y-0">
      {/* Post Composer (Only for owner in normal mode) */}
      {isOwner && !isViewAs && (
        <div className="bg-white dark:bg-[#242526] rounded-none sm:rounded-2xl border-0 border-b sm:border border-[#e4e6eb] dark:border-[#393a3b] shadow-none sm:shadow-2xs overflow-hidden">
          <PostComposer />
        </div>
      )}

      {/* Content States */}
      {isLoading ? (
        <FeedSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-rose-50/70 dark:bg-rose-950/30 rounded-none sm:rounded-2xl border-0 border-b sm:border border-rose-200 dark:border-rose-900">
          <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
          <h3 className="mt-2 text-sm font-bold text-rose-800 dark:text-rose-300">
            {locale === 'bn' ? 'পোস্ট লোড করা যাচ্ছে না' : 'Unable to load posts'}
          </h3>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs cursor-pointer"
          >
            {locale === 'bn' ? 'আবার চেষ্টা করুন' : 'Try again'}
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#242526] rounded-none sm:rounded-2xl border-0 border-b sm:border border-[#e4e6eb] dark:border-[#393a3b] shadow-none sm:shadow-2xs overflow-hidden">
          <FeedList
            items={allPosts}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      )}
    </div>
  );
}
