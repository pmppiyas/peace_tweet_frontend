'use client';

import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { MyFriends } from '@/features/friends/components/MyFriends';
import { UserProfileResponse } from '@/features/friends/types/friends.types';
import { User } from '@/types/user.types';
import { ProfileTabHeader } from './ProfileTabHeader';

export interface ProfileFriendsTabProps {
  targetUser?: UserProfileResponse | User | null;
}

export function ProfileFriendsTab({ targetUser }: ProfileFriendsTabProps = {}) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
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

  return (
    <div className="space-y-4">
      <ProfileTabHeader
        icon={Users}
        iconColor="text-indigo-600 dark:text-indigo-400"
        title={title}
        description={description}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={locale === 'bn' ? 'বন্ধু খুঁজুন...' : 'Search friends...'}
      />

      <MyFriends searchQuery={debouncedSearch} />
    </div>
  );
}
