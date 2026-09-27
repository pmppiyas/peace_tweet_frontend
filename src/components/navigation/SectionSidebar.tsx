'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';

export interface SidebarNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  iconBg?: string;
  exact?: boolean;
  count?: number;
  badge?: string;
  onClick?: () => void;
}

export interface SectionSidebarProps {
  title?: string | React.ReactNode;
  headerAction?: React.ReactNode;
  items: SidebarNavItem[];
  showUserProfile?: boolean;
  extraHeader?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function SectionSidebar({
  title,
  headerAction,
  items,
  showUserProfile = true,
  extraHeader,
  footer,
  className,
}: SectionSidebarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  return (
    <aside
      className={cn(
        'hidden lg:block w-60 shrink-0 space-y-2 sticky top-20 h-[calc(100vh-5.5rem)] overflow-y-auto pr-2 select-none',
        className,
      )}
    >
      {/* 1. Optional Title / Header Action */}
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-2.5 pb-1">
          {typeof title === 'string' ? (
            <h2 className="text-lg font-black tracking-tight text-[#050505] dark:text-white">
              {title}
            </h2>
          ) : (
            title
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {/* 2. Optional Extra Header (e.g. Back button or category pills) */}
      {extraHeader}

      {/* 3. User Short Profile Row */}
      {showUserProfile && isAuthenticated && user && (
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

      {/* 4. Navigation Menu Items */}
      <nav className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={item.onClick}
              className={cn(
                'flex items-center justify-between rounded-xl px-2.5 py-2 transition-colors',
                isActive
                  ? 'bg-[#e4e6eb] dark:bg-[#3a3b3c] font-bold text-emerald-800 dark:text-emerald-400'
                  : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-[#e4e6eb]/80 dark:hover:bg-[#3a3b3c] font-semibold text-[15px]',
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-xs',
                    item.iconBg || (isActive ? 'bg-emerald-600 text-white' : 'bg-gray-600 text-white'),
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="truncate">{item.label}</span>
              </div>

              {typeof item.count === 'number' && item.count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white shrink-0 ml-2">
                  {item.count}
                </span>
              )}
              {item.badge && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shrink-0 ml-2">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 5. Optional Footer */}
      {footer && (
        <>
          <hr className="border-[#e4e6eb] dark:border-[#393a3b] my-2" />
          {footer}
        </>
      )}
    </aside>
  );
}
