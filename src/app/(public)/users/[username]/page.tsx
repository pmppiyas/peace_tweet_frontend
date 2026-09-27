import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PublicProfileView } from '@/features/profile/components/PublicProfileView';
import { ROUTES } from '@/constants/routes';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  return {
    title: `@${username} | PeaceTweet Profile`,
    description: `View @${username}'s public profile and connect on PeaceTweet.`,
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  return (
    <Container size="xl" className="py-4 sm:py-6">
      <div className="flex gap-6 justify-center">
        <Sidebar />

        <main className="w-full max-w-2xl min-w-0 space-y-4">
          <Breadcrumbs
            items={[
              { label: 'Home', href: ROUTES.HOME },
              { label: `@${username}` },
            ]}
          />
          <PublicProfileView username={username} />
        </main>

        <RightSidebar />
      </div>
    </Container>
  );
}
