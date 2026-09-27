'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import {
  Compass,
  Users,
  MessageSquare,
  Info,
  UserCheck,
  Settings,
} from 'lucide-react';

export interface GroupsNavTabsProps {
  activeTab: 'discover' | 'my-groups';
  onTabChange: (tab: 'discover' | 'my-groups') => void;
  myGroupsCount?: number;
}

export function GroupsNavTabs({
  activeTab,
  onTabChange,
  myGroupsCount,
}: GroupsNavTabsProps) {
  const { locale, formatNumber } = useLanguage();

  return (
    <div className="flex items-center gap-1.5 border-b border-[#e4e6eb] pb-2 dark:border-[#393a3b]">
      <button
        type="button"
        onClick={() => onTabChange('discover')}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all',
          activeTab === 'discover'
            ? 'bg-emerald-600 text-white shadow-2xs'
            : 'text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]',
        )}
      >
        <Compass className="h-4 w-4" />
        <span>{locale === 'bn' ? 'এক্সপ্লোর গ্রুপ' : 'Discover'}</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('my-groups')}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all',
          activeTab === 'my-groups'
            ? 'bg-emerald-600 text-white shadow-2xs'
            : 'text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]',
        )}
      >
        <Users className="h-4 w-4" />
        <span>{locale === 'bn' ? 'আমার গ্রুপসমূহ' : 'My Groups'}</span>
        {typeof myGroupsCount === 'number' && (
          <span
            className={cn(
              'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
              activeTab === 'my-groups'
                ? 'bg-white/20 text-white'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
            )}
          >
            {formatNumber(myGroupsCount)}
          </span>
        )}
      </button>
    </div>
  );
}

export interface GroupDetailTabsProps {
  slug: string;
  canManage?: boolean;
  pendingRequestsCount?: number;
}

export function GroupDetailTabs({
  slug,
  canManage,
  pendingRequestsCount,
}: GroupDetailTabsProps) {
  const pathname = usePathname();
  const { locale, formatNumber } = useLanguage();

  const isPosts = pathname === ROUTES.GROUPS.DETAIL(slug);
  const isMembers = pathname === ROUTES.GROUPS.MEMBERS(slug);
  const isRequests = pathname === ROUTES.GROUPS.REQUESTS(slug);
  const isSettings = pathname === ROUTES.GROUPS.SETTINGS(slug);

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-[#e4e6eb] pb-2 dark:border-[#393a3b] scrollbar-none">
      {/* 1. Posts */}
      <Link href={ROUTES.GROUPS.DETAIL(slug)}>
        <button
          type="button"
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all',
            isPosts
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]',
          )}
        >
          <MessageSquare className="h-4 w-4" />
          <span>{locale === 'bn' ? 'পোস্ট ও আলোচনা' : 'Posts'}</span>
        </button>
      </Link>

      {/* 2. Members */}
      <Link href={ROUTES.GROUPS.MEMBERS(slug)}>
        <button
          type="button"
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all',
            isMembers
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]',
          )}
        >
          <Users className="h-4 w-4" />
          <span>{locale === 'bn' ? 'সদস্যবৃন্দ' : 'Members'}</span>
        </button>
      </Link>

      {/* 3. Requests (Admin/Owner) */}
      {canManage && (
        <Link href={ROUTES.GROUPS.REQUESTS(slug)}>
          <button
            type="button"
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all',
              isRequests
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]',
            )}
          >
            <UserCheck className="h-4 w-4" />
            <span>{locale === 'bn' ? 'অনুরোধ' : 'Requests'}</span>
            {typeof pendingRequestsCount === 'number' &&
              pendingRequestsCount > 0 && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                    isRequests
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
                  )}
                >
                  {formatNumber(pendingRequestsCount)}
                </span>
              )}
          </button>
        </Link>
      )}

      {/* 4. Settings (Admin/Owner) */}
      {canManage && (
        <Link href={ROUTES.GROUPS.SETTINGS(slug)}>
          <button
            type="button"
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all',
              isSettings
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]',
            )}
          >
            <Settings className="h-4 w-4" />
            <span>{locale === 'bn' ? 'সেটিংস' : 'Settings'}</span>
          </button>
        </Link>
      )}
    </div>
  );
}
