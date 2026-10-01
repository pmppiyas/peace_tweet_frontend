'use client';

import React from 'react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { useFriends } from '@/features/friends/hooks/useFriends';
import { useBookmarks } from '@/features/bookmark/hooks/useBookmarks';
import { useMyGroups } from '@/features/groups/hooks/useMyGroups';
import { UserProfileResponse } from '@/features/friends/types/friends.types';
import { User } from '@/types/user.types';
import { ProfileSidebar } from './ProfileSidebar';
import {
  SectionLayout,
  SectionMobileTab,
} from '@/components/layout/SectionLayout';

export interface ProfileLayoutProps {
  children: React.ReactNode;
  activeId?: string;
  activeMobileTabId?: string;
  maxWidth?: string;
  targetUser?: UserProfileResponse | User | null;
  baseUrl?: string;
}

export function ProfileLayout({
  children,
  activeId = 'profile-overview',
  activeMobileTabId = 'tab-overview',
  maxWidth = 'max-w-4xl',
  targetUser,
  baseUrl,
}: ProfileLayoutProps) {
  const { locale } = useLanguage();
  const { user: authUser, isAuthenticated } = useAuth();

  const displayUser = targetUser || authUser;
  const isOwner = Boolean(
    !targetUser ||
      (authUser &&
        targetUser &&
        (authUser.id === targetUser.id || authUser.username === targetUser.username))
  );

  const effectiveBaseUrl =
    baseUrl ||
    (isOwner
      ? '/profile'
      : displayUser?.username
        ? `/${displayUser.username}`
        : '/profile');

  const { data: friendsData } = useFriends(undefined, isAuthenticated && isOwner);
  const { data: bookmarkData } = useBookmarks({ limit: 1 });
  const { data: myGroupsData } = useMyGroups({ limit: 10 });

  const totalFriends =
    friendsData?.pages.flatMap((page) => page?.items || []).length;
  const totalBookmarks = bookmarkData?.meta?.total;
  const myGroups =
    myGroupsData?.pages.flatMap((page) => page?.items || []) || [];

  const mobileTabs: SectionMobileTab[] = [
    {
      id: 'tab-overview',
      label: locale === 'bn' ? 'প্রোফাইল' : 'Profile',
      href: effectiveBaseUrl,
    },
    {
      id: 'tab-friends',
      label: locale === 'bn' ? 'বন্ধুরা' : 'Friends',
      href: `${effectiveBaseUrl}?tab=friend&from=nav`,
      count:
        isOwner && typeof totalFriends === 'number' && totalFriends > 0
          ? totalFriends
          : undefined,
    },
    {
      id: 'tab-groups',
      label: locale === 'bn' ? 'গ্রুপ' : 'Groups',
      href: `${effectiveBaseUrl}?tab=group&from=nav`,
      count: isOwner && myGroups.length > 0 ? myGroups.length : undefined,
    },
    ...(isOwner
      ? [
          {
            id: 'tab-saved',
            label: locale === 'bn' ? 'সংরক্ষিত' : 'Saved',
            href: `${effectiveBaseUrl}?tab=saved&from=nav`,
            count:
              typeof totalBookmarks === 'number' && totalBookmarks > 0
                ? totalBookmarks
                : undefined,
          },
          {
            id: 'tab-settings',
            label: locale === 'bn' ? 'সেটিংস' : 'Settings',
            href: ROUTES.SETTINGS,
          },
        ]
      : []),
  ];

  return (
    <SectionLayout
      sidebar={
        <ProfileSidebar
          activeId={activeId}
          targetUser={targetUser}
          baseUrl={effectiveBaseUrl}
        />
      }
      backHref="/"
      mobileTabs={mobileTabs}
      activeMobileTabId={activeMobileTabId}
      maxWidth={maxWidth}
    >
      {children}
    </SectionLayout>
  );
}
