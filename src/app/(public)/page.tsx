import React from 'react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { StoryBar } from '@/features/feed/components/StoryBar';
import { CreatePostBox } from '@/features/feed/components/CreatePostBox';
import { Feed } from '@/features/feed/components/Feed';

export default function HomePage() {
  return (
    <Container size="xl" className="py-4 sm:py-6">
      <div className="flex gap-6 justify-center">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Main Feed Column */}
        <main className="w-full max-w-2xl min-w-0 space-y-4">
          {/* Quick Stories / Topic Circles */}
          <StoryBar />

          {/* Social Duas & Feed Stream */}
          <Feed />
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </Container>
  );
}
