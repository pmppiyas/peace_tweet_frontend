'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Home,
  Plus,
  Bookmark,
  Bell,
  MessageCircle,
  Check,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { useUnreadNotificationsCount } from '@/features/notifications/hooks/useNotifications';
import { useTotalUnreadCount } from '@/features/chat';
import { useUiStore } from '@/stores/uiStore';
import { MobileComposerModal } from '@/features/feed/components/MobileComposerModal';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';

export function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const { t, locale } = useLanguage();
  const {
    isMobileComposerOpen,
    setMobileComposerOpen,
    isUploadingPost,
    isPostUploadSuccess,
    isMenuDrawerOpen,
    isSearchModalOpen,
  } = useUiStore();
  const { data: unreadNotificationsCount = 0 } =
    useUnreadNotificationsCount(isAuthenticated);
  const unreadMessagesCount = useTotalUnreadCount();

  const handleComposerClick = () => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }
    setMobileComposerOpen(true);
  };

  const navItems = [
    {
      id: 'nav-home',
      label: locale === 'bn' ? 'হোম' : t('nav.home') || 'Home',
      href: ROUTES.HOME,
      icon: Home,
    },
    {
      id: 'nav-bookmarks',
      label: locale === 'bn' ? 'সংরক্ষিত' : t('nav.bookmarks') || 'Saved',
      href: isAuthenticated ? ROUTES.SAVED : ROUTES.LOGIN,
      icon: Bookmark,
    },
    {
      id: 'nav-composer',
      label: locale === 'bn' ? 'পোস্ট' : 'Post',
      icon: Plus,
      isComposer: true,
    },
    {
      id: 'nav-messages',
      label: locale === 'bn' ? 'মেসেজ' : t('nav.messages') || 'Messages',
      href: isAuthenticated ? ROUTES.MESSAGES : ROUTES.LOGIN,
      icon: MessageCircle,
      badge: unreadMessagesCount,
    },
    {
      id: 'nav-notifications',
      label: locale === 'bn' ? 'বিজ্ঞপ্তি' : t('nav.notifications') || 'Alerts',
      href: isAuthenticated ? ROUTES.NOTIFICATIONS : ROUTES.LOGIN,
      icon: Bell,
      badge: unreadNotificationsCount,
    },
  ];

  const isInsideActiveChat =
    (pathname === '/messages' || pathname.startsWith('/messages/')) &&
    Boolean(
      searchParams.get('conversationId') ||
        searchParams.get('userId') ||
        searchParams.get('user') ||
        searchParams.get('username')
    );
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <div
      className={cn(
        'md:hidden fixed bottom-0 left-0 z-50 w-full border-t border-[#e4e6eb] bg-white/95 backdrop-blur-md dark:border-[#393a3b] dark:bg-[#242526]/95 pb-safe',
        (isInsideActiveChat ||
          isAuthPage ||
          isMenuDrawerOpen ||
          isSearchModalOpen) &&
          'hidden'
      )}
    >
      <nav className="grid grid-cols-5 h-14 items-center">
        {navItems.map((item) => {
          if (item.isComposer) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={handleComposerClick}
                disabled={isUploadingPost}
                className={cn(
                  'relative flex flex-col items-center justify-center -top-2.5 z-20 h-full w-full px-0.5 text-center transition-transform active:scale-90 select-none cursor-pointer group',
                  isUploadingPost && 'cursor-wait'
                )}
                title={item.label}
                aria-label={item.label}
              >
                <div className="relative flex items-center justify-center">
                  {/* Outer animated rotating progress ring during upload */}
                  {isUploadingPost && (
                    <span className="absolute -inset-1 rounded-full border-2 border-primary-500/40 border-t-primary-500 animate-spin" />
                  )}
                  <div
                    className={cn(
                      'relative flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg ring-3 ring-white dark:ring-[#242526] transition-all group-hover:scale-105',
                      isPostUploadSuccess
                        ? 'bg-emerald-600 shadow-emerald-500/30 ring-emerald-200 dark:ring-emerald-900/50'
                        : 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/30'
                    )}
                  >
                    {isUploadingPost ? (
                      <div className="relative flex items-center justify-center">
                        <svg className="h-6 w-6 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3.5"
                          />
                          <path
                            className="opacity-100"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                          />
                        </svg>
                      </div>
                    ) : isPostUploadSuccess ? (
                      <Check className="h-6 w-6 stroke-[3] text-white animate-in zoom-in duration-200" />
                    ) : (
                      <Plus className="h-6 w-6 stroke-[2.8]" />
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    'text-[10px] truncate max-w-full leading-tight font-bold mt-0.5 transition-colors',
                    isPostUploadSuccess
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-primary-600 dark:text-primary-400',
                    isUploadingPost && 'animate-pulse'
                  )}
                >
                  {isUploadingPost
                    ? locale === 'bn'
                      ? 'পোস্ট হচ্ছে...'
                      : 'Posting...'
                    : isPostUploadSuccess
                      ? locale === 'bn'
                        ? 'সফল!'
                        : 'Done!'
                      : item.label}
                </span>
              </button>
            );
          }

          const Icon = item.icon;
          const href = item.href || '/';
          const isActive =
            item.id === 'nav-bookmarks'
              ? pathname.startsWith(ROUTES.SAVED)
              : item.id === 'nav-messages'
                ? pathname.startsWith(ROUTES.MESSAGES)
                : item.id === 'nav-notifications'
                  ? pathname.startsWith(ROUTES.NOTIFICATIONS)
                  : href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(href) &&
                      href !== ROUTES.LOGIN;

          return (
            <Link
              key={item.id}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 h-full w-full px-0.5 text-center transition-colors select-none overflow-hidden',
                isActive
                  ? 'text-primary-500 dark:text-primary-400 font-bold'
                  : 'text-[#65676b] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:text-[#e4e6eb]'
              )}
              title={item.label}
              aria-label={item.label}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    isActive ? 'stroke-[2.3]' : 'stroke-[1.9]'
                  )}
                />

                {typeof item.badge === 'number' && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white shadow-xs leading-none">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </div>

              <span className="text-[10px] truncate max-w-full leading-tight font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Composer Modal with top-falling animation */}
      <MobileComposerModal
        isOpen={isMobileComposerOpen}
        onClose={() => setMobileComposerOpen(false)}
      />
    </div>
  );
}
