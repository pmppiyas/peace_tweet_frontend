'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DuaFadilahProps {
  fadilah: string;
  className?: string;
  showIcon?: boolean;
  showLabel?: boolean;
}

export function DuaFadilah({
  fadilah,
  className,
  showLabel = true,
}: DuaFadilahProps) {
  if (!fadilah) return null;

  if (!showLabel) {
    return (
      <p
        className={cn(
          'text-[14.5px] sm:text-[15.5px] font-normal sm:font-medium text-[#050505] dark:text-[#e4e6eb] leading-relaxed sm:leading-[1.75] select-text',
          className
        )}
      >
        {fadilah}
      </p>
    );
  }

  return (
    <div
      className={cn(
        'text-xs text-[#65676b] dark:text-[#b0b3b8] pt-1 leading-relaxed',
        className
      )}
    >
      <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
        Benefit:{' '}
      </span>
      {fadilah}
    </div>
  );
}
