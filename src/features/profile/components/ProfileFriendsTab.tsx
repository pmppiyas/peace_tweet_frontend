'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { MyFriends } from '@/features/friends/components/MyFriends';
import { UserProfileResponse } from '@/features/friends/types/friends.types';
import { User } from '@/types/user.types';

export interface ProfileFriendsTabProps {
  targetUser?: UserProfileResponse | User | null;
}

export function ProfileFriendsTab({ targetUser }: ProfileFriendsTabProps = {}) {
  const { locale } = useLanguage();

  const title = targetUser
    ? locale === 'bn'
      ? `${targetUser.name}-এর বন্ধুরা`
      : `${targetUser.name}'s Friends`
    : locale === 'bn'
      ? 'আমার বন্ধুরা'
      : 'My Friends';

  const description = targetUser
    ? locale === 'bn'
      ? `${targetUser.name}-এর সাথে যুক্ত বন্ধুদের তালিকা`
      : `Connected friends of ${targetUser.name}`
    : locale === 'bn'
      ? 'আপনার সকল যুক্ত বন্ধুদের তালিকা'
      : 'All your connected friends on PeaceTweet';

  const header = (
    <div className="px-3.5 py-3 sm:px-5 sm:py-4 border-b border-[#e4e6eb] dark:border-[#393a3b]">
      <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-white flex items-center gap-2">
        <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span>{title}</span>
      </h2>
      {description && (
        <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
          {description}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <MyFriends
        searchQuery=""
        userId={targetUser?.id}
        layout="list"
        header={header}
      />
    </div>
  );
}
