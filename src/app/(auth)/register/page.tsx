import React from 'react';
import { RegisterView } from '@/features/auth/components/RegisterView';

export const metadata = {
  title: 'Sign Up',
  description: 'Create an account on PeaceTweet to connect with a peaceful, authentic Islamic community.',
};

export default function RegisterPage() {
  return <RegisterView />;
}
