import React from 'react';
import { SavedLayout } from '@/features/bookmark/components/SavedLayout';
import { BookmarkList } from '@/features/bookmark/components/BookmarkList';

export const metadata = {
  title: 'Saved Bookmarks | PeaceTweet',
  description: 'Your collection of saved Duas and supplications.',
};

export default function SavedDuasPage() {
  return (
    <SavedLayout>
      <div className="space-y-4">
        <BookmarkList />
      </div>
    </SavedLayout>
  );
}
