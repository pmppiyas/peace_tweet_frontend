'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  Bookmark,
  Search,
  Layers,
  MessageCircle,
  Bell,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { useUnreadNotificationsCount } from '@/features/notifications/hooks/useNotifications';
import { NotificationDropdown } from '@/features/notifications/components/NotificationDropdown';
import { MessengerDropdown, useTotalUnreadCount } from '@/features/chat';
import { useChatStore } from '@/stores/useChatStore';
import { useUiStore } from '@/stores/uiStore';
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
  const isDrawerOpen = useUiStore((state) => state.isMenuDrawerOpen);
  const setIsDrawerOpen = useUiStore((state) => state.setMenuDrawerOpen);
  const isSearchOpen = useUiStore((state) => state.isSearchModalOpen);
  const setIsSearchOpen = useUiStore((state) => state.setSearchModalOpen);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const isMessengerOpen = useChatStore(
    (state) => state.isMessengerDropdownOpen
  );
  const setIsMessengerOpen = useChatStore(
    (state) => state.setIsMessengerDropdownOpen
  );
  const isMessagesActive =
    pathname === '/messages' || pathname.startsWith('/messages/');
  const currentActiveConversationId = useChatStore(
    (state) => state.currentActiveConversationId
  );
  const isInsideActiveChat =
    isMessagesActive && Boolean(currentActiveConversationId);

  const chatSearchQuery = useChatStore((state) => state.chatSearchQuery);
  const setChatSearchQuery = useChatStore((state) => state.setChatSearchQuery);
  const [isMobileMessagesSearchOpen, setIsMobileMessagesSearchOpen] =
    useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isMobileMessagesSearchOpen) {
      const timer = setTimeout(() => {
        mobileSearchInputRef.current?.focus({ preventScroll: true });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isMobileMessagesSearchOpen]);
  const notificationsTriggerRef = useRef<HTMLButtonElement>(null);
  const messengerTriggerRef = useRef<HTMLButtonElement>(null);

  const { data: unreadNotificationsCount = 0 } =
    useUnreadNotificationsCount(isAuthenticated);
  const unreadMessagesCount = useTotalUnreadCount();
  const isAuthPage =
    pathname === ROUTES.LOGIN ||
    pathname === '/login' ||
    pathname === ROUTES.REGISTER ||
    pathname === '/register';

  if (isAuthPage) {
    return null;
  }

  const RESERVED_FIRST_SEGMENTS = new Set([
    '',
    'categories',
    'duas',
    'friends',
    'groups',
    'search',
    'users',
    'profile',
    'saved',
    'settings',
    'messages',
    'message',
    'login',
    'register',
    'admin',
    'auth',
    'api',
    'terms',
    'blood',
    'purpose',
    'feedback',
    'notifications',
    'privacy',
  ]);

  const isNotificationsPage =
    pathname === ROUTES.NOTIFICATIONS ||
    pathname === '/notifications' ||
    pathname.startsWith('/notifications/');

  const firstPathSegment = pathname.slice(1).split('/')[0]?.toLowerCase() || '';
  const isProfilePage =
    pathname === '/profile' ||
    pathname.startsWith('/profile/') ||
    (!isAuthPage &&
      !isMessagesActive &&
      Boolean(firstPathSegment) &&
      !RESERVED_FIRST_SEGMENTS.has(firstPathSegment));

  const isLoginPage = false;

  const navCenterLinks = [
    { id: 'nav-home', label: t('nav.home'), href: ROUTES.HOME, icon: Home },
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
    <div className="relative flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 shrink-0">
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
          className="relative hidden md:flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95"
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
            'hidden md:flex h-10 w-10 items-center justify-center rounded-full transition-colors',
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
    <div className="relative flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 shrink-0">
      {/* 1. Mobile Search circular button (Shown on mobile right side) */}
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={cn(
          'h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors cursor-pointer',
          isNotificationsPage || isMessagesActive ? 'hidden' : 'flex md:hidden'
        )}
        title={locale === 'bn' ? 'অনুসন্ধান' : 'Search'}
        aria-label="Search"
      >
        <Search className="h-[19px] w-[19px] stroke-[2.2]" strokeWidth={2.2} />
      </button>

      {/* 2. Messenger / Messages (Desktop only) */}
      {isAuthenticated ? (
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
      ) : (
        <Link
          href={ROUTES.LOGIN}
          className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
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
            'relative hidden md:flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer',
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
          className="relative hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
          title="Notifications"
        >
          <Bell className="h-[19px] w-[19px] stroke-[2.2]" strokeWidth={2.2} />
        </Link>
      )}

      {/* 4. User Avatar with ChevronDown / Login */}
      {isAuthenticated ? (
        <Link
          href={ROUTES.PROFILE}
          className="relative hidden md:flex h-12 w-12 items-center justify-center rounded-full transition-transform active:scale-95"
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
            'hidden md:flex h-10 w-10 items-center justify-center rounded-full transition-colors',
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
        className={cn(
          'h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors',
          isNotificationsPage || isMessagesActive ? 'hidden md:flex' : 'flex'
        )}
        title="Menu"
        aria-label="Open menu drawer"
      >
        <FacebookMenuIcon className="h-5 w-5" />
      </button>

      {/* Mobile-only Notification title on Notifications Page (Right side) */}
      {isNotificationsPage && (
        <span
          suppressHydrationWarning
          className="md:hidden h-10 flex items-center text-2xl sm:text-[27px] font-black tracking-tight text-[#050505] dark:text-[#e4e6eb] opacity-75 select-none leading-none"
        >
          {locale === 'bn' ? 'নোটিফিকেশন' : 'Notification'}
        </span>
      )}

      {/* Mobile-only Animated Messages Search & Title Container */}
      {isMessagesActive && (
        <div className="md:hidden relative flex items-center justify-end h-10 select-none">
          {/* Default view: Compact Search Button + "Messages" text */}
          <div
            className={cn(
              'flex items-center gap-2 h-full transition-all duration-300 ease-out',
              isMobileMessagesSearchOpen
                ? 'opacity-0 scale-95 pointer-events-none absolute right-0 invisible'
                : 'opacity-100 scale-100 pointer-events-auto relative visible'
            )}
          >
            {/* Compact search trigger button */}
            <button
              type="button"
              onClick={() => setIsMobileMessagesSearchOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-transform active:scale-90 cursor-pointer shadow-2xs"
              title={locale === 'bn' ? 'ফ্রেন্ড খুঁজুন' : 'Search friends'}
              aria-label="Search friends"
            >
              <Search
                className="h-[19px] w-[19px] stroke-[2.2]"
                strokeWidth={2.2}
              />
            </button>

            {/* Messages text */}
            <span
              suppressHydrationWarning
              className="h-10 flex items-center text-2xl sm:text-[27px] font-black tracking-tight text-[#050505] dark:text-[#e4e6eb] opacity-75 leading-none shrink-0"
            >
              {locale === 'bn' ? 'মেসেজ' : 'Messages'}
            </span>
          </div>

          {/* Active view: Animated expanding search input field */}
          <div
            className={cn(
              'flex items-center transition-all duration-300 ease-out',
              isMobileMessagesSearchOpen
                ? 'opacity-100 scale-100 w-[180px] sm:w-[210px] pointer-events-auto relative visible'
                : 'opacity-0 scale-95 w-0 pointer-events-none absolute right-0 invisible overflow-hidden'
            )}
          >
            <div className="relative w-full flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-[#65676b] dark:text-[#b0b3b8] pointer-events-none shrink-0" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                placeholder={
                  locale === 'bn' ? 'ফ্রেন্ড খুঁজুন...' : 'Search friends...'
                }
                className="w-full h-9 rounded-full bg-[#f0f2f5] dark:bg-[#3a3b3c] pl-8 pr-7 text-xs sm:text-sm font-semibold text-[#050505] dark:text-[#e4e6eb] placeholder-[#65676b] dark:placeholder-[#b0b3b8] outline-hidden ring-1 ring-primary-500/20 focus:ring-2 focus:ring-primary-500/50 transition-all shadow-2xs"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsMobileMessagesSearchOpen(false);
                    setChatSearchQuery('');
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setIsMobileMessagesSearchOpen(false);
                  setChatSearchQuery('');
                }}
                className="absolute right-1 flex h-6 w-6 items-center justify-center rounded-full text-[#65676b] hover:text-[#050505] hover:bg-[#e4e6eb] dark:text-[#b0b3b8] dark:hover:text-[#e4e6eb] dark:hover:bg-[#4e4f50] transition-colors cursor-pointer"
                title={locale === 'bn' ? 'বন্ধ করুন' : 'Close search'}
              >
                <X className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}

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
        'sticky top-0 z-40 w-full h-14 box-border border-b border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] shadow-2xs select-none px-3 sm:px-0',
        ((isInsideActiveChat && isMessagesActive) || isProfilePage) &&
          'hidden md:block'
      )}
    >
      <Container
        size="2xl"
        className="h-full px-0 sm:px-0 md:px-0 lg:px-6 2xl:px-8"
      >
        {/* Header container matching layout of the page */}
        <div className="flex items-center justify-between h-full gap-4 lg:gap-6 2xl:gap-8 w-full">
          {/* Left Column: Brand Logo + Search Button (Matches Sidebar: lg:w-60 xl:w-64 2xl:w-72) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 lg:w-60 xl:w-64 2xl:w-72 z-10">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="h-10 flex items-center text-2xl sm:text-[27px] font-black tracking-tight text-primary-700 dark:text-white select-none leading-none shrink-0">
                PeaceTweet
              </span>
            </Link>

            {/* Search circular button (Same style as messenger and notification) */}
            {!isLoginPage && (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors cursor-pointer"
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

          {/* Center Column: Navigation Tabs (Matches Feed width with justify-between) */}
          {!isLoginPage && (
            <div className="hidden lg:flex flex-1 min-w-0 h-full justify-center">
              <nav className="flex items-center justify-between w-full max-w-[720px] h-full gap-1 sm:gap-2">
                {navCenterLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.id === 'nav-bookmarks'
                      ? pathname.startsWith(ROUTES.SAVED)
                      : item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href) &&
                          item.href !== ROUTES.LOGIN;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        'relative flex h-full flex-1 items-center justify-center transition-colors px-2 sm:px-4 rounded-xl',
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
                      </div>
                      {isActive && (
                        <span className="absolute -bottom-1 w-24 sm:w-28 md:w-36 max-w-[80%] h-[3px] bg-primary-500 dark:bg-primary-400 rounded-t-md mx-auto inset-x-0" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Right Column: Circular Action Buttons (Matches RightSidebar: lg:w-auto xl:w-80 2xl:w-88) */}
          <div className="flex items-center justify-end shrink-0 lg:w-auto xl:w-80 2xl:w-88 z-10">
            {rightActionButtons}
          </div>
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
