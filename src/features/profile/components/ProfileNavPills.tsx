'use client';

import React from 'react';
import Link from 'next/link';
import { User, Camera, MapPin, Droplet } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { SettingsTab } from './SettingsSidebar';
import { cn } from '@/lib/utils/cn';

interface ProfileNavPillsProps {
  activeTab: SettingsTab;
  onSelectTab: (tab: SettingsTab) => void;
}

export function ProfileNavPills({ activeTab, onSelectTab }: ProfileNavPillsProps) {
  const { locale } = useLanguage();

  const pills = [
    {
      id: 'profile' as SettingsTab,
      label: locale === 'bn' ? 'সাধারণ তথ্য' : 'Basic Info',
      icon: User,
    },
    {
      id: 'photos' as SettingsTab,
      label: locale === 'bn' ? 'ছবি ও কভার' : 'Photos',
      icon: Camera,
    },
    {
      id: 'location' as SettingsTab,
      label: locale === 'bn' ? 'অবস্থান ও ঠিকানা' : 'Location',
      icon: MapPin,
    },
    {
      id: 'blood' as SettingsTab,
      label: locale === 'bn' ? 'রক্তদান ও ডোনার' : 'Blood Donation',
      icon: Droplet,
    },
  ];

  const isProfileRelated = ['profile', 'photos', 'location', 'blood'].includes(activeTab);
  if (!isProfileRelated) return null;

  return (
    <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none">
      {pills.map((pill) => {
        const Icon = pill.icon;
        const isActive = activeTab === pill.id;

        return (
          <button
            key={pill.id}
            type="button"
            onClick={() => onSelectTab(pill.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs',
              isActive
                ? 'bg-primary-500 text-white shadow-xs'
                : 'bg-white dark:bg-[#242526] text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] border border-[#e4e6eb] dark:border-[#393a3b]'
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{pill.label}</span>
          </button>
        );
      })}
    </div>
  );
}
