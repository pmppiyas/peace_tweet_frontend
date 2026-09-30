import React from 'react';
import { SavedLayout } from '@/features/bookmark/components/SavedLayout';
import { BookmarkList } from '@/features/bookmark/components/BookmarkList';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Bookmark } from 'lucide-react';

export const metadata = {
  title: 'Saved Bookmarks | PeaceTweet',
  description: 'Your collection of saved Duas and supplications.',
};

export default function SavedDuasPage() {
  return (
    <SavedLayout>
      <div className="space-y-4">
        <Breadcrumbs items={[{ label: 'Saved Bookmarks' }]} />

        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-[#e4e6eb] shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 text-white font-bold shadow-2xs select-none">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
                Your Saved Bookmarks
              </h1>
              <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                Duas and supplications you have saved for quick access and daily reflection.
              </p>
            </div>
          </div>
        </div>

        <BookmarkList />
      </div>
    </SavedLayout>
  );
}
