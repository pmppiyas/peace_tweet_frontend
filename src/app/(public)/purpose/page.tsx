import React from 'react';
import type { Metadata } from 'next';
import { PurposeView } from '@/features/purpose/components/PurposeView';

export const metadata: Metadata = {
  title: 'আমাদের উদ্দেশ্য ও নীতিমালা — PeaceTweet',
  description:
    'PeaceTweet তৈরির উদ্দেশ্য, নিরাপদ চোখের যিনামুক্ত সোশ্যাল স্পেস, কনটেন্ট সোর্সিং এবং ক্রিয়েটর ওনারশিপ পলিসি।',
  alternates: {
    canonical: '/purpose',
  },
};

export default function PurposePage() {
  return <PurposeView />;
}
