'use client';

import React from 'react';
import { useSentFriendRequests } from '../hooks/useFriendRequests';
import { FriendRequestList } from './FriendRequestList';
import { FriendRequestItem } from '../types/friends.types';

export function SentRequests() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSentFriendRequests();

  // Flatten all pages
  const items: FriendRequestItem[] =
    data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <FriendRequestList
      items={items}
      variant="sent"
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
