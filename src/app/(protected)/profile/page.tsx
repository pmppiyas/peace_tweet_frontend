import React from 'react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { ProfileView } from '@/features/profile/components/ProfileView';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

export const metadata = {
  title: 'My Profile | PeaceTweet',
  description: 'User profile and account information',
};

export default function ProfilePage() {
  return (
    <Container size="xl" className="py-4 sm:py-6">
      <div className="flex gap-6 justify-center">
        <Sidebar />

        <main className="w-full max-w-2xl min-w-0 space-y-4">
          <Breadcrumbs items={[{ label: 'My Profile' }]} />
          <ProfileView />
        </main>

        <RightSidebar />
      </div>
    </Container>
  );
}
