'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export interface ChatAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  isOnline?: boolean;
}

const SIZE_MAP: Record<string, string> = {
  xs: 'h-7 w-7 text-xs',
  sm: 'h-9 w-9 text-xs',
  md: 'h-10 w-10 sm:h-11 sm:w-11 text-sm',
  lg: 'h-12 w-12 text-sm sm:text-base',
  xl: 'h-20 w-20 text-2xl',
  custom: '',
};

const DOT_SIZE_MAP: Record<string, string> = {
  xs: 'h-2 w-2',
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
  lg: 'h-3.5 w-3.5',
  xl: 'h-4.5 w-4.5',
  custom: 'h-3 w-3',
};

export function ChatAvatar({
  src,
  name,
  size = 'md',
  className,
  isOnline = false,
}: ChatAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state if image src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const cleanName = (name || '').trim();
  const firstLetter = cleanName ? cleanName.charAt(0).toUpperCase() : 'U';
  const hasValidImage = Boolean(src && src.trim() && !hasError);

  return (
    <div className={cn('relative shrink-0 select-none', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-bold text-white bg-primary-500 shadow-xs relative',
          SIZE_MAP[size],
        )}
      >
        {hasValidImage ? (
          <Image
            src={src!}
            alt={cleanName || 'Avatar'}
            fill
            className="object-cover"
            unoptimized
            onError={() => setHasError(true)}
          />
        ) : (
          <span className="font-bold uppercase tracking-wider">{firstLetter}</span>
        )}
      </div>

      {isOnline && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full bg-emerald-500 border-2 border-white dark:border-[#242526] shadow-xs',
            DOT_SIZE_MAP[size],
          )}
        />
      )}
    </div>
  );
}
