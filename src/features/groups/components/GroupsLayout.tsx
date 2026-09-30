'use client';

import React from 'react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useMyGroups } from '../hooks/useMyGroups';
import { useAuth } from '@/hooks/useAuth';
import { GroupsSidebar } from './GroupsSidebar';
import { SectionLayout, SectionMobileTab } from '@/components/layout/SectionLayout';

export interface GroupsLayoutProps {
  children: React.ReactNode;
  activeTab?: 'discover' | 'my-groups';
  onSelectTab?: (tab: 'discover' | 'my-groups') => void;
}

export function GroupsLayout({
  children,
  activeTab,
  onSelectTab,
}: GroupsLayoutProps) {
  const { locale } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { data: myGroupsData } = useMyGroups({ limit: 10 });

  const myGroups =
    myGroupsData?.pages.flatMap((page) => page?.items || []) || [];

  const activeId =
    activeTab === 'my-groups'
      ? 'groups-my'
      : activeTab === 'discover'
        ? 'groups-discover'
        : undefined;

  const activeMobileTabId =
    activeTab === 'my-groups'
      ? 'tab-my-groups'
      : activeTab === 'discover'
        ? 'tab-discover'
        : undefined;

  const mobileTabs: SectionMobileTab[] = [
    {
      id: 'tab-discover',
      label: locale === 'bn' ? 'এক্সপ্লোর' : 'Discover',
      href: ROUTES.GROUPS.HOME,
      exact: true,
    },
    {
      id: 'tab-my-groups',
      label: locale === 'bn' ? 'আমার গ্রুপ' : 'My Groups',
      href: '/groups?tab=my-groups',
      count: myGroups.length > 0 ? myGroups.length : undefined,
    },
    {
      id: 'tab-create',
      label: locale === 'bn' ? 'নতুন গ্রুপ' : 'Create',
      href: isAuthenticated ? ROUTES.GROUPS.CREATE : ROUTES.LOGIN,
    },
  ];

  return (
    <SectionLayout
      sidebar={
        <GroupsSidebar activeId={activeId} onSelectTab={onSelectTab} />
      }
      mobileTabs={mobileTabs}
      activeMobileTabId={activeMobileTabId}
      maxWidth="max-w-6xl"
    >
      {children}
    </SectionLayout>
  );
}
