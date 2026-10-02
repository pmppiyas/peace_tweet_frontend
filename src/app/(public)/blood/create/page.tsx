'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { BloodLayout, CreateBloodRequestForm } from '@/features/blood';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';

export default function CreateBloodRequestPage() {
  const { locale } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <BloodLayout>
      <CreateBloodRequestForm />
    </BloodLayout>
  );
}
