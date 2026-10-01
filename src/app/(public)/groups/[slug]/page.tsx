'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { GroupHeader } from '@/features/groups/components/GroupHeader';
import { GroupFeed } from '@/features/groups/components/GroupFeed';
import { useGroup } from '@/features/groups/hooks/useGroup';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { AlertCircle, Users } from 'lucide-react';

export default function GroupDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || '';
  const { locale } = useLanguage();
  const { data: group, isLoading, isError } = useGroup(slug);

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <>
        <Skeleton className="h-4 w-40" />

        <Card className="overflow-hidden rounded-2xl border border-[#e4e6eb] bg-white shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
          <Skeleton className="h-32 sm:h-36 w-full" />
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-20 w-20 rounded-2xl -mt-12" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Card>

        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </>
    );
  } else if (isError || !group) {
    content = (
      <>
        <Breadcrumbs
          items={[
            {
              label: locale === 'bn' ? 'গ্রুপসমূহ' : 'Groups',
              href: ROUTES.GROUPS.HOME,
            },
            { label: locale === 'bn' ? 'পাওয়া যায়নি' : 'Not Found' },
          ]}
        />

        <Card className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/60 dark:bg-rose-950/20">
          <AlertCircle className="h-10 w-10 text-rose-600 dark:text-rose-400 mb-2" />
          <h2 className="text-base font-bold text-rose-800 dark:text-rose-300">
            {locale === 'bn'
              ? 'গ্রুপটি খুঁজে পাওয়া যায়নি'
              : 'Group Not Found'}
          </h2>
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 max-w-sm">
            {locale === 'bn'
              ? 'গ্রুপটি ডিলিট করা হতে পারে অথবা এর ঠিকানা পরিবর্তিত হয়েছে।'
              : 'The group might have been deleted or the URL is incorrect.'}
          </p>

          <Link href={ROUTES.GROUPS.HOME} className="mt-4">
            <Button
              size="sm"
              className="rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold"
            >
              <Users className="h-4 w-4 mr-1.5" />
              {locale === 'bn' ? 'সকল গ্রুপ দেখুন' : 'Explore Groups'}
            </Button>
          </Link>
        </Card>
      </>
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
            { label: group.name },
          ]}
        />

        <GroupHeader group={group} />

        <GroupFeed group={group} />
      </>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a]">
      <Container size="xl" className="h-full px-0 sm:px-4">
        <div className="flex h-full justify-center gap-4 lg:gap-6">
          <Sidebar />

          <main className="w-full max-w-2xl min-w-0 h-full overflow-y-auto overscroll-contain py-4 pb-20 sm:pb-8 space-y-4 px-2 sm:px-0">
            {content}
          </main>

          <RightSidebar />
        </div>
      </Container>
    </div>
  );
}
