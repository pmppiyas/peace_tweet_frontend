'use client';

import React from 'react';
import {
  User,
  KeyRound,
  Shield,
  Palette,
  Globe,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { SectionSidebar, SidebarNavItem } from '@/components/navigation/SectionSidebar';

export type SettingsTab = 'profile' | 'security' | 'privacy' | 'theme' | 'language';

export interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onSelectTab: (tab: SettingsTab) => void;
}

export function SettingsSidebar({ activeTab, onSelectTab }: SettingsSidebarProps) {
  const { locale } = useLanguage();

  const navItems: SidebarNavItem[] = [
    {
      id: 'settings-profile',
      label: locale === 'bn' ? 'প্রোফাইল' : 'Profile',
      href: '/settings?tab=profile',
      icon: User,
      iconBg: 'bg-primary-500 text-white',
      onClick: () => onSelectTab('profile'),
    },
    {
      id: 'settings-security',
      label: locale === 'bn' ? 'সিকিউরিটি' : 'Security',
      href: '/settings?tab=security',
      icon: KeyRound,
      iconBg: 'bg-blue-600 text-white',
      onClick: () => onSelectTab('security'),
    },
    {
      id: 'settings-privacy',
      label: locale === 'bn' ? 'প্রাইভেসি' : 'Privacy',
      href: '/settings?tab=privacy',
      icon: Shield,
      iconBg: 'bg-indigo-600 text-white',
      onClick: () => onSelectTab('privacy'),
    },
    {
      id: 'settings-theme',
      label: locale === 'bn' ? 'থিম' : 'Theme',
      href: '/settings?tab=theme',
      icon: Palette,
      iconBg: 'bg-amber-500 text-white',
      onClick: () => onSelectTab('theme'),
    },
    {
      id: 'settings-language',
      label: locale === 'bn' ? 'ভাষা' : 'Language',
      href: '/settings?tab=language',
      icon: Globe,
      iconBg: 'bg-teal-500 text-white',
      onClick: () => onSelectTab('language'),
    },
  ];

  return (
    <SectionSidebar
      title={locale === 'bn' ? 'সেটিংস' : 'Settings'}
      backHref="/profile"
      items={navItems}
      activeId={`settings-${activeTab}`}
    />
  );
}
