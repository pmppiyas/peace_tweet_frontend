'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { CreateGroupForm } from '@/features/groups/components/CreateGroupForm';
import { GroupsLayout } from '@/features/groups/components/GroupsLayout';
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
    <GroupsLayout>
      <div className="space-y-4 max-w-2xl mx-auto">
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
      </div>
    </GroupsLayout>
  );
}
