'use client';

import React from 'react';
import { useFeed } from '../hooks/useFeed';
import { FeedList } from './FeedList';
import { FeedSkeleton } from './FeedSkeleton';
import { PostComposer } from './PostComposer';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export function Feed() {
  const { locale } = useLanguage();

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useFeed();

  // Flatten and deduplicate all paginated items by post ID
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
    <div className="w-full bg-white dark:bg-[#242526] sm:rounded-2xl sm:border sm:border-[#e4e6eb] sm:dark:border-[#393a3b] sm:shadow-2xs overflow-hidden">
      {/* 1. Post Composer (hidden on mobile, shown on sm+) */}
      <div className="hidden sm:block">
        <PostComposer />
        <hr className="border-0 border-t border-[#e4e6eb] dark:border-[#393a3b]" />
      </div>

      {/* 2. Feed Content States */}
      {isLoading ? (
        <FeedSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/70 dark:bg-rose-950/30">
          <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
          <h3 className="mt-2 text-sm font-bold text-rose-800 dark:text-rose-300">
            {locale === 'bn' ? 'ফিড লোড করা যাচ্ছে না' : 'Unable to load feed'}
          </h3>
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 max-w-sm">
            {locale === 'bn'
              ? 'সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।'
              : 'Could not connect to the server. Please check your internet connection and try again.'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{locale === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}</span>
          </button>
        </div>
      ) : (
        <FeedList
          items={allPosts}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
    </div>
  );
}
