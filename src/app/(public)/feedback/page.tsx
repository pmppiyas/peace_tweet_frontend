import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { FeedbackPageView } from '@/features/feedback';

export const metadata: Metadata = {
  title: 'Feedback & Report',
  description:
    'Share your suggestions, feature requests, bug reports, or content concerns directly with the PeaceTweet team. Official contact: connect.peacetweet@gmail.com',
  openGraph: {
    title: 'Feedback & Report — PeaceTweet',
    description:
      'Help us shape and improve PeaceTweet. Submit feedback, bug reports, and suggestions directly to our core team.',
  },
};

export default function FeedbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#18191a] flex items-center justify-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      }
    >
      <FeedbackPageView />
    </Suspense>
  );
}
