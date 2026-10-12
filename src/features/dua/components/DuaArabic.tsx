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
        className={cn('text-right py-2', className)}
      >
        <ArabicText text={arabicText} />
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 py-1 transition-colors cursor-pointer"
      >
        <Languages className="h-3.5 w-3.5" />
        <span>{isExpanded ? 'আরবি লুকান' : 'আরবি টেক্সট দেখুন (Arabic Text)'}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            isExpanded && 'rotate-180',
          )}
        />
      </button>

      {isExpanded && (
        <div
          dir="rtl"
          className="text-right py-2 animate-in fade-in duration-150"
        >
          <ArabicText text={arabicText} />
        </div>
      )}
    </div>
  );
}
