import React from 'react';
import type { Metadata } from 'next';
import { PointsView } from '@/features/points/components/PointsView';

export const metadata: Metadata = {
  title: 'Achievements — PeaceTweet',
  description:
    'Earn PeaceTweet community points by completing your profile, inviting friends, posting authentic Duas, and building community connections.',
  alternates: {
    canonical: '/points',
  },
};

export default function PointsPage() {
  return <PointsView />;
}
