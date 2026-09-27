'use client';

import React, { useState } from 'react';
import { FriendsHeader } from './FriendsHeader';
import { FriendsTabs, FriendsTabValue } from './FriendsTabs';
import { MyFriends } from './MyFriends';
import { ReceivedRequests } from './ReceivedRequests';
import { SentRequests } from './SentRequests';
import { useDebounce } from '@/hooks/useDebounce';

export interface FriendsPageProps {
  initialTab?: FriendsTabValue;
}

export function FriendsPage({ initialTab = 'friends' }: FriendsPageProps) {
  const [activeTab, setActiveTab] = useState<FriendsTabValue>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  return (
    <div className="space-y-4">
      {/* Header with Search */}
      <FriendsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={activeTab === 'friends'}
      />

      {/* Tabs */}
      <FriendsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'friends' && <MyFriends searchQuery={debouncedSearch} />}
        {activeTab === 'requests' && <ReceivedRequests />}
        {activeTab === 'sent' && <SentRequests />}
      </div>
    </div>
  );
}
