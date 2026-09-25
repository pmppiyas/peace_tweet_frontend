import React from 'react';
import { Container } from '@/components/layout/Container';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata = {
  title: 'লগইন',
  description: 'ইসলামিক দোয়া অ্যাপে লগইন করুন',
};

export default function LoginPage() {
  return (
    <Container size="sm" className="py-12 sm:py-20 flex justify-center items-center">
      <LoginForm />
    </Container>
  );
}
