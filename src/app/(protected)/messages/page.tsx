import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { MessagesLayout, MessagesSkeleton } from '@/features/chat';

export const metadata: Metadata = {
  title: 'Messages',
  description: 'Real-time peaceful messaging on PeaceTweet',
};

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesSkeleton />}>
      <MessagesLayout />
    </Suspense>
  );
}
