'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DuaFadilahProps {
  fadilah: string;
  className?: string;
  showIcon?: boolean;
}

export function DuaFadilah({ fadilah, className, showIcon = false }: DuaFadilahProps) {
  if (!fadilah) return null;

  return (
    <div className={cn('text-[15px] text-[#050505] dark:text-[#e4e6eb] leading-relaxed font-normal', className)}>
      {showIcon && (
        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold mr-1.5">
          <Sparkles className="h-3.5 w-3.5 inline" />
          ফজিলত:
        </span>
      )}
      {fadilah}
    </div>
  );
}
