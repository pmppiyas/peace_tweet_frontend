import React from 'react';
import { LoginView } from '@/features/auth/components/LoginView';

export const metadata = {
  title: 'Log In',
  description: 'Log in to your PeaceTweet account to connect, share duas, and join the community.',
};

export default function LoginPage() {
  return <LoginView />;
}
