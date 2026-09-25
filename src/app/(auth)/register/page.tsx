import React from 'react';
import { Container } from '@/components/layout/Container';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const metadata = {
  title: 'রেজিস্ট্রেশন',
  description: 'ইসলামিক দোয়া অ্যাপে নতুন একাউন্ট খুলুন',
};

export default function RegisterPage() {
  return (
    <Container size="sm" className="py-12 sm:py-16 flex justify-center items-center">
      <RegisterForm />
    </Container>
  );
}
