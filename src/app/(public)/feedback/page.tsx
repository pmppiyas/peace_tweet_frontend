import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { FeedbackPageView } from '@/features/feedback';

export const metadata: Metadata = {
  title: 'পরামর্শ ও অভিযোগ | Feedback & Report - PeaceTweet',
  description:
    'PeaceTweet প্ল্যাটফর্মের পরামর্শ, ফিচার রিকোয়েস্ট, কারিগরি সমস্যা বা অভিযোগ সরাসরি আমাদের টিমকে জানান। অফিসিয়াল যোগাযোগ: connect.peacetweet@gmail.com',
  openGraph: {
    title: 'পরামর্শ ও অভিযোগ | Feedback & Report - PeaceTweet',
    description:
      'আপনার পরামর্শেই সমৃদ্ধ হবে PeaceTweet। ফিচার অনুরোধ, কারিগরি ত্রুটি বা অভিযোগ জানাতে ভিজিট করুন।',
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
