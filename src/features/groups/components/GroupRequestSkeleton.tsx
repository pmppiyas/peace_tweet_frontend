'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function GroupRequestSkeleton() {
  return (
    <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#e4e6eb] bg-white p-3.5 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Skeleton className="h-8 w-20 rounded-xl" />
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>
    </Card>
  );
}

export function GroupRequestListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <GroupRequestSkeleton key={i} />
      ))}
    </div>
  );
}
