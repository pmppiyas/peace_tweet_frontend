'use client';

import React from 'react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { usePendingRequestsCount } from '../hooks/useFriendRequests';
import { FriendsSidebar } from './FriendsSidebar';
import { SectionLayout } from '@/components/layout/SectionLayout';

export interface FriendsLayoutProps {
  children: React.ReactNode;
}

export function FriendsLayout({ children }: FriendsLayoutProps) {
  const { locale } = useLanguage();
  const { data: requestCount = 0 } = usePendingRequestsCount();

  const mobileTabs = [
    {
      id: 'tab-home',
      label: locale === 'bn' ? 'হোম' : 'Home',
      href: ROUTES.FRIENDS.HOME,
      exact: true,
    },
    {
      id: 'tab-requests',
      label: locale === 'bn' ? 'রিকোয়েস্ট' : 'Requests',
      href: ROUTES.FRIENDS.REQUESTS,
      count: requestCount > 0 ? requestCount : undefined,
    },
    {
      id: 'tab-all',
      label: locale === 'bn' ? 'সকল বন্ধু' : 'All Friends',
      href: ROUTES.FRIENDS.LIST,
    },
    {
      id: 'tab-sent',
      label: locale === 'bn' ? 'পাঠানো' : 'Sent',
      href: ROUTES.FRIENDS.SENT,
    },
  ];

  return (
    <SectionLayout
      sidebar={<FriendsSidebar />}
      mobileTabs={mobileTabs}
      maxWidth="max-w-6xl"
    >
      {children}
    </SectionLayout>
  );
}
