'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Layers, Bookmark, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';

export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { label: t('nav.home'), href: ROUTES.HOME, icon: Home },
    { label: t('nav.duas'), href: ROUTES.DUAS, icon: Compass },
    { label: t('nav.categories'), href: ROUTES.CATEGORIES, icon: Layers },
    {
      label: t('nav.bookmarks'),
      href: isAuthenticated ? ROUTES.SAVED : ROUTES.LOGIN,
      icon: Bookmark,
    },
    {
      label: t('nav.profile'),
      href: isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN,
      icon: UserIcon,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-40 w-full border-t border-[#e4e6eb] bg-white/95 backdrop-blur-md dark:border-[#393a3b] dark:bg-[#242526]/95 pb-safe">
      <nav className="grid grid-cols-5 h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 transition-colors select-none',
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-[#65676b] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:text-[#e4e6eb]',
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'stroke-[2.3]')} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
