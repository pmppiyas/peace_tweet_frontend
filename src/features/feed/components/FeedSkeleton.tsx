import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function FeedSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden border border-emerald-100/60 dark:border-gray-800">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <Skeleton className="h-8 w-8 rounded-xl" />
              </div>
            </div>
            <Skeleton className="h-6 w-3/4 rounded-lg" />
          </CardHeader>

          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-8 w-28 rounded-xl" />
              <Skeleton className="h-5 w-32 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
