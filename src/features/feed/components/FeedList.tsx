'use client';

import React from 'react';
import { Dua } from '@/types/dua.types';
import { FeedItem } from './FeedItem';
import { BookOpen } from 'lucide-react';

export interface FeedListProps {
  duas: Dua[];
  emptyMessage?: string;
}

export function FeedList({
  duas,
  emptyMessage = 'No Duas found in this feed.',
}: FeedListProps) {
  if (!duas || duas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 p-12 text-center dark:border-gray-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {emptyMessage}
        </h3>
        <p className="mt-1 text-xs text-gray-400">
          Try adjusting your search terms or exploring other categories.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {duas.map((dua) => (
        <FeedItem key={dua.id} dua={dua} />
      ))}
    </div>
  );
}
