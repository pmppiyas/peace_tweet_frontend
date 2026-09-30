'use client';

import React from 'react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useBookmarks } from '../hooks/useBookmarks';
import { SavedSidebar } from './SavedSidebar';
import { SectionLayout, SectionMobileTab } from '@/components/layout/SectionLayout';

export interface SavedLayoutProps {
  children: React.ReactNode;
}

export function SavedLayout({ children }: SavedLayoutProps) {
  const { locale } = useLanguage();
  const { data } = useBookmarks({ limit: 1 });
  const totalCount = data?.meta?.total;

  const mobileTabs: SectionMobileTab[] = [
    {
      id: 'tab-saved',
      label: locale === 'bn' ? 'সংরক্ষিত' : 'Saved',
      href: ROUTES.SAVED,
      exact: true,
      count: typeof totalCount === 'number' && totalCount > 0 ? totalCount : undefined,
    },
    {
      id: 'tab-duas',
      label: locale === 'bn' ? 'দোয়া' : 'Duas',
      href: ROUTES.DUAS,
    },
    {
      id: 'tab-categories',
      label: locale === 'bn' ? 'ক্যাটাগরি' : 'Categories',
      href: ROUTES.CATEGORIES,
    },
  ];

  return (
    <SectionLayout
      sidebar={<SavedSidebar />}
      mobileTabs={mobileTabs}
      maxWidth="max-w-4xl"
    >
      {children}
    </SectionLayout>
  );
}
