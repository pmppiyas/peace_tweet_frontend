'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Bookmark,
  Search,
  Settings,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const navCenterLinks = [
    { label: t('nav.home'), href: ROUTES.HOME, icon: Home },
    { label: t('nav.duas'), href: ROUTES.DUAS, icon: Compass },
    { label: t('nav.categories'), href: ROUTES.CATEGORIES, icon: Layers },
    { label: t('nav.bookmarks'), href: isAuthenticated ? ROUTES.SAVED : ROUTES.LOGIN, icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] shadow-2xs select-none">
      <Container size="xl">
        {/* 3-Column Header aligned with the 3-Column Page Layout */}
        <div className="flex gap-6 justify-center items-center h-14">
          {/* Left Column: Brand Logo + Facebook Style Search Pill (Aligned with Left Sidebar: w-60) */}
          <div className="hidden lg:flex w-60 shrink-0 items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                🕊️
              </div>
              <span className="text-xl font-extrabold tracking-tight text-emerald-800 dark:text-white">
                PeaceTweet
              </span>
            </Link>
          </div>

          {/* Center Column: Main Nav Tabs (Aligned with Main Feed: max-w-2xl) */}
          <div className="w-full max-w-2xl min-w-0 h-full flex items-center justify-between">
            {/* Mobile Brand Logo if screen is smaller than lg */}
            <div className="flex lg:hidden items-center gap-2 mr-2 shrink-0">
              <Link href="/" className="flex items-center gap-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-base shadow-xs">
                  🕊️
                </div>
                <span className="font-extrabold text-base text-emerald-800 dark:text-white hidden sm:inline">
                  PeaceTweet
                </span>
              </Link>
            </div>

            {/* Navigation Tabs covering the Main Feed Width */}
            <nav className="flex-1 grid grid-cols-4 h-full">
              {navCenterLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative flex h-full items-center justify-center transition-colors px-1',
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-[#65676b] hover:bg-[#f0f2f5] hover:rounded-xl dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c]',
                    )}
                    title={item.label}
                  >
                    <Icon className={cn('h-6 w-6', isActive && 'stroke-[2.5] text-emerald-600 dark:text-emerald-400')} />
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-emerald-600 dark:bg-emerald-400 rounded-t-md" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Small Screen Right Actions */}
            <div className="flex xl:hidden items-center gap-1.5 ml-2 shrink-0">
              <Link
                href={ROUTES.SEARCH}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:hover:bg-[#4e4f50] transition-colors"
                title="Search"
              >
                <Search className="h-4.5 w-4.5" />
              </Link>
              <Link
                href={ROUTES.SETTINGS}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:hover:bg-[#4e4f50] transition-colors"
                title={t('nav.settings')}
              >
                <Settings className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Facebook Round Buttons (Aligned with Right Sidebar: w-72) */}
          <div className="hidden xl:flex w-72 shrink-0 items-center justify-end gap-2.5">
            {/* Quick Search */}
            <Link
              href={ROUTES.SEARCH}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:hover:bg-[#4e4f50] transition-colors"
              title="Search PeaceTweet"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Settings Link */}
            <Link
              href={ROUTES.SETTINGS}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:hover:bg-[#4e4f50] transition-colors"
              title={t('nav.settings')}
            >
              <Settings className="h-5 w-5" />
            </Link>

            {/* User Profile / Auth button */}
            {isAuthenticated ? (
              <Link
                href={ROUTES.PROFILE}
                className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-emerald-500/20 transition-all"
                title={user?.name || 'Profile'}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-xs">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={ROUTES.LOGIN}
                  className="text-xs font-bold text-[#050505] hover:bg-[#f0f2f5] px-3 py-2 rounded-lg dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  {t('nav.join')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
