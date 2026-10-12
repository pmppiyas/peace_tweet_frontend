'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface DuaMeaningProps {
  meaning?: string | null;
  meaningBangla?: string | null;
  transliteration?: string | null;
  duaBangla?: string | null;
  className?: string;
}

export function DuaMeaning({
  meaning,
  meaningBangla,
  transliteration,
  duaBangla,
  className,
}: DuaMeaningProps) {
  const resolvedMeaning = meaning || meaningBangla;
  const pronunciation = transliteration || duaBangla;
  if (!resolvedMeaning && !pronunciation) return null;

  return (
    <div className={cn('space-y-3', className)}>
      {pronunciation && (
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 block">
            Pronunciation:
          </span>
          <p className="text-sm sm:text-base font-medium text-[#050505] dark:text-[#e4e6eb] leading-relaxed select-text">
            {pronunciation}
          </p>
        </div>
      )}

      {resolvedMeaning && (
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 block">
            Meaning:
          </span>
          <p className="text-sm sm:text-base font-medium text-[#050505] dark:text-[#e4e6eb] leading-relaxed select-text">
            {resolvedMeaning}
          </p>
        </div>
      )}
    </div>
  );
}
