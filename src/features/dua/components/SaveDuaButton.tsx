'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SaveDuaButtonProps {
  isSaved: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  className?: string;
}

export function SaveDuaButton({
  isSaved,
  onToggle,
  isLoading = false,
  className,
}: SaveDuaButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      disabled={isLoading}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors',
        isSaved
          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
          : 'text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]',
        className,
      )}
      title={isSaved ? 'Saved' : 'Save Dua'}
    >
      <Bookmark
        className={cn('h-4 w-4', isSaved ? 'fill-current text-amber-600' : 'text-[#65676b] dark:text-[#b0b3b8]')}
      />
      <span>{isSaved ? 'সংরক্ষিত' : 'সংরক্ষণ'}</span>
    </button>
  );
}
