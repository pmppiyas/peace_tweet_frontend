import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'gold' | 'outline' | 'secondary' | 'gray';
}

export function Badge({
  className,
  variant = 'emerald',
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    emerald:
      'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
    gold:
      'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    outline:
      'border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300',
    secondary:
      'bg-brand-500 text-white border-transparent shadow-xs',
    gray:
      'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
