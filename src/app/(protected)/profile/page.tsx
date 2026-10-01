import React from 'react';
import { ProfileLayout } from '@/features/profile/components/ProfileLayout';
import { ProfileView } from '@/features/profile/components/ProfileView';

export const metadata = {
  title: 'My Profile | PeaceTweet',
  description: 'User profile and account information',
};

export default function ProfilePage() {
  return (
    <ProfileLayout activeId="profile-overview">
      <ProfileView />
    </ProfileLayout>
  );
}
