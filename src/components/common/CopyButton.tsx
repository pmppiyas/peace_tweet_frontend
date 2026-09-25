'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'ghost' | 'outline' | 'default';
  showLabel?: boolean;
  label?: string;
}

export function CopyButton({
  text,
  className,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label = 'Copy',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-xl transition-all duration-200 hover:bg-emerald-50 hover:text-brand-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300',
        size === 'sm' ? 'py-1.5 px-2 text-xs' : 'py-2 px-3 text-sm',
        copied
          ? 'text-brand-600 dark:text-brand-400 font-bold'
          : 'text-gray-500 dark:text-gray-400',
        variant === 'ghost' && 'hover:bg-emerald-50/60 dark:hover:bg-gray-800',
        className,
      )}
      title={copied ? 'Copied to clipboard!' : 'Copy text'}
    >
      {copied ? (
        <Check className={size === 'sm' ? 'h-4 w-4 text-brand-600' : 'h-5 w-5 text-brand-600'} />
      ) : (
        <Copy className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      )}
      {showLabel && <span>{copied ? 'Copied' : label}</span>}
    </button>
  );
}
