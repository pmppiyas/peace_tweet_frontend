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
    <div className={cn('space-y-3.5 sm:space-y-4', className)}>
      {pronunciation && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 block">
            Pronunciation:
          </span>
          <p className="text-[14.5px] sm:text-[15.5px] font-normal sm:font-medium text-[#050505] dark:text-[#e4e6eb] leading-relaxed sm:leading-[1.75] select-text">
            {pronunciation}
          </p>
        </div>
      )}

      {resolvedMeaning && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 block">
            Meaning:
          </span>
          <p className="text-[14.5px] sm:text-[15.5px] font-normal sm:font-medium text-[#050505] dark:text-[#e4e6eb] leading-relaxed sm:leading-[1.75] select-text">
            {resolvedMeaning}
          </p>
        </div>
      )}
    </div>
  );
}
