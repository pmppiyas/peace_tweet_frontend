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

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </>
    );
  } else if (isError || !group) {
    content = (
      <Card className="p-8 text-center">
        <AlertCircle className="h-8 w-8 text-rose-600 mx-auto mb-2" />
        <p className="text-sm font-bold text-rose-800">
          {locale === 'bn' ? 'গ্রুপ পাওয়া যায়নি' : 'Group Not Found'}
        </p>
      </Card>
    );
  } else {
    content = (
      <>
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

        <GroupHeader group={group} />

        <GroupSettings group={group} />
      </>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a]">
      <Container size="xl" className="h-full px-0 sm:px-4">
        <div className="flex h-full justify-center gap-4 lg:gap-6">
          <Sidebar />

          <main className="w-full max-w-2xl min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-4 pb-20 sm:pb-8 space-y-4 px-2 sm:px-0">
            {content}
          </main>

          <RightSidebar />
        </div>
      </Container>
    </div>
  );
}
