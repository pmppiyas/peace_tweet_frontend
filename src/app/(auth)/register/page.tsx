import React from 'react';
import { RegisterView } from '@/features/auth/components/RegisterView';

export const metadata = {
  title: 'রেজিস্ট্রেশন — PeaceTweet',
  description: 'PeaceTweet-এ নতুন অ্যাকাউন্ট খুলুন',
};

export default function RegisterPage() {
  return <RegisterView />;
}
