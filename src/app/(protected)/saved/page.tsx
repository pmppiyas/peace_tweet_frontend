import React from 'react';
import { SavedLayout } from '@/features/bookmark/components/SavedLayout';
import { BookmarkList } from '@/features/bookmark/components/BookmarkList';

export const metadata = {
  title: 'Saved Bookmarks',
  description: 'Your collection of saved Duas and supplications.',
};

export default function SavedDuasPage() {
  return (
    <SavedLayout>
      <BookmarkList />
    </SavedLayout>
  );
}
