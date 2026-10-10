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
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { useUnreadNotificationsCount } from '@/features/notifications/hooks/useNotifications';
import { NotificationDropdown } from '@/features/notifications/components/NotificationDropdown';
import { MessengerDropdown, useTotalUnreadCount } from '@/features/chat';
import { useChatStore } from '@/stores/useChatStore';
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
  const { t, locale } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const isMessengerOpen = useChatStore(
    (state) => state.isMessengerDropdownOpen
  );
  const setIsMessengerOpen = useChatStore(
    (state) => state.setIsMessengerDropdownOpen
  );
  const isMessagesActive =
    pathname === '/messages' || pathname.startsWith('/messages/');
  const notificationsTriggerRef = useRef<HTMLButtonElement>(null);
  const messengerTriggerRef = useRef<HTMLButtonElement>(null);

  const { data: unreadNotificationsCount = 0 } =
    useUnreadNotificationsCount(isAuthenticated);
  const unreadMessagesCount = useTotalUnreadCount();

  const isLoginPage =
    pathname === ROUTES.LOGIN ||
    pathname === '/login' ||
    pathname === ROUTES.REGISTER ||
    pathname === '/register';

  const navCenterLinks = [
    { id: 'nav-home', label: t('nav.home'), href: ROUTES.HOME, icon: Home },
    {
      id: 'nav-messages',
      label: t('nav.messages'),
      href: isAuthenticated ? ROUTES.MESSAGES : ROUTES.LOGIN,
      icon: MessageCircle,
    },
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

  const rightActionButtons = isLoginPage ? (
    <div className="relative flex items-center gap-1.5 sm:gap-2 shrink-0">
      {/* 1. Search circular button */}
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors cursor-pointer"
        title={locale === 'bn' ? 'অনুসন্ধান' : 'Search'}
        aria-label="Search"
      >
        <Search className="h-[19px] w-[19px] stroke-[2.2]" strokeWidth={2.2} />
      </button>

      {/* 2. User / Login button */}
      {isAuthenticated ? (
        <Link
          href={ROUTES.PROFILE}
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95"
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
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
            pathname === ROUTES.LOGIN
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 font-semibold ring-2 ring-primary-500/20'
              : 'bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb]'
          )}
          title={t('nav.login')}
          aria-label="Login"
        >
          <UserIcon
            className="h-[19px] w-[19px] stroke-[2.2]"
            strokeWidth={2.2}
          />
        </Link>
      )}

      {/* 3. Facebook 9-dots Menu Drawer button */}
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors cursor-pointer"
        title={locale === 'bn' ? 'মেনু' : 'Menu'}
        aria-label="Open menu drawer"
      >
        <FacebookMenuIcon className="h-5 w-5" />
      </button>
    </div>
  ) : (
    <div className="relative flex items-center gap-1.5 sm:gap-2 shrink-0">
      {/* 2. Messenger / Messages */}
      {isAuthenticated ? (
        <>
          {/* Mobile Direct Link to /messages */}
          <Link
            href={ROUTES.MESSAGES}
            className={cn(
              'relative flex md:hidden h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer',
              isMessagesActive
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 font-semibold ring-2 ring-primary-500/20'
                : 'bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb]'
            )}
            title={t('nav.messages')}
            aria-label="Messages"
          >
            <MessageCircle
              className="h-[19px] w-[19px] stroke-[2.2]"
              strokeWidth={2.2}
            />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white shadow-xs">
                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
              </span>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            ref={messengerTriggerRef}
            data-messenger-trigger="true"
            type="button"
            onClick={() => {
              if (isMessagesActive) {
                setIsMessengerOpen(false);
              } else {
                setIsMessengerOpen((prev) => !prev);
                setIsNotificationsOpen(false);
              }
            }}
            className={cn(
              'relative hidden md:flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer',
              isMessagesActive || isMessengerOpen
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 font-semibold ring-2 ring-primary-500/20'
                : 'bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb]'
            )}
            title={t('nav.messages')}
            aria-label="Chats"
            aria-expanded={isMessengerOpen}
          >
            <MessageCircle
              className="h-[19px] w-[19px] stroke-[2.2]"
              strokeWidth={2.2}
            />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white shadow-xs">
                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
              </span>
            )}
          </button>
        </>
      ) : (
        <Link
          href={ROUTES.LOGIN}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
          title={t('nav.messages') || 'Messages'}
        >
          <MessageCircle
            className="h-[19px] w-[19px] stroke-[2.2]"
            strokeWidth={2.2}
          />
        </Link>
      )}

      {/* 3. Notifications Bell Button */}
      {isAuthenticated ? (
        <button
          ref={notificationsTriggerRef}
          type="button"
          onClick={() => {
            setIsNotificationsOpen((prev) => !prev);
            setIsMessengerOpen(false);
          }}
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
          <Bell className="h-[19px] w-[19px] stroke-[2.2]" strokeWidth={2.2} />
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
          <Bell className="h-[19px] w-[19px] stroke-[2.2]" strokeWidth={2.2} />
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
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
            pathname === ROUTES.LOGIN
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 font-semibold ring-2 ring-primary-500/20'
              : 'bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb]'
          )}
          title={t('nav.login')}
        >
          <UserIcon
            className="h-[19px] w-[19px] stroke-[2.2]"
            strokeWidth={2.2}
          />
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

      {/* Messenger Popover Dropdown placed at right: 0 */}
      {isAuthenticated && (
        <MessengerDropdown
          isOpen={isMessengerOpen}
          onClose={() => setIsMessengerOpen(false)}
          triggerRef={messengerTriggerRef}
        />
      )}

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
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] shadow-2xs select-none',
        (pathname === '/messages' || pathname.startsWith('/messages/')) &&
          'hidden md:block'
      )}
    >
      <Container size="xl">
        {/* Header container */}
        <div className="relative flex items-center justify-between h-14 gap-2">
          {/* Left Column: Brand Logo + Search Button (+ Back Button on subroutes) */}
          <div className="flex items-center gap-2 shrink-0 z-10">
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
              <span
                className={cn(
                  'text-xl font-extrabold tracking-tight text-primary-700 dark:text-white select-none',
                  isLoginPage ? 'inline-block' : 'hidden sm:inline-block'
                )}
              >
                PeaceTweet
              </span>
            </Link>

            {/* Search circular button (Same style as messenger and notification) */}
            {!isLoginPage && (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors cursor-pointer"
                title={locale === 'bn' ? 'অনুসন্ধান' : 'Search'}
                aria-label="Search"
              >
                <Search
                  className="h-[19px] w-[19px] stroke-[2.2]"
                  strokeWidth={2.2}
                />
              </button>
            )}
          </div>

          {/* Center Column: Navigation Tabs (Desktop only: lg:grid, hidden on login page) */}
          {!isLoginPage && (
            <div className="absolute inset-x-0 mx-auto hidden lg:flex justify-center h-full max-w-2xl pointer-events-none px-2 sm:px-0">
              <nav className="grid grid-cols-5 w-full h-full gap-1.5 pointer-events-auto">
                {navCenterLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.id === 'nav-bookmarks'
                      ? pathname.startsWith(ROUTES.SAVED)
                      : item.id === 'nav-messages'
                        ? isMessagesActive
                        : item.href === '/'
                          ? pathname === '/'
                          : pathname.startsWith(item.href) &&
                            item.href !== ROUTES.LOGIN;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        'relative flex h-full items-center justify-center transition-colors px-2 sm:px-4 rounded-xl',
                        isActive
                          ? 'text-primary-500 dark:text-primary-400'
                          : 'text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c]'
                      )}
                      title={item.label}
                    >
                      <div className="relative">
                        <Icon
                          strokeWidth={isActive ? 2.4 : 2.1}
                          className={cn(
                            'h-[22px] w-[22px]',
                            isActive
                              ? 'stroke-[2.4] text-primary-500 dark:text-primary-400'
                              : 'stroke-[2.1]'
                          )}
                        />
                        {item.id === 'nav-messages' && unreadMessagesCount > 0 && (
                          <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-xs">
                            {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                          </span>
                        )}
                      </div>
                      {isActive && (
                        <span className="absolute -bottom-1 left-4 right-4 h-[3px] bg-primary-500 dark:bg-primary-400 rounded-t-md" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Right Column: Circular Action Buttons */}
          <div className="z-10 shrink-0">{rightActionButtons}</div>
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
