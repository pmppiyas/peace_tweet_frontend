'use client';

import React from 'react';
import { useReceivedFriendRequests } from '../hooks/useFriendRequests';
import { FriendRequestList } from './FriendRequestList';
import { FriendRequestItem } from '../types/friends.types';

export function ReceivedRequests() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useReceivedFriendRequests();

  // Flatten all pages
  const items: FriendRequestItem[] =
    data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <FriendRequestList
      items={items}
      variant="received"
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
