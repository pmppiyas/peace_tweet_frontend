'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { GroupList } from '@/features/groups/components/GroupList';
import { GroupsNavTabs } from '@/features/groups/components/GroupsTabs';
import { useGroups } from '@/features/groups/hooks/useGroups';
import { useMyGroups } from '@/features/groups/hooks/useMyGroups';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Search, Users } from 'lucide-react';

export default function GroupsPage() {
  const { locale } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'discover' | 'my-groups'>('discover');
  const [search, setSearch] = useState('');

  // Discover public groups
  const {
    data: discoverData,
    isLoading: isLoadingDiscover,
    isFetchingNextPage: isFetchingDiscoverNext,
    hasNextPage: hasDiscoverNext,
    fetchNextPage: fetchDiscoverNext,
  } = useGroups({
    search: search || undefined,
    limit: 20,
  });

  // User's joined groups
  const {
    data: myGroupsData,
    isLoading: isLoadingMyGroups,
    isFetchingNextPage: isFetchingMyGroupsNext,
    hasNextPage: hasMyGroupsNext,
    fetchNextPage: fetchMyGroupsNext,
  } = useMyGroups({
    search: search || undefined,
    limit: 20,
  });

  const discoverGroups =
    discoverData?.pages.flatMap((page) => page?.items || []) || [];
  const myGroups =
    myGroupsData?.pages.flatMap((page) => page?.items || []) || [];

  const displayedGroups = activeTab === 'discover' ? discoverGroups : myGroups;
  const isLoading =
    activeTab === 'discover' ? isLoadingDiscover : isLoadingMyGroups;
  const hasNextPage =
    activeTab === 'discover' ? hasDiscoverNext : hasMyGroupsNext;
  const isFetchingNextPage =
    activeTab === 'discover' ? isFetchingDiscoverNext : isFetchingMyGroupsNext;
  const fetchNextPage =
    activeTab === 'discover' ? fetchDiscoverNext : fetchMyGroupsNext;

  return (
    <Container size="xl" className="py-4 sm:py-6">
      <div className="flex gap-6 justify-center">
        <Sidebar />

        <main className="w-full max-w-2xl min-w-0 space-y-4">
          <Breadcrumbs
            items={[{ label: locale === 'bn' ? 'গ্রুপসমূহ' : 'Groups' }]}
          />

          {/* Header Card */}
          <div className="rounded-2xl bg-white p-4 sm:p-5 border border-[#e4e6eb] shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-teal-700 text-white font-bold shadow-2xs select-none">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn' ? 'ইসলামিক গ্রুপসমূহ' : 'Islamic Community Groups'}
                  </h1>
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                    {locale === 'bn'
                      ? 'দোয়া, জিকির ও দ্বীনি আলোচনার জন্য বিভিন্ন গ্রুপে যুক্ত হন।'
                      : 'Join groups to share duas, reflections, and connect.'}
                  </p>
                </div>
              </div>

              {/* Create Group CTA */}
              <Link href={isAuthenticated ? ROUTES.GROUPS.CREATE : ROUTES.LOGIN}>
                <Button
                  size="sm"
                  className="rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-2xs w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  <span>{locale === 'bn' ? 'নতুন গ্রুপ' : 'Create Group'}</span>
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  locale === 'bn'
                    ? 'গ্রুপের নাম বা বিষয় দিয়ে খুঁজুন...'
                    : 'Search groups by name or topic...'
                }
                className="h-10 w-full rounded-2xl border border-[#e4e6eb] bg-[#f0f2f5] pl-9 pr-4 text-xs sm:text-sm text-[#050505] placeholder:text-[#65676b] focus:border-primary-500 focus:bg-white focus:outline-hidden dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:placeholder:text-[#b0b3b8] dark:focus:bg-[#242526]"
              />
            </div>
          </div>

          {/* Navigation Tabs (Discover vs My Groups) */}
          <GroupsNavTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            myGroupsCount={isAuthenticated ? myGroups.length : undefined}
          />

          {/* Group Cards List */}
          <GroupList
            groups={displayedGroups}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            emptyType={
              search
                ? 'search'
                : activeTab === 'my-groups'
                  ? 'my-groups'
                  : 'discover'
            }
            searchQuery={search}
          />
        </main>

        <RightSidebar />
      </div>
    </Container>
  );
}
