'use client';

import React from 'react';
import { LucideIcon, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ProfileTabHeaderProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ProfileTabHeader({
  icon: Icon,
  iconColor = 'text-primary-600 dark:text-primary-400',
  title,
  description,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  action,
  className,
}: ProfileTabHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-2xs',
        className
      )}
    >
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-white flex items-center gap-2">
          <Icon className={cn('h-5 w-5 shrink-0', iconColor)} />
          <span>{title}</span>
        </h2>
        {description && (
          <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
            {description}
          </p>
        )}
      </div>

      {(onSearchChange !== undefined || action) && (
        <div className="flex items-center gap-2">
          {onSearchChange !== undefined && (
            <div className="relative sm:w-56 md:w-60 flex-1 sm:flex-initial">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#65676b] dark:text-[#b0b3b8]" />
              <input
                type="text"
                value={searchValue || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-xl border border-[#e4e6eb] bg-[#f0f2f5] pl-10 pr-8 text-xs placeholder:text-[#65676b] focus:border-primary-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:placeholder:text-[#b0b3b8]"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#65676b] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
    </div>
  );
}
