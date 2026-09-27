'use client';

import { useQuery } from '@tanstack/react-query';
import { friendsApi } from '../api/friends.api';
import { FriendshipStatusResponse, UserProfileResponse } from '../types/friends.types';
import { friendsKeys } from './useFriends';

// Hook for fetching relationship status with a specific user
export function useFriendshipStatus(userId?: string, enabled = true) {
  return useQuery({
    queryKey: userId ? friendsKeys.status(userId) : ['friends', 'status', 'empty'],
    queryFn: async () => {
      if (!userId) return null;
      const response = await friendsApi.getFriendshipStatus(userId);
      const data = (response?.data as FriendshipStatusResponse) || response;
      return data;
    },
    enabled: Boolean(userId) && enabled,
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Hook for fetching public user profile including friendship status
export function useUserProfile(username?: string, enabled = true) {
  return useQuery({
    queryKey: username ? friendsKeys.profile(username) : ['users', 'profile', 'empty'],
    queryFn: async () => {
      if (!username) return null;
      const response = await friendsApi.getUserProfile(username);
      const data = (response?.data as UserProfileResponse) || response;
      return data;
    },
    enabled: Boolean(username) && enabled,
    staleTime: 1000 * 60, // 1 minute
  });
}
