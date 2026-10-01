'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users2, Plus } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { useMyGroups } from '@/features/groups/hooks/useMyGroups';
import { GroupList } from '@/features/groups/components/GroupList';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { ProfileTabHeader } from './ProfileTabHeader';

export function ProfileGroupsTab() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { locale } = useLanguage();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useMyGroups({
    search: debouncedSearch || undefined,
    limit: 20,
  });

  const myGroups = data?.pages.flatMap((page) => page?.items || []) || [];

  return (
    <div className="space-y-4">
      <ProfileTabHeader
        icon={Users2}
        iconColor="text-teal-600 dark:text-teal-400"
        title={locale === 'bn' ? 'আমার গ্রুপসমূহ' : 'My Groups'}
        description={
          locale === 'bn'
            ? 'আপনার যুক্ত হওয়া ও তৈরি করা সকল গ্রুপ'
            : 'All groups you have joined or created'
        }
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={locale === 'bn' ? 'গ্রুপ খুঁজুন...' : 'Search my groups...'}
        action={
          <Link href={ROUTES.GROUPS.CREATE}>
            <Button size="sm" className="rounded-xl gap-1 text-xs font-bold whitespace-nowrap">
              <Plus className="h-3.5 w-3.5" />
              <span>{locale === 'bn' ? 'নতুন গ্রুপ' : 'Create'}</span>
            </Button>
          </Link>
        }
      />

      <GroupList
        groups={myGroups}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        emptyType="my-groups"
        searchQuery={debouncedSearch}
      />
    </div>
  );
}
