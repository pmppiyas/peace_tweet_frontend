import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { MessagesLayout, MessagesSkeleton } from '@/features/chat';

export const metadata: Metadata = {
  title: 'Messages | PeaceTweet',
  description: 'Real-time peaceful messaging and conversations on PeaceTweet',
};

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesSkeleton />}>
      <MessagesLayout />
    </Suspense>
  );
}
