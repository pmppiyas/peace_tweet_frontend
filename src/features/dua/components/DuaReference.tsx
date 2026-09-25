'use client';

import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { DuaReference as DuaReferenceType } from '@/types/dua.types';
import { cn } from '@/lib/utils/cn';

interface DuaReferenceProps {
  references?: DuaReferenceType[];
  className?: string;
}

export function DuaReference({ references, className }: DuaReferenceProps) {
  if (!references || references.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2 pt-1', className)}>
      {references.map((ref) => (
        <div
          key={ref.id}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#e4e6eb] bg-white px-2.5 py-1 text-xs text-[#050505] shadow-2xs dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]"
        >
          <BookOpen className="h-3 w-3 text-[#65676b] dark:text-[#b0b3b8]" />
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
            {ref.source?.name || 'Hadith Collection'}
          </span>
          <span className="text-[#65676b] dark:text-[#b0b3b8]">|</span>
          <span className="font-medium">{ref.reference}</span>
          {ref.verified && (
            <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
          )}
        </div>
      ))}
    </div>
  );
}
