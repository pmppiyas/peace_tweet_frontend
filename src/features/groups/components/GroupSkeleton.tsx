'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function GroupCardSkeleton() {
  return (
    <Card className="rounded-2xl border border-[#e4e6eb] bg-white p-4 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />

      <div className="flex items-center justify-between pt-2 border-t border-[#f0f2f5] dark:border-[#3a3b3c]">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </Card>
  );
}

export function GroupGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {Array.from({ length: count }).map((_, i) => (
        <GroupCardSkeleton key={i} />
      ))}
    </div>
  );
}
