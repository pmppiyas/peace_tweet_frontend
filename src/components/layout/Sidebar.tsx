'use client';

import React from 'react';
import {
  Home,
  Compass,
  Bookmark,
  Layers,
  Settings,
  User,
  Users,
  Users2,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { ROUTES } from '@/constants/routes';
import {
  SectionSidebar,
  SidebarNavItem,
} from '@/components/navigation/SectionSidebar';

export function Sidebar() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();

  const menuItems: SidebarNavItem[] = [
    {
      id: 'sidebar-home',
      label: t('nav.home'),
      href: ROUTES.HOME,
      icon: Home,
      iconBg: 'bg-primary-500 text-white',
      exact: true,
    },
    {
      id: 'sidebar-duas',
      label: t('nav.duas'),
      href: ROUTES.DUAS,
      icon: Compass,
      iconBg: 'bg-teal-500 text-white',
    },
    {
      id: 'sidebar-categories',
      label: t('nav.categories'),
      href: ROUTES.CATEGORIES,
      icon: Layers,
      iconBg: 'bg-blue-600 text-white',
    },
    {
      id: 'sidebar-friends',
      label: t('nav.friends'),
      href: isAuthenticated ? ROUTES.FRIENDS.HOME : ROUTES.LOGIN,
      icon: Users,
      iconBg: 'bg-indigo-600 text-white',
    },
    {
      id: 'sidebar-groups',
      label: t('nav.groups'),
      href: ROUTES.GROUPS.HOME,
      icon: Users2,
      iconBg: 'bg-primary-600 text-white',
    },
    {
      id: 'sidebar-bookmarks',
      label: t('nav.bookmarks'),
      href: isAuthenticated ? ROUTES.SAVED : ROUTES.LOGIN,
      icon: Bookmark,
      iconBg: 'bg-purple-600 text-white',
    },
    {
      id: 'sidebar-profile',
      label: isAuthenticated ? t('nav.profile') : t('nav.login'),
      href: isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN,
      icon: User,
      iconBg: 'bg-amber-600 text-white',
    },
    {
      id: 'sidebar-settings',
      label: t('nav.settings'),
      href: ROUTES.SETTINGS,
      icon: Settings,
      iconBg: 'bg-gray-600 text-white',
    },
    ...(isAdmin
      ? [
          {
            id: 'sidebar-admin',
            label: t('nav.admin'),
            href: ROUTES.ADMIN.HOME,
            icon: Shield,
            iconBg: 'bg-amber-500 text-white',
          },
        ]
      : []),
  ];

  const hadithFooter = (
    <div className="rounded-xl border border-[#e4e6eb] bg-white p-3.5 text-xs text-[#050505] dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] shadow-2xs">
      <div className="flex items-center gap-1.5 font-bold text-primary-700 dark:text-primary-400 mb-1">
        <Sparkles className="h-4 w-4" />
        <span>{t('sidebar.dailyHadithTitle')}</span>
      </div>
      <p className="text-[#050505] dark:text-[#e4e6eb] leading-relaxed">
        {t('sidebar.dailyHadithQuote')}
      </p>
      <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] mt-1 text-right">
        {t('sidebar.dailyHadithSource')}
      </p>
    </div>
  );

  return (
    <SectionSidebar
      items={menuItems}
      showUserProfile={true}
      footer={hadithFooter}
    />
  );
}
