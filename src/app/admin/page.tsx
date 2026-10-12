'use client';

import React from 'react';
import { Container } from '@/components/layout/Container';
import { AdminDashboard } from '@/features/admin/components/AdminDashboard';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default function AdminPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push(ROUTES.HOME);
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading || !isAdmin) {
    return (
      <Container size="2xl" className="py-12 text-center text-sm text-gray-500 max-w-7xl 2xl:max-w-[1600px]">
        Verifying administrator permissions...
      </Container>
    );
  }

  return (
    <Container size="2xl" className="py-8 px-4 sm:px-6 lg:px-8 2xl:px-10 max-w-7xl 2xl:max-w-[1600px]">
      <AdminDashboard />
    </Container>
  );
}
