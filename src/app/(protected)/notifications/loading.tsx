import React from 'react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { NotificationSkeleton } from '@/features/notifications';
import { Skeleton } from '@/components/ui/Skeleton';

export default function NotificationsLoading() {
  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-white dark:bg-[#18191a] sm:bg-[#f0f2f5]">
      <Container size="2xl" className="h-full px-0 sm:px-4 lg:px-6 2xl:px-8">
        <div className="flex h-full justify-between gap-4 lg:gap-6 2xl:gap-8">
          <Sidebar />

          <main className="flex-1 w-full min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none pb-20 sm:pb-8 px-3 sm:px-0">
            <div className="w-full bg-white dark:bg-[#242526] sm:rounded-2xl sm:border sm:border-[#e4e6eb] sm:dark:border-[#393a3b] sm:shadow-2xs overflow-hidden sm:my-4">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-[#e4e6eb]/60 dark:border-[#393a3b]/60">
                <div className="space-y-1.5">
                  <Skeleton className="h-6 w-36 rounded-md" />
                  <Skeleton className="h-3.5 w-60 rounded-md" />
                </div>
              </div>

              {/* Filter Tabs Skeleton */}
              <div className="flex items-center gap-2 px-4 py-2.5 sm:px-6 border-b border-[#e4e6eb]/60 dark:border-[#393a3b]/60 bg-[#f7f8fa]/60 dark:bg-[#18191a]/40">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>

              {/* Notification Skeleton Items */}
              <NotificationSkeleton count={8} variant="page" />
            </div>
          </main>

          <RightSidebar />
        </div>
      </Container>
    </div>
  );
}
