import React, { Suspense } from 'react';
import { ProfilePageContent } from '@/features/profile/components/ProfilePageContent';

export const metadata = {
  title: 'My Profile | PeaceTweet',
  description: 'User profile, friends, groups, and saved items',
};

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary-500/30 border-t-primary-500" />
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
