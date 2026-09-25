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
      <Container size="lg" className="py-12 text-center text-sm text-gray-500">
        Verifying administrator permissions...
      </Container>
    );
  }

  return (
    <Container size="lg" className="py-8">
      <AdminDashboard />
    </Container>
  );
}
