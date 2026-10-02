import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicProfileView } from '@/features/profile/components/PublicProfileView';

const RESERVED_ROUTES = new Set([
  'categories',
  'duas',
  'friends',
  'groups',
  'search',
  'users',
  'profile',
  'saved',
  'settings',
  'login',
  'register',
  'admin',
  'auth',
  'api',
  'favicon.ico',
  'icon.svg',
  'apple-icon.svg',
  'robots.txt',
  'sitemap.xml',
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  if (RESERVED_ROUTES.has(username.toLowerCase())) {
    return {
      title: 'PeaceTweet',
    };
  }

  return {
    title: `@${username} | PeaceTweet Profile`,
    description: `View @${username}'s profile on PeaceTweet.`,
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  if (RESERVED_ROUTES.has(username.toLowerCase())) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary-500/30 border-t-primary-500" />
        </div>
      }
    >
      <PublicProfileView username={username} />
    </Suspense>
  );
}
