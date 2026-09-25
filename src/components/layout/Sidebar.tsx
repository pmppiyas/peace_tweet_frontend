'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Bookmark,
  Layers,
  Settings,
  User,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    {
      id: 'sidebar-home',
      label: t('nav.home'),
      href: ROUTES.HOME,
      icon: Home,
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      id: 'sidebar-duas',
      label: t('nav.duas'),
      href: ROUTES.DUAS,
      icon: Compass,
      iconBg: 'bg-teal-500 text-white',
    },
    {
      id: 'sidebar-categories',
      label: t('nav.categories'),
      href: ROUTES.CATEGORIES,
      icon: Layers,
      iconBg: 'bg-blue-600 text-white',
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
  ];

  return (
    <aside className="hidden lg:block w-60 shrink-0 space-y-2 sticky top-20 h-[calc(100vh-5.5rem)] overflow-y-auto pr-2 select-none">
      {/* 1. User Short Profile Row (Like Facebook top profile item) */}
      {isAuthenticated && user && (
        <Link
          href={ROUTES.PROFILE}
          className="flex items-center gap-3 rounded-xl px-2.5 py-2 hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b3c] transition-colors"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-xs">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-[15px] text-[#050505] dark:text-[#e4e6eb] truncate">
              {user.name}
            </p>
          </div>
        </Link>
      )}

      {/* 2. Navigation Items */}
      <nav className="space-y-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors',
                isActive
                  ? 'bg-[#e4e6eb] dark:bg-[#3a3b3c] font-bold text-emerald-800 dark:text-emerald-400'
                  : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-[#e4e6eb]/80 dark:hover:bg-[#3a3b3c] font-semibold text-[15px]',
              )}
            >

              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-xs',
                  item.iconBg,
                )}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            href={ROUTES.ADMIN}
            className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-[#050505] dark:text-[#e4e6eb] hover:bg-[#e4e6eb]/80 dark:hover:bg-[#3a3b3c] font-semibold text-[15px] transition-colors"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <span>{t('nav.admin')}</span>
          </Link>
        )}
      </nav>

      <hr className="border-[#e4e6eb] dark:border-[#393a3b] my-2" />

      {/* 3. Daily Hadith Widget */}
      <div className="rounded-xl border border-[#e4e6eb] bg-white p-3.5 text-xs text-[#050505] dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-400 mb-1">
          <Sparkles className="h-4 w-4" />
          <span>{t('sidebar.dailyHadithTitle')}</span>
        </div>
        <p className="text-[#050505] dark:text-[#e4e6eb] leading-relaxed">
          {t('sidebar.dailyHadithQuote')}
        </p>
        <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] mt-1 text-right">
          {t('sidebar.dailyHadithSource')}
        </p>
      </div>
    </aside>
  );
}
