'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Compass, Users, PlusCircle, Users2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useMyGroups } from '../hooks/useMyGroups';
import { useAuth } from '@/hooks/useAuth';
import { SectionSidebar, SidebarNavItem } from '@/components/navigation/SectionSidebar';

export interface GroupsSidebarProps {
  activeId?: string;
  onSelectTab?: (tab: 'discover' | 'my-groups') => void;
}

export function GroupsSidebar({ activeId, onSelectTab }: GroupsSidebarProps) {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { data: myGroupsData } = useMyGroups({ limit: 10 });

  const myGroups =
    myGroupsData?.pages.flatMap((page) => page?.items || []) || [];

  const navItems: SidebarNavItem[] = [
    {
      id: 'groups-discover',
      label: locale === 'bn' ? 'এক্সপ্লোর গ্রুপ' : 'Discover Groups',
      href: ROUTES.GROUPS.HOME,
      icon: Compass,
      iconBg: 'bg-primary-500 text-white',
      exact: true,
      onClick: onSelectTab ? () => onSelectTab('discover') : undefined,
    },
    {
      id: 'groups-my',
      label: locale === 'bn' ? 'আমার গ্রুপসমূহ' : 'My Groups',
      href: '/groups?tab=my-groups',
      icon: Users,
      iconBg: 'bg-indigo-600 text-white',
      count: myGroups.length > 0 ? myGroups.length : undefined,
      onClick: onSelectTab ? () => onSelectTab('my-groups') : undefined,
    },
    {
      id: 'groups-create',
      label: locale === 'bn' ? 'নতুন গ্রুপ তৈরি' : 'Create New Group',
      href: isAuthenticated ? ROUTES.GROUPS.CREATE : ROUTES.LOGIN,
      icon: PlusCircle,
      iconBg: 'bg-teal-500 text-white',
    },
  ];

  // List joined groups in sidebar footer (Facebook style)
  const joinedGroupsFooter =
    isAuthenticated && myGroups.length > 0 ? (
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between px-2.5 pb-1">
          <span className="text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider">
            {locale === 'bn' ? 'আপনার যুক্ত গ্রুপ' : 'Joined Groups'}
          </span>
        </div>
        <div className="space-y-0.5">
          {myGroups.slice(0, 5).map((group) => (
            <Link
              key={group.id}
              href={ROUTES.GROUPS.DETAIL(group.slug)}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b3c] transition-colors"
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {group.avatarUrl ? (
                  <Image
                    src={group.avatarUrl}
                    alt={group.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <Users2 className="h-4 w-4" />
                )}
              </div>
              <span className="truncate text-xs font-semibold text-[#050505] dark:text-[#e4e6eb]">
                {group.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    ) : undefined;

  return (
    <SectionSidebar
      title={locale === 'bn' ? 'গ্রুপসমূহ' : 'Groups'}
      backHref={pathname === ROUTES.GROUPS.HOME ? '/' : ROUTES.GROUPS.HOME}
      items={navItems}
      showUserProfile={true}
      activeId={activeId}
      footer={joinedGroupsFooter}
    />
  );
}
