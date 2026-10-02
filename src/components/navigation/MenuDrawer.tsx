'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  X,
  Home,
  Compass,
  Layers,
  Users,
  Users2,
  Bookmark,
  Settings,
  Shield,
  Moon,
  Sun,
  Globe,
  LogIn,
  UserPlus,
  ChevronRight,
  Droplet,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { usePendingRequestsCount } from '@/features/friends/hooks/useFriendRequests';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';
import { CardTitle } from '@/components/ui/Card';

export interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { data: requestCount = 0 } = usePendingRequestsCount(isAuthenticated);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'menu-home',
      label: locale === 'bn' ? 'হোম ফিড' : 'Home Feed',
      href: ROUTES.HOME,
      icon: Home,
      iconBg: 'bg-primary-500 text-white',
      exact: true,
    },

    {
      id: 'menu-categories',
      label: locale === 'bn' ? 'বিষয়ভিত্তিক ক্যাটাগরি' : 'Categories',
      href: ROUTES.CATEGORIES,
      icon: Layers,
      iconBg: 'bg-blue-600 text-white',
    },
    {
      id: 'menu-friends',
      label: locale === 'bn' ? 'ফ্রেন্ডস' : 'Friends',
      href: isAuthenticated ? ROUTES.FRIENDS.HOME : ROUTES.LOGIN,
      icon: Users,
      iconBg: 'bg-indigo-600 text-white',
      count: isAuthenticated && requestCount > 0 ? requestCount : undefined,
    },
    {
      id: 'menu-groups',
      label: locale === 'bn' ? 'গ্রুপসমূহ' : 'Groups',
      href: ROUTES.GROUPS.HOME,
      icon: Users2,
      iconBg: 'bg-primary-600 text-white',
    },
    {
      id: 'menu-blood',
      label: locale === 'bn' ? 'রক্তদান' : 'Blood Donation',
      href: ROUTES.BLOOD.HOME,
      icon: Droplet,
      iconBg: 'bg-rose-600 text-white',
    },
    {
      id: 'menu-bookmarks',
      label: locale === 'bn' ? 'সংরক্ষিত আইটেম' : 'Saved Bookmarks',
      href: isAuthenticated ? ROUTES.SAVED : ROUTES.LOGIN,
      icon: Bookmark,
      iconBg: 'bg-purple-600 text-white',
    },
    {
      id: 'menu-settings',
      label: locale === 'bn' ? 'সেটিংস' : 'Settings',
      href: ROUTES.SETTINGS,
      icon: Settings,
      iconBg: 'bg-gray-600 text-white',
    },
    ...(isAdmin
      ? [
          {
            id: 'menu-admin',
            label: locale === 'bn' ? 'এডমিন ড্যাশবোর্ড' : 'Admin Panel',
            href: ROUTES.ADMIN.HOME,
            icon: Shield,
            iconBg: 'bg-amber-500 text-white',
          },
        ]
      : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative z-50 w-80 max-w-[85vw] h-full bg-white dark:bg-[#242526] shadow-2xl flex flex-col transition-all animate-in slide-in-from-right duration-250 border-l border-[#e4e6eb] dark:border-[#393a3b]">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
          <h2 className="text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
            {locale === 'bn' ? 'মেনু ও সেটিংস' : 'Menu & Settings'}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
            title="Close"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {/* User Account / Auth Section */}
          {isAuthenticated ? (
            <Link
              href={ROUTES.PROFILE}
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-2xl bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] transition-colors shadow-2xs group"
            >
              <div className="relative h-11 w-11 shrink-0 rounded-full bg-primary-500 text-white font-bold text-base flex items-center justify-center overflow-hidden shadow-xs">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name || 'User'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span>{user?.name?.charAt(0) || 'P'}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-[#050505] dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] truncate">
                  {user?.username ? `@${user.username}` : user?.email}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-[#65676b] dark:text-[#b0b3b8] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div className="p-3.5 rounded-2xl border border-[#e4e6eb] bg-[#f0f2f5]/60 dark:border-[#393a3b] dark:bg-[#3a3b3c]/40 space-y-2.5">
              <div>
                <p className="font-bold text-sm text-[#050505] dark:text-white">
                  {locale === 'bn'
                    ? 'PeaceTweet এ স্বাগতম'
                    : 'Welcome to PeaceTweet'}
                </p>
                <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                  {locale === 'bn'
                    ? 'দোয়া ও ইসলামিক চিন্তার প্ল্যাটফর্মে যুক্ত হন'
                    : 'Join the peaceful Dua & Islamic platform'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href={ROUTES.LOGIN}
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-500 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-600 transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>{t('nav.login')}</span>
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-[#e4e6eb] bg-white py-2 text-xs font-bold text-[#050505] hover:bg-[#f0f2f5] dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c] transition-colors"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>{t('nav.join')}</span>
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Menu Items */}
          <div className="space-y-1">
            <p className="px-2 pb-1 text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider">
              {locale === 'bn' ? 'সকল মেনু' : 'All Shortcuts'}
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-2.5 py-2 transition-colors',
                    isActive
                      ? 'bg-[#e4e6eb] dark:bg-[#3a3b3c] font-bold text-primary-700 dark:text-primary-400'
                      : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]/60 font-semibold text-[14px]'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-xs',
                        item.iconBg
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white shrink-0">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Preferences Card */}
          <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#393a3b] space-y-2">
            <p className="px-2 text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider">
              {locale === 'bn' ? 'পছন্দ ও সেটিংস' : 'Preferences'}
            </p>

            {/* Dark / Light Mode Toggle */}
            <div className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 text-xs font-semibold text-[#050505] dark:text-[#e4e6eb]">
              <div className="flex items-center gap-2">
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4 text-primary-400" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-500" />
                )}
                <span>
                  {theme === 'dark'
                    ? locale === 'bn'
                      ? 'ডার্ক মোড'
                      : 'Dark Mode'
                    : locale === 'bn'
                      ? 'লাইট মোড'
                      : 'Light Mode'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#242526] font-bold shadow-2xs text-[11px] hover:opacity-90 transition-opacity"
              >
                {theme === 'dark' ? 'Switch Light' : 'Switch Dark'}
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 text-xs font-semibold text-[#050505] dark:text-[#e4e6eb]">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-teal-500" />
                <span>{locale === 'bn' ? 'ভাষা (Language)' : 'Language'}</span>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setLocale('bn')}
                  className={cn(
                    'px-2 py-0.5 rounded-md font-bold text-[11px] transition-colors',
                    locale === 'bn'
                      ? 'bg-primary-500 text-white shadow-2xs'
                      : 'bg-white dark:bg-[#242526] text-[#65676b] dark:text-[#b0b3b8]'
                  )}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setLocale('en')}
                  className={cn(
                    'px-2 py-0.5 rounded-md font-bold text-[11px] transition-colors',
                    locale === 'en'
                      ? 'bg-primary-500 text-white shadow-2xs'
                      : 'bg-white dark:bg-[#242526] text-[#65676b] dark:text-[#b0b3b8]'
                  )}
                >
                  ENG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
