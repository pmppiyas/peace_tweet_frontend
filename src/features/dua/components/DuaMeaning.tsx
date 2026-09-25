'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface DuaMeaningProps {
  meaningBangla?: string | null;
  duaBangla?: string | null;
  transliteration?: string | null;
  className?: string;
}

export function DuaMeaning({
  meaningBangla,
  duaBangla,
  transliteration,
  className,
}: DuaMeaningProps) {
  const primaryText = meaningBangla || duaBangla;
  if (!primaryText) return null;

  return (
    <div className={cn('space-y-2 rounded-xl bg-[#f0f2f5]/70 p-3.5 dark:bg-[#3a3b3c]/60 border border-[#e4e6eb] dark:border-[#393a3b]', className)}>
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          দোয়ার অর্থ ও উচ্চারণ
        </span>
        <p className="text-[14px] font-medium text-[#050505] dark:text-[#e4e6eb] leading-relaxed" lang="bn">
          {primaryText}
        </p>
      </div>

      {transliteration && (
        <div className="pt-1.5 border-t border-[#e4e6eb]/60 dark:border-[#393a3b]/60">
          <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] italic">
            <span className="font-semibold text-[#050505] dark:text-[#e4e6eb] not-italic">উচ্চারণ: </span>
            {transliteration}
          </p>
        </div>
      )}
    </div>
  );
}
