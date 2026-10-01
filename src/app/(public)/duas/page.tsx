import React from 'react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Feed } from '@/features/feed/components/Feed';

export const metadata = {
  title: 'Explore Duas & Feed | PeaceTweet',
  description: 'Authentic prophetic supplications and daily Islamic reminders.',
};

export default function DuasPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a]">
      <Container size="xl" className="h-full px-0 sm:px-4">
        <div className="flex h-full justify-center gap-4 lg:gap-6">
          <Sidebar />

          <main className="w-full max-w-2xl min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-4 pb-20 sm:pb-8 space-y-4 px-2 sm:px-0">
            <Feed />
          </main>

          <RightSidebar />
        </div>
      </Container>
    </div>
  );
}
