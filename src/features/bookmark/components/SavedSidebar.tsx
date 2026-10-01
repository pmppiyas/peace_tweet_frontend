'use client';

import React from 'react';
import { Bookmark, Compass, Layers } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useBookmarks } from '../hooks/useBookmarks';
import { SectionSidebar, SidebarNavItem } from '@/components/navigation/SectionSidebar';

export interface SavedSidebarProps {
  activeId?: string;
}

export function SavedSidebar({ activeId }: SavedSidebarProps) {
  const { locale } = useLanguage();
  const { data } = useBookmarks({ limit: 1 });
  const totalCount = data?.meta?.total;

  const navItems: SidebarNavItem[] = [
    {
      id: 'saved-all',
      label: locale === 'bn' ? 'সকল সংরক্ষিত' : 'All Saved Items',
      href: ROUTES.SAVED,
      icon: Bookmark,
      iconBg: 'bg-purple-600 text-white',
      exact: true,
      count: typeof totalCount === 'number' && totalCount > 0 ? totalCount : undefined,
    },
    {
      id: 'saved-duas',
      label: locale === 'bn' ? 'দোয়া খুঁজুন' : 'Browse Duas',
      href: ROUTES.DUAS,
      icon: Compass,
      iconBg: 'bg-teal-500 text-white',
    },
    {
      id: 'saved-categories',
      label: locale === 'bn' ? 'বিষয়ভিত্তিক ক্যাটাগরি' : 'Categories',
      href: ROUTES.CATEGORIES,
      icon: Layers,
      iconBg: 'bg-blue-600 text-white',
    },
  ];

  return (
    <SectionSidebar
      title={locale === 'bn' ? 'সংরক্ষিত আইটেম' : 'Saved'}
      backHref="/"
      items={navItems}
      showUserProfile={true}
      activeId={activeId}
    />
  );
}
