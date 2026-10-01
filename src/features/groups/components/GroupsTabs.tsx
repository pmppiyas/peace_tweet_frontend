'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { MessageSquare, Users, UserPlus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface GroupDetailTabsProps {
  slug: string;
  canManage?: boolean;
}

export function GroupDetailTabs({ slug, canManage }: GroupDetailTabsProps) {
  const pathname = usePathname();
  const { locale } = useLanguage();

  const tabs = [
    {
      label: locale === 'bn' ? 'আলোচনা' : 'Discussion',
      href: ROUTES.GROUPS.DETAIL(slug),
      icon: MessageSquare,
      exact: true,
    },
    {
      label: locale === 'bn' ? 'সদস্যবৃন্দ' : 'Members',
      href: ROUTES.GROUPS.MEMBERS(slug),
      icon: Users,
      exact: false,
    },
    ...(canManage
      ? [
          {
            label: locale === 'bn' ? 'অনুরোধ' : 'Requests',
            href: ROUTES.GROUPS.REQUESTS(slug),
            icon: UserPlus,
            exact: false,
          },
          {
            label: locale === 'bn' ? 'সেটিংস' : 'Settings',
            href: ROUTES.GROUPS.SETTINGS(slug),
            icon: Settings,
            exact: false,
          },
        ]
      : []),
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#e4e6eb] dark:border-[#393a3b]">
      {tabs.map((tab) => {
        const isActive = tab.exact
          ? pathname === tab.href
          : pathname.startsWith(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap',
              isActive
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300'
                : 'text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c]'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
