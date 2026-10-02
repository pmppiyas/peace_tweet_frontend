'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { BloodSidebar } from './BloodSidebar';
import { SectionLayout, SectionMobileTab } from '@/components/layout/SectionLayout';

export type BloodActiveTab = 'all' | 'donors' | 'my-requests' | 'my-donations';

export interface BloodLayoutProps {
  children: React.ReactNode;
  activeTab?: BloodActiveTab;
  onSelectTab?: (tab: BloodActiveTab) => void;
}

export function BloodLayout({
  children,
  activeTab,
  onSelectTab,
}: BloodLayoutProps) {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const { isAuthenticated } = useAuth();

  const activeId =
    activeTab === 'all'
      ? 'blood-all'
      : activeTab === 'donors'
        ? 'blood-donors'
        : activeTab === 'my-requests'
          ? 'blood-my-requests'
          : activeTab === 'my-donations'
            ? 'blood-my-donations'
            : undefined;

  const activeMobileTabId =
    activeTab === 'all'
      ? 'tab-blood-all'
      : activeTab === 'donors'
        ? 'tab-blood-donors'
        : activeTab === 'my-requests'
          ? 'tab-blood-my-requests'
          : activeTab === 'my-donations'
            ? 'tab-blood-my-donations'
            : undefined;

  const mobileTabs: SectionMobileTab[] = [
    {
      id: 'tab-blood-all',
      label: locale === 'bn' ? 'সকল রিকোয়েস্ট' : 'Requests',
      href: ROUTES.BLOOD.HOME,
      exact: true,
    },
    {
      id: 'tab-blood-donors',
      label: locale === 'bn' ? 'রক্তদাতা' : 'Donors',
      href: '/blood?tab=donors',
    },
    {
      id: 'tab-blood-my-requests',
      label: locale === 'bn' ? 'আমার আবেদন' : 'My Requests',
      href: isAuthenticated ? '/blood?tab=my-requests' : ROUTES.LOGIN,
    },
    {
      id: 'tab-blood-my-donations',
      label: locale === 'bn' ? 'আমার রক্তদান' : 'My Donations',
      href: isAuthenticated ? '/blood?tab=my-donations' : ROUTES.LOGIN,
    },
    {
      id: 'tab-blood-create',
      label: locale === 'bn' ? '+ আবেদন' : '+ Request',
      href: isAuthenticated ? ROUTES.BLOOD.CREATE : ROUTES.LOGIN,
    },
  ];

  return (
    <SectionLayout
      sidebar={
        <BloodSidebar activeId={activeId} onSelectTab={onSelectTab} />
      }
      backHref={pathname === ROUTES.BLOOD.HOME ? '/' : ROUTES.BLOOD.HOME}
      mobileTabs={mobileTabs}
      activeMobileTabId={activeMobileTabId}
      maxWidth="max-w-6xl"
    >
      {children}
    </SectionLayout>
  );
}
