import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { TermsAndPrivacyView } from '@/features/legal/components/TermsAndPrivacyView';

export const metadata: Metadata = {
  title: 'Terms of Service & Privacy Policy | PeaceTweet',
  description:
    'ব্যবহারের শর্তাবলী ও গোপনীয়তা নীতি - PeaceTweet. আমাদের অশ্লীলতামুক্ত, শালীন ও নিরাপদ ইসলামিক সামাজিক যোগাযোগ প্ল্যাটফর্মের নীতিমালা।',
};

export default function TermsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#18191a] flex items-center justify-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      }
    >
      <TermsAndPrivacyView />
    </Suspense>
  );
}
