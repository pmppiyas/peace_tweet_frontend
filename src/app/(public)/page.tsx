import React from 'react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Feed } from '@/features/feed/components/Feed';

export default function HomePage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-white dark:bg-[#18191a] sm:bg-[#f0f2f5]">
      <Container size="2xl" className="h-full px-0 sm:px-0 md:px-0 lg:px-6 2xl:px-8">
        <div className="flex h-full justify-between gap-0 lg:gap-6 2xl:gap-8">
          <Sidebar />

          <main className="flex-1 w-full min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none pt-0 sm:pt-4 pb-[68px] sm:pb-8 px-0">
            <Feed />
          </main>
          <RightSidebar />
        </div>
      </Container>
    </div>
  );
}
