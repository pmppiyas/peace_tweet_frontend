'use client';

import React from 'react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { usePendingRequestsCount } from '@/features/friends/hooks/useFriendRequests';
import { useBookmarks } from '@/features/bookmark/hooks/useBookmarks';
import { useMyGroups } from '@/features/groups/hooks/useMyGroups';
import { ProfileSidebar } from './ProfileSidebar';
import { SectionLayout, SectionMobileTab } from '@/components/layout/SectionLayout';

export interface ProfileLayoutProps {
  children: React.ReactNode;
  activeId?: string;
  maxWidth?: string;
}

export function ProfileLayout({
  children,
  activeId = 'profile-overview',
  maxWidth = 'max-w-4xl',
}: ProfileLayoutProps) {
  const { locale } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { data: requestCount = 0 } = usePendingRequestsCount(isAuthenticated);
  const { data: bookmarkData } = useBookmarks({ limit: 1 });
  const { data: myGroupsData } = useMyGroups({ limit: 10 });

  const totalBookmarks = bookmarkData?.meta?.total;
  const myGroups =
    myGroupsData?.pages.flatMap((page) => page?.items || []) || [];

  const mobileTabs: SectionMobileTab[] = [
    {
      id: 'tab-overview',
      label: locale === 'bn' ? 'প্রোফাইল' : 'Profile',
      href: ROUTES.PROFILE,
      exact: true,
    },
    {
      id: 'tab-settings',
      label: locale === 'bn' ? 'সেটিংস' : 'Settings',
      href: ROUTES.SETTINGS,
    },
    {
      id: 'tab-friends',
      label: locale === 'bn' ? 'বন্ধুরা' : 'Friends',
      href: ROUTES.FRIENDS.LIST,
      count: requestCount > 0 ? requestCount : undefined,
    },
    {
      id: 'tab-groups',
      label: locale === 'bn' ? 'গ্রুপ' : 'Groups',
      href: '/groups?tab=my-groups',
      count: myGroups.length > 0 ? myGroups.length : undefined,
    },
    {
      id: 'tab-saved',
      label: locale === 'bn' ? 'সংরক্ষিত' : 'Saved',
      href: ROUTES.SAVED,
      count: typeof totalBookmarks === 'number' && totalBookmarks > 0 ? totalBookmarks : undefined,
    },
  ];

  return (
    <SectionLayout
      sidebar={<ProfileSidebar activeId={activeId} />}
      backHref="/"
      mobileTabs={mobileTabs}
      maxWidth={maxWidth}
    >
      {children}
    </SectionLayout>
  );
}
