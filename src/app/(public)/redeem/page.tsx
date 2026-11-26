import React from 'react';
import type { Metadata } from 'next';
import { RedeemView } from '@/features/points/components/RedeemView';

export const metadata: Metadata = {
  title: 'Redeem Rewards — PeaceTweet',
  description:
    'Redeem PeaceTweet points to unlock the Green Verified Badge and community recognition.',
  alternates: {
    canonical: '/redeem',
  },
};

export default function RedeemPage() {
  return <RedeemView />;
}
