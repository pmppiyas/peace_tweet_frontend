import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyles = {
      primary:
        'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm disabled:bg-brand-300 dark:bg-brand-600 dark:hover:bg-brand-500',
      secondary:
        'bg-emerald-100 text-brand-900 hover:bg-emerald-200 active:bg-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/80',
      outline:
        'border border-emerald-200 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-200 dark:hover:bg-emerald-950/50',
      ghost:
        'text-gray-700 hover:bg-emerald-50/70 hover:text-brand-700 dark:text-gray-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300',
      destructive:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm disabled:bg-red-300',
      gold:
        'bg-gradient-to-r from-amber-500 to-gold-600 text-white font-medium hover:from-amber-600 hover:to-gold-700 shadow-sm shadow-gold-500/20',
    };

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs rounded-lg',
      md: 'h-10 px-4 text-sm rounded-xl',
      lg: 'h-12 px-6 text-base rounded-2xl',
      icon: 'h-10 w-10 p-2 rounded-xl flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
