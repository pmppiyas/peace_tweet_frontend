'use client';

import React, { useState } from 'react';
import { useFeed } from '../hooks/useFeed';
import { FeedList } from './FeedList';
import { FeedSkeleton } from './FeedSkeleton';
import { PostComposer } from './PostComposer';
import { PostType } from '../types/feed.types';
import { AlertCircle, RefreshCw, Sparkles, BookOpen, PenTool, HelpCircle, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function Feed() {
  const [activeType, setActiveType] = useState<PostType | undefined>(undefined);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useFeed(activeType);

  // Flatten all paginated items
  const allPosts = data?.pages.flatMap((page) => page?.items || []) || [];

  const filterTabs: Array<{ label: string; type?: PostType; icon: React.ReactNode }> = [
    { label: 'সকল পোস্ট', type: undefined, icon: <Sparkles className="h-3.5 w-3.5" /> },
    { label: 'দোয়া', type: 'DUA', icon: <BookOpen className="h-3.5 w-3.5" /> },
    { label: 'স্মরণ ও চিন্তা', type: 'TEXT', icon: <PenTool className="h-3.5 w-3.5" /> },
    { label: 'জিজ্ঞাসা', type: 'QUESTION', icon: <HelpCircle className="h-3.5 w-3.5" /> },
    { label: 'ঘোষণা', type: 'ANNOUNCEMENT', icon: <Megaphone className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Post Composer */}
      <PostComposer />

      {/* 2. Type Filter Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = activeType === tab.type;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveType(tab.type)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all select-none',
                isActive
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white border border-[#e4e6eb] text-[#65676b] hover:border-gray-300 hover:text-[#050505] dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#b0b3b8] dark:hover:text-[#e4e6eb]',
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Feed Content States */}
      {isLoading ? (
        <FeedSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50/70 p-8 text-center dark:border-rose-900/60 dark:bg-rose-950/30">
          <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
          <h3 className="mt-2 text-sm font-bold text-rose-800 dark:text-rose-300">
            ফিড লোড করা যাচ্ছে না
          </h3>
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 max-w-sm">
            সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>আবার চেষ্টা করুন</span>
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
