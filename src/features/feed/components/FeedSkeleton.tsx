'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function FeedSkeleton() {
  return (
    <div className="w-full">
      {[1, 2, 3].map((i) => (
        <React.Fragment key={i}>
          {i > 1 && (
            <hr className="border-0 border-t border-[#e4e6eb] dark:border-[#393a3b]" />
          )}
          <div className="w-full bg-white dark:bg-[#242526] px-2 py-3 sm:px-3">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <div className="pt-1 space-y-3">
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <div className="space-y-1.5 pt-1">
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-5/6 rounded-md" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
