'use client';

import React from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { SettingsSidebar, SettingsTab } from './SettingsSidebar';
import { SectionLayout, SectionMobileTab } from '@/components/layout/SectionLayout';

export interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab: SettingsTab;
  onSelectTab: (tab: SettingsTab) => void;
  maxWidth?: string;
}

export function SettingsLayout({
  children,
  activeTab,
  onSelectTab,
  maxWidth = 'max-w-3xl',
}: SettingsLayoutProps) {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const needsPassword = Boolean(user?.needPasswordUpdate) || user?.hasPassword === false;

  const mobileTabs: SectionMobileTab[] = [
    {
      id: 'tab-profile',
      label: locale === 'bn' ? 'প্রোফাইল' : 'Profile',
      href: '/settings?tab=profile',
    },
    {
      id: 'tab-security',
      label: needsPassword
        ? (locale === 'bn' ? 'পাসওয়ার্ড যোগ করুন' : 'Add Password')
        : (locale === 'bn' ? 'সিকিউরিটি' : 'Security'),
      href: '/settings?tab=security',
    },
    {
      id: 'tab-privacy',
      label: locale === 'bn' ? 'প্রাইভেসি' : 'Privacy',
      href: '/settings?tab=privacy',
    },
    {
      id: 'tab-theme',
      label: locale === 'bn' ? 'থিম' : 'Theme',
      href: '/settings?tab=theme',
    },
    {
      id: 'tab-language',
      label: locale === 'bn' ? 'ভাষা' : 'Language',
      href: '/settings?tab=language',
    },
  ];

  return (
    <SectionLayout
      sidebar={
        <SettingsSidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
        />
      }
      backHref="/profile"
      mobileTabs={mobileTabs}
      activeMobileTabId={`tab-${activeTab}`}
      maxWidth={maxWidth}
    >
      {children}
    </SectionLayout>
  );
}
