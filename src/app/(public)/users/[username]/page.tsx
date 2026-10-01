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
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a]">
      <Container size="xl" className="h-full px-0 sm:px-4">
        <div className="flex h-full justify-center gap-4 lg:gap-6">
          <Sidebar />

          <main className="w-full max-w-2xl min-w-0 h-full overflow-y-auto overscroll-contain py-4 pb-20 sm:pb-8 space-y-4 px-2 sm:px-0">
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
    </div>
  );
}
