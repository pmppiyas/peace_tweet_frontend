import React, { Suspense } from 'react';
import { SavedLayout } from '@/features/bookmark/components/SavedLayout';
import { BookmarkList } from '@/features/bookmark/components/BookmarkList';

export const metadata = {
  title: 'Saved Bookmarks',
  description: 'Your collection of saved Duas and supplications.',
};

export default function SavedDuasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary-500/30 border-t-primary-500" />
        </div>
      }
    >
      <SavedLayout>
        <BookmarkList />
      </SavedLayout>
    </Suspense>
  );
}
