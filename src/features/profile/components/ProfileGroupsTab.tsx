'use client';

import React from 'react';
import Link from 'next/link';
import { Users2, Plus } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useMyGroups } from '@/features/groups/hooks/useMyGroups';
import { GroupList } from '@/features/groups/components/GroupList';
import { UserProfileResponse } from '@/features/friends/types/friends.types';
import { User } from '@/types/user.types';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export interface ProfileGroupsTabProps {
  targetUser?: UserProfileResponse | User | null;
}

export function ProfileGroupsTab({ targetUser }: ProfileGroupsTabProps = {}) {
  const { locale } = useLanguage();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useMyGroups({
    userId: targetUser?.id,
    limit: 20,
  });

  const myGroups = data?.pages.flatMap((page) => page?.items || []) || [];

  const title = targetUser
    ? locale === 'bn'
      ? `${targetUser.name}-এর গ্রুপসমূহ`
      : `${targetUser.name}'s Groups`
    : locale === 'bn'
      ? 'আমার গ্রুপসমূহ'
      : 'My Groups';

  const description = targetUser
    ? locale === 'bn'
      ? `${targetUser.name}-এর সাথে যুক্ত গ্রুপের তালিকা`
      : `Groups connected with ${targetUser.name}`
    : locale === 'bn'
      ? 'আপনার যুক্ত হওয়া ও তৈরি করা সকল গ্রুপ'
      : 'All groups you have joined or created';

  const header = (
    <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-[#e4e6eb] dark:border-[#393a3b] flex items-center justify-between gap-3">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-white flex items-center gap-2">
          <Users2 className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>{title}</span>
        </h2>
        {description && (
          <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
            {description}
          </p>
        )}
      </div>

      {!targetUser && (
        <Link href={ROUTES.GROUPS.CREATE}>
          <Button size="sm" className="rounded-xl gap-1 text-xs font-bold whitespace-nowrap shadow-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>{locale === 'bn' ? 'নতুন গ্রুপ' : 'Create'}</span>
          </Button>
        </Link>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <GroupList
        groups={myGroups}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        emptyType="my-groups"
        layout="list"
        header={header}
      />
    </div>
  );
}
