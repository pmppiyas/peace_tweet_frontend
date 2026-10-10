'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon, ArrowLeft } from 'lucide-react';
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
  backHref?: string;
  onBack?: () => void;
  items: SidebarNavItem[];
  showUserProfile?: boolean;
  extraHeader?: React.ReactNode;
  footer?: React.ReactNode;
  activeId?: string;
  className?: string;
}

export function SectionSidebar({
  title,
  headerAction,
  backHref,
  onBack,
  items,
  extraHeader,
  footer,
  activeId,
  className,
}: SectionSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden lg:block w-60 xl:w-64 shrink-0 space-y-2 h-full overflow-y-auto overscroll-contain py-4 pr-2 select-none',
        className
      )}
    >
      {/* 1. Optional Title / Header Action with Back Button */}
      {(title || headerAction || backHref || onBack) && (
        <div className="flex items-center justify-between px-2 pb-1.5 pt-0.5">
          <div className="flex items-center gap-2 min-w-0">
            {backHref ? (
              <Link
                href={backHref}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
                title="Back"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </Link>
            ) : onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
                title="Back"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
            ) : null}
            {typeof title === 'string' ? (
              <h2 className="text-xl font-bold tracking-tight text-[#050505] dark:text-white truncate">
                {title}
              </h2>
            ) : (
              title
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* 2. Optional Extra Header (e.g. Back button or category pills) */}
      {extraHeader}

      {/* 4. Navigation Menu Items */}
      <nav className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId
            ? item.id === activeId
            : item.exact
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
                  ? 'bg-[#e4e6eb] dark:bg-[#3a3b3c] font-bold text-primary-700 dark:text-primary-400'
                  : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-[#e4e6eb]/80 dark:hover:bg-[#3a3b3c] font-semibold text-[15px]'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-xs',
                    item.iconBg ||
                      (isActive
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-600 text-white')
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
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-bold text-primary-600 dark:bg-primary-900/60 dark:text-primary-300 shrink-0 ml-2">
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
