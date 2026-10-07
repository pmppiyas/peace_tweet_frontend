import React from 'react';
import { LoginView } from '@/features/auth/components/LoginView';

export const metadata = {
  title: 'লগইন — PeaceTweet',
  description: 'PeaceTweet-এ লগইন করুন',
};

export default function LoginPage() {
  return <LoginView />;
}
