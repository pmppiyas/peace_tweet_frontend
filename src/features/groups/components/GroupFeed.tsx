'use client';

import React from 'react';
import { GroupDetail } from '../types/groups.types';
import { useGroupPosts } from '../hooks/useGroupPosts';
import { canPostInGroup, canViewPrivateContent } from '../utils/group-permissions';
import { GroupComposer } from './GroupComposer';
import { GroupActionButton } from './GroupActionButton';
import { FeedList } from '@/features/feed/components/FeedList';
import { FeedSkeleton } from '@/features/feed/components/FeedSkeleton';
import { Card } from '@/components/ui/Card';
import { Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export interface GroupFeedProps {
  group: GroupDetail;
}

export function GroupFeed({ group }: GroupFeedProps) {
  const { locale } = useLanguage();
  const membership = group.membership;
  const role = membership?.role || group.currentUserRole;
  const status = membership?.status || (group.isMember ? 'MEMBER' : 'NONE');

  const isAllowedToView = canViewPrivateContent(group, membership);
  const isAllowedToPost = canPostInGroup(status, role);

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGroupPosts(group.id, isAllowedToView);

  // Flatten posts across pages
  const allPosts = data?.pages.flatMap((page) => page?.items || []) || [];

  // 1. Private Group Lock Banner for non-members
  if (!isAllowedToView) {
    return (
      <Card className="flex flex-col items-center justify-center rounded-2xl border border-[#e4e6eb] bg-white p-8 sm:p-12 text-center shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 mb-3 text-amber-700 dark:text-amber-400">
          <Lock className="h-8 w-8" />
        </div>
        <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
          {locale === 'bn' ? 'এটি একটি প্রাইভেট গ্রুপ' : 'This is a Private Group'}
        </h3>
        <p className="mt-1 text-xs text-[#65676b] dark:text-[#b0b3b8] max-w-sm">
          {locale === 'bn'
            ? 'এই গ্রুপের পোস্ট ও আলোচনা দেখতে আপনাকে গ্রুপে যুক্ত হতে অনুরোধ পাঠাতে হবে।'
            : 'To view posts and discussions in this group, please request to join.'}
        </p>

        <div className="mt-5">
          <GroupActionButton group={group} size="md" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Group Post Composer for members */}
      {isAllowedToPost && <GroupComposer group={group} />}

      {/* Feed States */}
      {isLoading ? (
        <FeedSkeleton />
      ) : isError ? (
        <Card className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center dark:border-rose-900/60 dark:bg-rose-950/30">
          <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
          <h3 className="mt-2 text-sm font-bold text-rose-800 dark:text-rose-300">
            {locale === 'bn'
              ? 'গ্রুপ পোস্ট লোড করা যাচ্ছে না'
              : 'Unable to Load Group Posts'}
          </h3>
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 max-w-sm">
            {locale === 'bn'
              ? 'সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।'
              : 'Failed to connect to the server. Please check your connection and try again.'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{locale === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}</span>
          </button>
        </Card>
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
