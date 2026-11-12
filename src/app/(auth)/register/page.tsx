import React from 'react';
import type { Metadata } from 'next';
import { RegisterView } from '@/features/auth/components/RegisterView';

export const metadata: Metadata = {
  title: 'Sign Up (নিবন্ধন)',
  description:
    'Create an account on PeaceTweet to connect with a peaceful, authentic Islamic community.',
  alternates: {
    canonical: '/register',
  },
};

export default function RegisterPage() {
  return <RegisterView />;
}
