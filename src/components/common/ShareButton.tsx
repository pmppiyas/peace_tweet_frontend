'use client';

import React, { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'ghost' | 'outline' | 'default';
  showLabel?: boolean;
  label?: string;
}

export function ShareButton({
  title,
  text,
  url,
  className,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label = 'Share',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url: shareUrl,
        });
      } catch (err) {
        console.warn('Share cancelled or failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy share link:', err);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-xl transition-all duration-200 hover:bg-emerald-50 hover:text-brand-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300',
        size === 'sm' ? 'py-1.5 px-2 text-xs' : 'py-2 px-3 text-sm',
        copied
          ? 'text-brand-600 dark:text-brand-400 font-bold'
          : 'text-gray-500 dark:text-gray-400',
        variant === 'ghost' && 'hover:bg-emerald-50/60 dark:hover:bg-gray-800',
        className,
      )}
      title={copied ? 'Link copied!' : 'Share Dua'}
    >
      {copied ? (
        <Check className={size === 'sm' ? 'h-4 w-4 text-brand-600' : 'h-5 w-5 text-brand-600'} />
      ) : (
        <Share2 className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      )}
      {showLabel && <span>{copied ? 'Copied' : label}</span>}
    </button>
  );
}
