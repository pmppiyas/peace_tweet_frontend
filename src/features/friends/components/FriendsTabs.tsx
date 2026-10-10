'use client';

import React from 'react';
import { Users, UserPlus, Send } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/providers/LanguageProvider';
import { usePendingRequestsCount } from '../hooks/useFriendRequests';
import { soundEffects } from '@/lib/sound/soundEffects';

export type FriendsTabValue = 'friends' | 'requests' | 'sent';

export interface FriendsTabsProps {
  activeTab: FriendsTabValue;
  onTabChange: (tab: FriendsTabValue) => void;
}

export function FriendsTabs({ activeTab, onTabChange }: FriendsTabsProps) {
  const { locale } = useLanguage();
  const { data: requestCount = 0 } = usePendingRequestsCount();

  const tabs: Array<{
    id: FriendsTabValue;
    label: string;
    labelBn: string;
    icon: React.ElementType;
    count?: number;
  }> = [
    {
      id: 'friends',
      label: 'My Friends',
      labelBn: 'আমার বন্ধুরা',
      icon: Users,
    },
    {
      id: 'requests',
      label: 'Requests',
      labelBn: 'রিকোয়েস্ট',
      icon: UserPlus,
      count: requestCount > 0 ? requestCount : undefined,
    },
    {
      id: 'sent',
      label: 'Sent',
      labelBn: 'পাঠানো',
      icon: Send,
    },
  ];

  return (
    <div className="flex gap-1.5 p-1 rounded-2xl bg-[#f0f2f5] dark:bg-[#3a3b3c] overflow-x-auto select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              if (activeTab !== tab.id) {
                soundEffects.playTab();
              }
              onTabChange(tab.id);
            }}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap min-h-[40px]',
              isActive
                ? 'bg-white text-primary-700 shadow-xs dark:bg-[#242526] dark:text-primary-400'
                : 'text-[#65676b] hover:text-[#050505] hover:bg-black/5 dark:text-[#b0b3b8] dark:hover:text-white dark:hover:bg-white/5',
            )}
          >
            <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-primary-500 dark:text-primary-400')} />
            <span>{locale === 'bn' ? tab.labelBn : tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
