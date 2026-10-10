'use client';

import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { friendsApi } from '../api/friends.api';
import {
  FriendshipStatusResponse,
  PaginatedFriendRequestsResponse,
  PaginatedFriendsResponse,
} from '../types/friends.types';
import { friendsKeys } from './useFriends';
import { soundEffects } from '@/lib/sound/soundEffects';

export function useFriendActions() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Helper to ensure user is logged in
  const requireAuth = () => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      throw new Error('Please log in to perform this action');
    }
  };

  // 1. Send Friend Request Mutation (NONE -> PENDING_SENT)
  const sendRequestMutation = useMutation({
    mutationFn: async ({ receiverId }: { receiverId: string }) => {
      requireAuth();
      return friendsApi.sendFriendRequest(receiverId);
    },
    onMutate: async ({ receiverId }) => {
      soundEffects.playFriendRequest();
      await queryClient.cancelQueries({ queryKey: friendsKeys.status(receiverId) });

      const previousStatus = queryClient.getQueryData<FriendshipStatusResponse>(
        friendsKeys.status(receiverId),
      );

      // Optimistically mark as PENDING_SENT
      queryClient.setQueryData<FriendshipStatusResponse>(
        friendsKeys.status(receiverId),
        { status: 'PENDING_SENT', requestId: 'optimistic' },
      );

      return { previousStatus, receiverId };
    },
    onError: (_err, _vars, context) => {
      if (context?.receiverId && context.previousStatus !== undefined) {
        queryClient.setQueryData(
          friendsKeys.status(context.receiverId),
          context.previousStatus,
        );
      }
    },
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: friendsKeys.status(vars.receiverId) });
      queryClient.invalidateQueries({ queryKey: friendsKeys.sentRequests() });
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
    },
  });

  // 2. Cancel Sent Friend Request Mutation (PENDING_SENT -> NONE)
  const cancelRequestMutation = useMutation({
    mutationFn: async ({
      requestId,
      targetUserId,
    }: {
      requestId: string;
      targetUserId?: string;
    }) => {
      requireAuth();
      return friendsApi.cancelFriendRequest(requestId);
    },
    onMutate: async ({ requestId, targetUserId }) => {
      soundEffects.playCancel();
      if (targetUserId) {
        await queryClient.cancelQueries({ queryKey: friendsKeys.status(targetUserId) });
        queryClient.setQueryData<FriendshipStatusResponse>(
          friendsKeys.status(targetUserId),
          { status: 'NONE', requestId: null },
        );
      }

      // Optimistically remove from sent requests cache
      queryClient.setQueriesData<InfiniteData<PaginatedFriendRequestsResponse>>(
        { queryKey: friendsKeys.sentRequests(), exact: true },
        (oldData: any) => {
          if (!oldData || !Array.isArray(oldData.pages)) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              items: Array.isArray(page?.items)
                ? page.items.filter((item: any) => item.id !== requestId && item.receiver?.id !== targetUserId)
                : [],
            })),
          };
        },
      );
    },
    onSettled: (_data, _error, vars) => {
      if (vars.targetUserId) {
        queryClient.invalidateQueries({ queryKey: friendsKeys.status(vars.targetUserId) });
      }
      queryClient.invalidateQueries({ queryKey: friendsKeys.sentRequests() });
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
    },
  });

  // 3. Accept Received Friend Request Mutation (PENDING_RECEIVED -> FRIENDS)
  const acceptRequestMutation = useMutation({
    mutationFn: async ({
      requestId,
      senderUserId,
    }: {
      requestId: string;
      senderUserId?: string;
    }) => {
      requireAuth();
      return friendsApi.acceptFriendRequest(requestId);
    },
    onMutate: async ({ requestId, senderUserId }) => {
      soundEffects.playFriendAccept();
      if (senderUserId) {
        await queryClient.cancelQueries({ queryKey: friendsKeys.status(senderUserId) });
        queryClient.setQueryData<FriendshipStatusResponse>(
          friendsKeys.status(senderUserId),
          { status: 'FRIENDS', requestId: null },
        );
      }

      // Optimistically remove from received requests cache
      queryClient.setQueriesData<InfiniteData<PaginatedFriendRequestsResponse>>(
        { queryKey: friendsKeys.receivedRequests(), exact: true },
        (oldData: any) => {
          if (!oldData || !Array.isArray(oldData.pages)) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              items: Array.isArray(page?.items)
                ? page.items.filter((item: any) => item.id !== requestId && item.sender?.id !== senderUserId)
                : [],
            })),
          };
        },
      );

      // Optimistically decrement count badge
      queryClient.setQueryData<number>(
        [...friendsKeys.receivedRequests(), 'count'],
        (oldCount) => (typeof oldCount === 'number' && oldCount > 0 ? oldCount - 1 : 0),
      );
    },
    onSettled: (_data, _error, vars) => {
      if (vars.senderUserId) {
        queryClient.invalidateQueries({ queryKey: friendsKeys.status(vars.senderUserId) });
      }
      queryClient.invalidateQueries({ queryKey: friendsKeys.receivedRequests() });
      queryClient.invalidateQueries({ queryKey: friendsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
    },
  });

  // 4. Reject Received Friend Request Mutation (PENDING_RECEIVED -> NONE)
  const rejectRequestMutation = useMutation({
    mutationFn: async ({
      requestId,
      senderUserId,
    }: {
      requestId: string;
      senderUserId?: string;
    }) => {
      requireAuth();
      return friendsApi.rejectFriendRequest(requestId);
    },
    onMutate: async ({ requestId, senderUserId }) => {
      soundEffects.playCancel();
      if (senderUserId) {
        await queryClient.cancelQueries({ queryKey: friendsKeys.status(senderUserId) });
        queryClient.setQueryData<FriendshipStatusResponse>(
          friendsKeys.status(senderUserId),
          { status: 'NONE', requestId: null },
        );
      }

      // Optimistically remove from received requests cache
      queryClient.setQueriesData<InfiniteData<PaginatedFriendRequestsResponse>>(
        { queryKey: friendsKeys.receivedRequests(), exact: true },
        (oldData: any) => {
          if (!oldData || !Array.isArray(oldData.pages)) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              items: Array.isArray(page?.items)
                ? page.items.filter((item: any) => item.id !== requestId && item.sender?.id !== senderUserId)
                : [],
            })),
          };
        },
      );

      // Optimistically decrement count badge
      queryClient.setQueryData<number>(
        [...friendsKeys.receivedRequests(), 'count'],
        (oldCount) => (typeof oldCount === 'number' && oldCount > 0 ? oldCount - 1 : 0),
      );
    },
    onSettled: (_data, _error, vars) => {
      if (vars.senderUserId) {
        queryClient.invalidateQueries({ queryKey: friendsKeys.status(vars.senderUserId) });
      }
      queryClient.invalidateQueries({ queryKey: friendsKeys.receivedRequests() });
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
    },
  });

  // 5. Unfriend Mutation (FRIENDS -> NONE)
  const unfriendMutation = useMutation({
    mutationFn: async ({ targetUserId }: { targetUserId: string }) => {
      requireAuth();
      return friendsApi.unfriend(targetUserId);
    },
    onMutate: async ({ targetUserId }) => {
      soundEffects.playCancel();
      await queryClient.cancelQueries({ queryKey: friendsKeys.status(targetUserId) });
      queryClient.setQueryData<FriendshipStatusResponse>(
        friendsKeys.status(targetUserId),
        { status: 'NONE', requestId: null },
      );

      // Optimistically remove from friends list cache
      queryClient.setQueriesData<InfiniteData<PaginatedFriendsResponse>>(
        { queryKey: ['friends', 'list'] },
        (oldData: any) => {
          if (!oldData || !Array.isArray(oldData.pages)) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              items: Array.isArray(page?.items)
                ? page.items.filter((item: any) => item.friendId !== targetUserId && item.user?.id !== targetUserId)
                : [],
            })),
          };
        },
      );
    },
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: friendsKeys.status(vars.targetUserId) });
      queryClient.invalidateQueries({ queryKey: friendsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
    },
  });

  return {
    sendRequest: (receiverId: string) =>
      sendRequestMutation.mutateAsync({ receiverId }),
    cancelRequest: (requestId: string, targetUserId?: string) =>
      cancelRequestMutation.mutateAsync({ requestId, targetUserId }),
    acceptRequest: (requestId: string, senderUserId?: string) =>
      acceptRequestMutation.mutateAsync({ requestId, senderUserId }),
    rejectRequest: (requestId: string, senderUserId?: string) =>
      rejectRequestMutation.mutateAsync({ requestId, senderUserId }),
    unfriend: (targetUserId: string) =>
      unfriendMutation.mutateAsync({ targetUserId }),

    isSending: sendRequestMutation.isPending,
    isCancelling: cancelRequestMutation.isPending,
    isAccepting: acceptRequestMutation.isPending,
    isRejecting: rejectRequestMutation.isPending,
    isUnfriending: unfriendMutation.isPending,
  };
}
