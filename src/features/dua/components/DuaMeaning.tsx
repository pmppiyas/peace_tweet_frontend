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
    <div className={cn('space-y-2.5 rounded-xl bg-[#f0f2f5]/70 p-3.5 dark:bg-[#3a3b3c]/60 border border-[#e4e6eb] dark:border-[#393a3b]', className)}>
      {pronunciation && (
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            উচ্চারণ
          </span>
          <p className="text-[15px] font-medium text-[#050505] dark:text-[#e4e6eb] leading-relaxed" lang="bn">
            {pronunciation}
          </p>
        </div>
      )}

      {resolvedMeaning && (
        <div className={cn('space-y-1', pronunciation && 'pt-2 border-t border-[#e4e6eb]/60 dark:border-[#393a3b]/60')}>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#65676b] dark:text-[#b0b3b8]">
            অর্থ
          </span>
          <p className="text-[14px] text-[#050505] dark:text-[#e4e6eb] leading-relaxed" lang="bn">
            {resolvedMeaning}
          </p>
        </div>
      )}
    </div>
  );
}
