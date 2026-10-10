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
  Droplet,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTotalUnreadCount } from '@/features/chat';
import { ROUTES } from '@/constants/routes';
import {
  SectionSidebar,
  SidebarNavItem,
} from '@/components/navigation/SectionSidebar';

export function Sidebar() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { t, locale } = useLanguage();
  const unreadMessagesCount = useTotalUnreadCount();

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
      id: 'sidebar-messages',
      label: t('nav.messages'),
      href: isAuthenticated ? ROUTES.MESSAGES : ROUTES.LOGIN,
      icon: MessageCircle,
      iconBg: 'bg-sky-500 text-white',
      count:
        isAuthenticated && unreadMessagesCount > 0
          ? unreadMessagesCount
          : undefined,
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
      id: 'sidebar-blood',
      label: locale === 'bn' ? 'রক্তদান' : 'Blood Donation',
      href: ROUTES.BLOOD.HOME,
      icon: Droplet,
      iconBg: 'bg-rose-600 text-white',
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

  return (
    <SectionSidebar
      items={menuItems}
      showUserProfile={true}
      className="w-72 xl:w-80"
    />
  );
}
