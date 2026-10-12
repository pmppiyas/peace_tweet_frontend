'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DuaFadilahProps {
  fadilah: string;
  className?: string;
  showIcon?: boolean;
}

export function DuaFadilah({ fadilah, className }: DuaFadilahProps) {
  if (!fadilah) return null;

  return (
    <div className={cn('text-xs text-[#65676b] dark:text-[#b0b3b8] pt-1 leading-relaxed', className)}>
      <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
        Benefit:{' '}
      </span>
      {fadilah}
    </div>
  );
}
