'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';

interface NotificationSkeletonProps {
  count?: number;
  variant?: 'page' | 'dropdown';
  className?: string;
}

export function NotificationSkeleton({
  count = 6,
  variant = 'page',
  className,
}: NotificationSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'dropdown') {
    return (
      <div className={cn('space-y-1 p-2', className)}>
        {items.map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2.5 rounded-xl select-none"
          >
            {/* Avatar with Badged Icon */}
            <div className="relative shrink-0">
              <Skeleton className="h-11 w-11 rounded-full" />
              <Skeleton className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full ring-2 ring-white dark:ring-[#242526]" />
            </div>

            {/* Content lines */}
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton
                className={cn(
                  'h-3.5 rounded-md',
                  i % 3 === 0 ? 'w-4/5' : i % 3 === 1 ? 'w-3/4' : 'w-2/3'
                )}
              />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>

            {/* Unread indicator placeholder */}
            {i % 2 === 0 && (
              <Skeleton className="h-2 w-2 rounded-full shrink-0" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-0.5', className)}>
      {items.map((i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 px-2 py-2 rounded-xl select-none"
        >
          {/* Avatar with Badged Icon */}
          <div className="relative shrink-0">
            <Skeleton className="h-11 w-11 rounded-full" />
            <Skeleton className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full ring-2 ring-white dark:ring-[#242526]" />
          </div>

          {/* Content lines */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <Skeleton
              className={cn(
                'h-3.5 rounded-md',
                i % 3 === 0 ? 'w-3/4' : i % 3 === 1 ? 'w-5/6' : 'w-2/3'
              )}
            />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>

          {/* Right Status Dot Placeholder */}
          <div className="flex items-center gap-2 shrink-0">
            {i % 2 === 0 && (
              <Skeleton className="h-2 w-2 rounded-full" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
