'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { CreateGroupForm } from '@/features/groups/components/CreateGroupForm';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';

export default function CreateGroupPage() {
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
    <Container size="xl" className="py-4 sm:py-6">
      <div className="flex gap-6 justify-center">
        <Sidebar />

        <main className="w-full max-w-2xl min-w-0 space-y-4">
          <Breadcrumbs
            items={[
              {
                label: locale === 'bn' ? 'গ্রুপসমূহ' : 'Groups',
                href: ROUTES.GROUPS.HOME,
              },
              {
                label: locale === 'bn' ? 'নতুন গ্রুপ' : 'Create Group',
              },
            ]}
          />

          <CreateGroupForm />
        </main>

        <RightSidebar />
      </div>
    </Container>
  );
}
