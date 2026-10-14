'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { ProfileLayout } from './ProfileLayout';
import { ProfileView } from './ProfileView';
import { ProfileFriendsTab } from './ProfileFriendsTab';
import { ProfileGroupsTab } from './ProfileGroupsTab';
import { ProfileSavedTab } from './ProfileSavedTab';

export function ProfilePageContent() {
  const searchParams = useSearchParams();
  const rawTab = (searchParams.get('tab') || 'overview').toLowerCase();
  const from = (searchParams.get('from') || '').toLowerCase();
  const isFromTab = from === 'tab';
  const isViewAs = searchParams.get('view_as') === 'true';

  let currentTab: 'overview' | 'post' | 'friend' | 'group' | 'saved' = 'overview';
  if (rawTab === 'post' || rawTab === 'posts') {
    currentTab = 'post';
  } else if (rawTab === 'friend' || rawTab === 'friends') {
    currentTab = 'friend';
  } else if (rawTab === 'group' || rawTab === 'groups') {
    currentTab = 'group';
  } else if (rawTab === 'saved' || rawTab === 'bookmarks') {
    currentTab = 'saved';
  } else {
    currentTab = 'overview';
  }

  const activeIdMap = {
    overview: 'profile-overview',
    post: 'profile-overview',
    friend: isFromTab ? 'profile-overview' : 'profile-friends',
    group: isFromTab ? 'profile-overview' : 'profile-groups',
    saved: isFromTab ? 'profile-overview' : 'profile-saved',
  };

  const mobileTabIdMap = {
    overview: 'tab-overview',
    post: 'tab-overview',
    friend: isFromTab ? 'tab-overview' : 'tab-friends',
    group: isFromTab ? 'tab-overview' : 'tab-groups',
    saved: isFromTab ? 'tab-overview' : 'tab-saved',
  };

  return (
    <ProfileLayout
      activeId={activeIdMap[currentTab]}
      activeMobileTabId={mobileTabIdMap[currentTab]}
      maxWidth="w-full max-w-7xl 2xl:max-w-[1600px]"
    >
      <ProfileView activeSubTab={currentTab} isViewAs={isViewAs} />
    </ProfileLayout>
  );
}
