'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Bookmark,
  Search,
  Layers,
  GripVertical,
  MessageCircle,
  Bell,
  ChevronDown,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { usePendingRequestsCount } from '@/features/friends/hooks/useFriendRequests';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';
import { MenuDrawer } from './MenuDrawer';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: requestCount = 0 } = usePendingRequestsCount(isAuthenticated);

  const navCenterLinks = [
    { id: 'nav-home', label: t('nav.home'), href: ROUTES.HOME, icon: Home },
    { id: 'nav-duas', label: t('nav.duas'), href: ROUTES.DUAS, icon: Compass },
    {
      id: 'nav-categories',
      label: t('nav.categories'),
      href: ROUTES.CATEGORIES,
      icon: Layers,
    },
    {
      id: 'nav-bookmarks',
      label: t('nav.bookmarks'),
      href: isAuthenticated ? ROUTES.SAVED : ROUTES.LOGIN,
      icon: Bookmark,
    },
  ];

  const rightActionButtons = (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      {/* 2. Messenger / Messages */}
      <Link
        href={isAuthenticated ? ROUTES.FRIENDS.HOME : ROUTES.LOGIN}
        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
        title={t('nav.friends')}
      >
        <MessageCircle className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
      </Link>

      {/* 3. Notifications with red dot badge */}
      <Link
        href={isAuthenticated ? ROUTES.FRIENDS.REQUESTS : ROUTES.LOGIN}
        className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
        title="Notifications"
      >
        <Bell className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
        {isAuthenticated && requestCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white dark:ring-[#242526]" />
        )}
      </Link>

      {/* 4. User Avatar with ChevronDown / Login */}
      {isAuthenticated ? (
        <Link
          href={ROUTES.PROFILE}
          className="relative flex items-center justify-center rounded-full transition-transform active:scale-95"
          title={user?.name || 'Profile'}
        >
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary-500 text-white font-bold text-sm shadow-xs overflow-hidden">
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
          {/* Facebook ChevronDown badge at bottom-right of avatar */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c] border-2 border-white dark:border-[#242526] text-[#050505] dark:text-[#e4e6eb]">
            <ChevronDown className="h-2.5 w-2.5 stroke-[3]" />
          </span>
        </Link>
      ) : (
        <Link
          href={ROUTES.LOGIN}
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
          title={t('nav.login')}
        >
          <UserIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
        </Link>
      )}

      {/* 1. Menu Drawer (SlidersHorizontal) */}
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
        title="Menu"
        aria-label="Open menu drawer"
      >
        <GripVertical className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] shadow-2xs select-none">
      <Container size="xl">
        {/* Header container */}
        <div className="flex items-center justify-between h-14 gap-2">
          {/* Left Column: Brand Logo + Search Button (+ Back Button on subroutes) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 group-hover:scale-105 transition-transform">
                <Image
                  src="/p-logo.svg"
                  alt="PeaceTweet Logo"
                  width={40}
                  height={40}
                  priority
                  className="rounded-full shadow-xs"
                />
              </div>
              <span className="hidden xl:inline text-xl font-extrabold tracking-tight text-primary-700 dark:text-white">
                PeaceTweet
              </span>
            </Link>

            {/* Quick Search Circular Button directly next to Logo */}
            <Link
              href={ROUTES.SEARCH}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
              title="Search"
            >
              <Search className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </Link>
          </div>

          {/* Center Column: Navigation Tabs (Desktop only: lg:grid) */}
          <div className="hidden lg:flex flex-1 max-w-2xl justify-center h-full min-w-0">
            <nav className="grid grid-cols-4 w-full h-full">
              {navCenterLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      'relative flex h-full items-center justify-center transition-colors px-1',
                      isActive
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'text-[#65676b] hover:bg-[#f0f2f5] hover:rounded-xl dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c]'
                    )}
                    title={item.label}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6',
                        isActive &&
                          'stroke-[2.5] text-primary-500 dark:text-primary-400'
                      )}
                    />
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-500 dark:bg-primary-400 rounded-t-md" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Column: 4 Circular Buttons matching Facebook */}
          {rightActionButtons}
        </div>
      </Container>

      {/* Slide-over Menu Drawer */}
      <MenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </header>
  );
}
