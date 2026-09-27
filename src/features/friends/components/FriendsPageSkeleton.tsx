'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function FriendCardSkeleton() {
  return (
    <Card className="flex flex-col justify-between overflow-hidden border border-[#e4e6eb] bg-white rounded-2xl dark:border-[#393a3b] dark:bg-[#242526]">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="p-3.5 sm:p-4 space-y-3">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
        <div className="space-y-2 pt-1">
          <Skeleton className="h-9 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>
    </Card>
  );
}

export function FriendRequestSkeleton() {
  return (
    <Card className="flex flex-col justify-between overflow-hidden border border-[#e4e6eb] bg-white rounded-2xl dark:border-[#393a3b] dark:bg-[#242526]">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="p-3.5 sm:p-4 space-y-3">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
        <div className="space-y-2 pt-1">
          <Skeleton className="h-9 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>
    </Card>
  );
}

export function FriendsPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-[#e4e6eb] pb-2 dark:border-[#393a3b]">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>

      <Skeleton className="h-10 w-full rounded-xl" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <FriendCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
