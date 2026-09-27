'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { GroupHeader } from '@/features/groups/components/GroupHeader';
import { GroupSettings } from '@/features/groups/components/GroupSettings';
import { useGroup } from '@/features/groups/hooks/useGroup';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { AlertCircle } from 'lucide-react';

export default function GroupSettingsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || '';
  const { locale } = useLanguage();
  const { data: group, isLoading, isError } = useGroup(slug);

  if (isLoading) {
    return (
      <Container size="xl" className="py-4 sm:py-6">
        <div className="flex gap-6 justify-center">
          <Sidebar />
          <main className="w-full max-w-2xl min-w-0 space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </main>
          <RightSidebar />
        </div>
      </Container>
    );
  }

  if (isError || !group) {
    return (
      <Container size="xl" className="py-4 sm:py-6">
        <div className="flex gap-6 justify-center">
          <Sidebar />
          <main className="w-full max-w-2xl min-w-0 space-y-4">
            <Card className="p-8 text-center">
              <AlertCircle className="h-8 w-8 text-rose-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-rose-800">
                {locale === 'bn' ? 'গ্রুপ পাওয়া যায়নি' : 'Group Not Found'}
              </p>
            </Card>
          </main>
          <RightSidebar />
        </div>
      </Container>
    );
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
                label: group.name,
                href: ROUTES.GROUPS.DETAIL(group.slug),
              },
              { label: locale === 'bn' ? 'সেটিংস' : 'Settings' },
            ]}
          />

          {/* Group Header & Tabs */}
          <GroupHeader group={group} />

          {/* Group Settings Form & Actions */}
          <GroupSettings group={group} />
        </main>

        <RightSidebar />
      </div>
    </Container>
  );
}
