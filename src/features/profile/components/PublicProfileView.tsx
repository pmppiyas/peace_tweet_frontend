'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { User as UserIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/features/friends/hooks/useFriendshipStatus';
import { ROUTES } from '@/constants/routes';
import { ProfileView } from './ProfileView';
import { ProfileLayout } from './ProfileLayout';
import { ProfileFriendsTab } from './ProfileFriendsTab';
import { ProfileGroupsTab } from './ProfileGroupsTab';
import { ProfileSavedTab } from './ProfileSavedTab';

export interface PublicProfileViewProps {
  username: string;
}

export function PublicProfileView({ username }: PublicProfileViewProps) {
  const { locale } = useLanguage();
  const { user: authUser } = useAuth();
  const searchParams = useSearchParams();
  const { data: profile, isLoading, isError, refetch } = useUserProfile(username);

  const rawTab = (searchParams.get('tab') || 'overview').toLowerCase();
  const from = (searchParams.get('from') || '').toLowerCase();
  const isFromTab = from === 'tab';

  const isOwner = Boolean(
    authUser &&
      profile &&
      (authUser.id === profile.id ||
        authUser.username?.toLowerCase() === profile.username?.toLowerCase())
  );
  const viewAsParam = searchParams.get('view_as');
  const isViewAs = isOwner ? viewAsParam !== 'false' : true;

  let currentTab: 'overview' | 'friend' | 'group' | 'saved' = 'overview';
  if (rawTab === 'friend' || rawTab === 'friends') {
    currentTab = 'friend';
  } else if (rawTab === 'group' || rawTab === 'groups') {
    currentTab = 'group';
  } else if (rawTab === 'saved' || rawTab === 'bookmarks') {
    currentTab = 'saved';
  } else {
    currentTab = 'overview';
  }

  const activeIdMap = {
    overview: 'profile-overview',
    friend: isFromTab ? 'profile-overview' : 'profile-friends',
    group: isFromTab ? 'profile-overview' : 'profile-groups',
    saved: isFromTab ? 'profile-overview' : 'profile-saved',
  };

  const mobileTabIdMap = {
    overview: 'tab-overview',
    friend: isFromTab ? 'tab-overview' : 'tab-friends',
    group: isFromTab ? 'tab-overview' : 'tab-groups',
    saved: isFromTab ? 'tab-overview' : 'tab-saved',
  };

  const baseUrl = ROUTES.USER_PROFILE(username);

  // Loading skeleton matching ProfileView hero inside ProfileLayout
  if (isLoading) {
    return (
      <ProfileLayout
        baseUrl={baseUrl}
        activeId={activeIdMap[currentTab]}
        activeMobileTabId={mobileTabIdMap[currentTab]}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4 animate-pulse">
          <div className="rounded-2xl border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] overflow-hidden">
            <Skeleton className="h-44 sm:h-56 md:h-64 w-full rounded-none" />
            <div className="px-4 sm:px-8 pb-4 text-center">
              <div className="-mt-14 sm:-mt-[72px] md:-mt-20 inline-block mx-auto">
                <Skeleton className="h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 rounded-full border-4 border-white dark:border-[#242526]" />
              </div>
              <div className="pt-3 space-y-2 flex flex-col items-center">
                <Skeleton className="h-7 w-48 rounded-lg" />
                <Skeleton className="h-4 w-28 rounded-lg" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
              <div className="pt-4 flex justify-center">
                <Skeleton className="h-9 w-32 rounded-xl" />
              </div>
              <div className="pt-3 mt-4 border-t border-[#e4e6eb] dark:border-[#393a3b] flex justify-center gap-4">
                <Skeleton className="h-8 w-24 rounded-xl" />
                <Skeleton className="h-8 w-20 rounded-xl" />
                <Skeleton className="h-8 w-20 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  // Error / Not Found state inside ProfileLayout
  if (isError || !profile) {
    return (
      <ProfileLayout
        baseUrl={baseUrl}
        activeId={activeIdMap[currentTab]}
        activeMobileTabId={mobileTabIdMap[currentTab]}
        maxWidth="max-w-4xl"
      >
        <Card className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#e4e6eb] bg-white rounded-3xl dark:border-[#393a3b] dark:bg-[#242526]">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
            <UserIcon className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
            {locale === 'bn' ? 'ব্যবহারকারী পাওয়া যায়নি' : 'User not found'}
          </h3>
          <p className="mt-1.5 max-w-sm text-xs text-[#65676b] dark:text-[#b0b3b8]">
            {locale === 'bn'
              ? `(@${username}) নামের কোনো ব্যবহারকারী পাওয়া যায়নি বা প্রোফাইলটি মুছে ফেলা হয়েছে।`
              : `The user @${username} does not exist or has been removed.`}
          </p>
          <div className="mt-5 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              {locale === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
            </Button>
            <Link href={ROUTES.HOME}>
              <Button variant="primary" size="sm">
                {locale === 'bn' ? 'হোম পেজে যান' : 'Go Home'}
              </Button>
            </Link>
          </div>
        </Card>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout
      targetUser={profile}
      baseUrl={baseUrl}
      activeId={activeIdMap[currentTab]}
      activeMobileTabId={mobileTabIdMap[currentTab]}
      maxWidth="max-w-4xl"
    >
      {isFromTab || currentTab === 'overview' ? (
        <ProfileView
          targetUser={profile}
          activeSubTab={currentTab}
          baseUrl={baseUrl}
          isViewAs={isViewAs}
        />
      ) : (
        <>
          {currentTab === 'friend' && <ProfileFriendsTab targetUser={profile} />}
          {currentTab === 'group' && <ProfileGroupsTab />}
          {currentTab === 'saved' && isOwner && <ProfileSavedTab />}
        </>
      )}
    </ProfileLayout>
  );
}
