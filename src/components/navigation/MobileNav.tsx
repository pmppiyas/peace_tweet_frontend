'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Layers,
  Bookmark,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';

export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const navItems = [
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
    {
      id: 'nav-profile',
      label: isAuthenticated ? t('nav.profile') : t('nav.login'),
      href: isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN,
      icon: UserIcon,
    },
  ];

  const isMessagesPage = pathname === '/messages' || pathname.startsWith('/messages/');
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <div
      className={cn(
        'md:hidden fixed bottom-0 left-0 z-40 w-full border-t border-[#e4e6eb] bg-white/95 backdrop-blur-md dark:border-[#393a3b] dark:bg-[#242526]/95 pb-safe',
        (isMessagesPage || isAuthPage) && 'hidden',
      )}
    >
      <nav className="grid grid-cols-5 h-14 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === 'nav-bookmarks'
              ? pathname.startsWith(ROUTES.SAVED)
              : item.id === 'nav-profile'
                ? pathname.startsWith(ROUTES.PROFILE)
                : item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href) && item.href !== ROUTES.LOGIN;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 h-full w-full px-1 text-center transition-colors select-none overflow-hidden',
                isActive
                  ? 'text-primary-500 dark:text-primary-400 font-bold'
                  : 'text-[#65676b] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:text-[#e4e6eb]'
              )}
            >
              <Icon
                className={cn('h-5 w-5 shrink-0', isActive && 'stroke-[2.3]')}
              />
              <span className="text-[10px] truncate max-w-full leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
