'use client';

import React, { useState } from 'react';
import { ArabicText } from '@/components/common/ArabicText';
import { ChevronDown, Languages } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DuaArabicProps {
  arabicText?: string | null;
  defaultExpanded?: boolean;
  collapsible?: boolean;
  className?: string;
}

export function DuaArabic({
  arabicText,
  defaultExpanded = false,
  collapsible = true,
  className,
}: DuaArabicProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!arabicText) return null;

  if (!collapsible) {
    return (
      <div
        dir="rtl"
        className={cn(
          'rounded-xl bg-[#f0f2f5] p-3.5 sm:p-4 dark:bg-[#3a3b3c] border border-[#e4e6eb] dark:border-[#393a3b] text-right',
          className,
        )}
      >
        <ArabicText text={arabicText} />
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-[#e4e6eb] bg-[#f0f2f5]/50 dark:border-[#393a3b] dark:bg-[#3a3b3c]/30 overflow-hidden', className)}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-3.5 py-2 text-xs font-semibold text-[#050505] hover:text-emerald-700 dark:text-[#e4e6eb] dark:hover:text-emerald-400 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <Languages className="h-3.5 w-3.5 text-[#65676b] dark:text-[#b0b3b8]" />
          <span>{isExpanded ? 'আরবি লুকান' : 'আরবি টেক্সট দেখুন (Arabic Text)'}</span>
        </div>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-[#65676b] dark:text-[#b0b3b8] transition-transform duration-200',
            isExpanded && 'rotate-180 text-emerald-600',
          )}
        />
      </button>

      {isExpanded && (
        <div
          dir="rtl"
          className="border-t border-[#e4e6eb] dark:border-[#393a3b] bg-[#f0f2f5] p-3.5 sm:p-4 dark:bg-[#3a3b3c] text-right animate-in fade-in duration-150"
        >
          <ArabicText text={arabicText} />
        </div>
      )}
    </div>
  );
}
