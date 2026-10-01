'use client';

import React, { useState } from 'react';
import {
  User,
  KeyRound,
  Shield,
  Palette,
  Globe,
  LogOut,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { SectionSidebar, SidebarNavItem } from '@/components/navigation/SectionSidebar';
import { LogoutConfirmModal } from '@/components/common/LogoutConfirmModal';

export type SettingsTab = 'profile' | 'security' | 'privacy' | 'theme' | 'language';

export interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onSelectTab: (tab: SettingsTab) => void;
}

export function SettingsSidebar({ activeTab, onSelectTab }: SettingsSidebarProps) {
  const { locale } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const logoutFooter = isAuthenticated ? (
    <button
      type="button"
      onClick={() => setShowLogoutModal(true)}
      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600">
        <LogOut className="h-4 w-4" />
      </div>
      <span>{locale === 'bn' ? 'লগআউট করুন' : 'Log Out'}</span>
    </button>
  ) : undefined;

  return (
    <>
      <SectionSidebar
        title={locale === 'bn' ? 'সেটিংস' : 'Settings'}
        backHref="/profile"
        items={navItems}
        footer={logoutFooter}
        activeId={`settings-${activeTab}`}
      />

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
}
