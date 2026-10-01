'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { GroupList } from '@/features/groups/components/GroupList';
import { GroupsLayout } from '@/features/groups/components/GroupsLayout';
import { useGroups } from '@/features/groups/hooks/useGroups';
import { useMyGroups } from '@/features/groups/hooks/useMyGroups';

function GroupsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'discover' | 'my-groups'>(
    'discover'
  );
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (tabParam === 'my-groups') {
      setActiveTab('my-groups');
    } else if (tabParam === 'discover' || !tabParam) {
      setActiveTab('discover');
    }
  }, [tabParam]);

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
    <GroupsLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      <div className="space-y-4">
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
      </div>
    </GroupsLayout>
  );
}

export default function GroupsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary-500/30 border-t-primary-500" />
        </div>
      }
    >
      <GroupsContent />
    </Suspense>
  );
}
