'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          className="overflow-hidden border border-[#e4e6eb] bg-white shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] rounded-xl"
        >
          <CardHeader className="p-3.5 sm:p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>

          <CardContent className="p-3.5 sm:p-4 pt-1 space-y-3">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-5/6 rounded-md" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#e4e6eb] dark:border-[#393a3b]">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
