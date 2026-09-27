import React from 'react';
import { Metadata } from 'next';
import { FriendsLayout } from '@/features/friends/components/FriendsLayout';
import { FriendsHomeView } from '@/features/friends/components/FriendsHomeView';

export const metadata: Metadata = {
  title: 'Friends | PeaceTweet',
  description: 'Manage incoming friend requests, discover friends, and connect on PeaceTweet.',
};

export default function FriendsRoutePage() {
  return (
    <FriendsLayout>
      <FriendsHomeView />
    </FriendsLayout>
  );
}
