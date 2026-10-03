'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Bookmark,
  Search,
  Layers,
  MessageCircle,
  Bell,
  ChevronDown,
  User as UserIcon,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { usePendingRequestsCount } from '@/features/friends/hooks/useFriendRequests';
import { useUnreadNotificationsCount } from '@/features/notifications/hooks/useNotifications';
import { NotificationDropdown } from '@/features/notifications/components/NotificationDropdown';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';
import { MenuDrawer } from './MenuDrawer';
import { SearchDrawer } from '@/features/search/components/SearchDrawer';

function FacebookMenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5 fill-current', className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="5" cy="5" r="2.2" />
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="19" cy="5" r="2.2" />
      <circle cx="5" cy="12" r="2.2" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="19" cy="12" r="2.2" />
      <circle cx="5" cy="19" r="2.2" />
      <circle cx="12" cy="19" r="2.2" />
      <circle cx="19" cy="19" r="2.2" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsTriggerRef = useRef<HTMLButtonElement>(null);
  const { data: requestCount = 0 } = usePendingRequestsCount(isAuthenticated);
  const { data: unreadNotificationsCount = 0 } =
    useUnreadNotificationsCount(isAuthenticated);

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
    <div className="relative flex items-center gap-1.5 sm:gap-2 shrink-0">
      {/* 2. Messenger / Messages */}
      <Link
        href={isAuthenticated ? ROUTES.FRIENDS.HOME : ROUTES.LOGIN}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
        title={t('nav.friends')}
      >
        <MessageCircle className="h-5 w-5 stroke-[2.25]" strokeWidth={2.25} />
      </Link>

      {/* 3. Notifications Bell Button */}
      {isAuthenticated ? (
        <button
          ref={notificationsTriggerRef}
          type="button"
          onClick={() => setIsNotificationsOpen((prev) => !prev)}
          className={cn(
            'relative flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer',
            isNotificationsOpen
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400'
              : 'bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb]'
          )}
          title="Notifications"
          aria-label="Notifications"
          aria-expanded={isNotificationsOpen}
        >
          <Bell className="h-5 w-5 stroke-[2.25]" strokeWidth={2.25} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white shadow-xs">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>
      ) : (
        <Link
          href={ROUTES.LOGIN}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
          title="Notifications"
        >
          <Bell className="h-5 w-5 stroke-[2.25]" strokeWidth={2.25} />
        </Link>
      )}

      {/* 4. User Avatar with ChevronDown / Login */}
      {isAuthenticated ? (
        <Link
          href={ROUTES.PROFILE}
          className="relative flex h-12 w-12 items-center justify-center rounded-full transition-transform active:scale-95"
          title={user?.name || 'Profile'}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white font-bold text-xs shadow-2xs overflow-hidden">
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
        </Link>
      ) : (
        <Link
          href={ROUTES.LOGIN}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
          title={t('nav.login')}
        >
          <UserIcon className="h-5 w-5 stroke-[2.25]" strokeWidth={2.25} />
        </Link>
      )}

      {/* 1. Menu Drawer (Facebook 9-dots Menu) */}
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
        title="Menu"
        aria-label="Open menu drawer"
      >
        <FacebookMenuIcon className="h-5 w-5" />
      </button>

      {/* Notifications Popover Dropdown placed at right: 0 */}
      {isAuthenticated && (
        <NotificationDropdown
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          triggerRef={notificationsTriggerRef}
        />
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] shadow-2xs select-none">
      <Container size="xl">
        {/* Header container */}
        <div className="flex items-center justify-between h-14 gap-2">
          {/* Left Column: Brand Logo + Search Button (+ Back Button on subroutes) */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden shadow-xs group-hover:scale-105 transition-transform">
                <Image
                  src="/p-logo.svg"
                  alt="PeaceTweet Logo"
                  width={40}
                  height={40}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden sm:inline-block text-xl font-extrabold tracking-tight text-primary-700 dark:text-white select-none">
                PeaceTweet
              </span>
            </Link>

            {/* Search input pill on md+, Circular button on mobile */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex h-10 w-44 lg:w-60 items-center gap-2 rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] px-3.5 text-[#65676b] dark:text-[#b0b3b8] transition-colors cursor-pointer text-left"
              title="Search"
            >
              <Search
                className="h-4 w-4 shrink-0 text-[#65676b] dark:text-[#b0b3b8] stroke-[2.25]"
                strokeWidth={2.25}
              />
              <span className="text-sm select-none truncate">
                Search PeaceTweet
              </span>
            </button>

            {/* Mobile Circular Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
              title="Search"
              aria-label="Open search"
            >
              <Search className="h-5 w-5 stroke-[2.25]" strokeWidth={2.25} />
            </button>
          </div>

          {/* Center Column: Navigation Tabs (Desktop only: lg:grid) */}
          <div className="hidden lg:flex flex-1 max-w-2xl justify-center h-full min-w-0 px-2 sm:px-4">
            <nav className="grid grid-cols-4 w-full h-full gap-1.5">
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
                      'relative flex h-full items-center justify-center transition-colors px-4 sm:px-6 my-1 rounded-xl',
                      isActive
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c]'
                    )}
                    title={item.label}
                  >
                    <Icon
                      strokeWidth={isActive ? 2.6 : 2.25}
                      className={cn(
                        'h-6 w-6',
                        isActive
                          ? 'stroke-[2.6] text-primary-500 dark:text-primary-400'
                          : 'stroke-[2.25]'
                      )}
                    />
                    {isActive && (
                      <span className="absolute -bottom-1 left-2 right-2 h-[3px] bg-primary-500 dark:bg-primary-400 rounded-t-md" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Column: Circular Action Buttons */}
          {rightActionButtons}
        </div>
      </Container>

      {/* Slide-over Menu Drawer */}
      <MenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Global Search Drawer */}
      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}
