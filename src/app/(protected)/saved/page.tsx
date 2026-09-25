import React from 'react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { BookmarkList } from '@/features/bookmark/components/BookmarkList';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

export const metadata = {
  title: 'Saved Bookmarks | PeaceTweet',
  description: 'Your collection of saved Duas and supplications.',
};

export default function SavedDuasPage() {
  return (
    <Container size="xl" className="py-4 sm:py-6">
      <div className="flex gap-6 justify-center">
        <Sidebar />

        <main className="w-full max-w-2xl min-w-0 space-y-4">
          <Breadcrumbs items={[{ label: 'Saved Bookmarks' }]} />

          <div className="rounded-xl bg-white p-4 border border-[#e4e6eb] shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
            <h1 className="text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
              Your Saved Bookmarks
            </h1>
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
              Duas and supplications you have saved for easy daily access
            </p>
          </div>

          <BookmarkList />
        </main>

        <RightSidebar />
      </div>
    </Container>
  );
}
