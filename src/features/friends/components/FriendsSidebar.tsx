'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Users,
  UserCheck,
  Send,
  Home,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { usePendingRequestsCount } from '../hooks/useFriendRequests';
import { SectionSidebar, SidebarNavItem } from '@/components/navigation/SectionSidebar';

export function FriendsSidebar() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const { data: requestCount = 0 } = usePendingRequestsCount();

  const navItems: SidebarNavItem[] = [
    {
      id: 'friends-home',
      label: locale === 'bn' ? 'হোম' : 'Home',
      href: ROUTES.FRIENDS.HOME,
      icon: Home,
      iconBg: 'bg-primary-500 text-white',
      exact: true,
    },
    {
      id: 'friends-requests',
      label: locale === 'bn' ? 'ফ্রেন্ড রিকোয়েস্ট' : 'Friend requests',
      href: ROUTES.FRIENDS.REQUESTS,
      icon: UserCheck,
      iconBg: 'bg-teal-500 text-white',
      count: requestCount > 0 ? requestCount : undefined,
    },
    {
      id: 'friends-all',
      label: locale === 'bn' ? 'সকল বন্ধু' : 'All friends',
      href: ROUTES.FRIENDS.LIST,
      icon: Users,
      iconBg: 'bg-indigo-600 text-white',
    },
    {
      id: 'friends-sent',
      label: locale === 'bn' ? 'পাঠানো রিকোয়েস্ট' : 'Sent requests',
      href: ROUTES.FRIENDS.SENT,
      icon: Send,
      iconBg: 'bg-blue-600 text-white',
    },
  ];

  return (
    <SectionSidebar
      title={locale === 'bn' ? 'বন্ধু' : 'Friends'}
      backHref={pathname === ROUTES.FRIENDS.HOME ? '/' : ROUTES.FRIENDS.HOME}
      items={navItems}
      showUserProfile={true}
    />
  );
}
