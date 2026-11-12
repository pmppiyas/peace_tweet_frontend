import React from 'react';
import type { Metadata } from 'next';
import { LoginView } from '@/features/auth/components/LoginView';

export const metadata: Metadata = {
  title: 'Sign In (লগইন)',
  description:
    'Log in to your PeaceTweet account to connect, share duas and reflections, and join the peaceful Islamic community.',
  alternates: {
    canonical: '/login',
  },
};

export default function LoginPage() {
  return <LoginView />;
}
