'use client';

import React from 'react';
import { useFriends } from '../hooks/useFriends';
import { FriendList } from './FriendList';
import { FriendItem } from '../types/friends.types';

export interface MyFriendsProps {
  searchQuery: string;
  userId?: string;
  layout?: 'list' | 'grid';
  showUnfriend?: boolean;
  header?: React.ReactNode;
}

export function MyFriends({
  searchQuery,
  userId,
  layout = 'list',
  showUnfriend,
  header,
}: MyFriendsProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useFriends(searchQuery, userId);

  // Flatten all pages
  const items: FriendItem[] =
    data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <FriendList
      items={items}
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      isSearching={Boolean(searchQuery.trim())}
      layout={layout}
      showUnfriend={showUnfriend ?? !userId}
      header={header}
    />
  );
}
