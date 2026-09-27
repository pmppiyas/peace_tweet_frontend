'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { groupsApi } from '../api/groups.api';
import { groupsKeys } from './query-keys';
import {
  ChangeMemberRoleInput,
  CreateGroupInput,
  CreateGroupPostInput,
  GroupDetail,
  GroupMemberRole,
  UpdateGroupInput,
} from '../types/groups.types';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export function useGroupActions(group?: GroupDetail) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Helper for auth check
  const ensureAuth = () => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      throw new Error('Please log in to continue.');
    }
  };

  // Join public group OR request private group
  const joinMutation = useMutation({
    mutationFn: async (groupId: string) => {
      ensureAuth();
      return groupsApi.joinGroup(groupId);
    },
    onSuccess: (data, groupId) => {
      // Invalidate & update membership status
      queryClient.invalidateQueries({ queryKey: groupsKeys.membership(groupId) });
      queryClient.invalidateQueries({ queryKey: groupsKeys.myGroups() });
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
      if (group?.slug) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.detail(group.slug) });
      }
      queryClient.invalidateQueries({ queryKey: groupsKeys.members(groupId) });
    },
  });

  // Cancel pending join request
  const cancelRequestMutation = useMutation({
    mutationFn: async (groupId: string) => {
      ensureAuth();
      return groupsApi.cancelJoinRequest(groupId);
    },
    onSuccess: (_data, groupId) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.membership(groupId) });
      if (group?.slug) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.detail(group.slug) });
      }
    },
  });

  // Leave group
  const leaveMutation = useMutation({
    mutationFn: async (groupId: string) => {
      ensureAuth();
      return groupsApi.leaveGroup(groupId);
    },
    onSuccess: (_data, groupId) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.membership(groupId) });
      queryClient.invalidateQueries({ queryKey: groupsKeys.myGroups() });
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
      if (group?.slug) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.detail(group.slug) });
      }
      queryClient.invalidateQueries({ queryKey: groupsKeys.members(groupId) });
    },
  });

  // Create Group
  const createGroupMutation = useMutation({
    mutationFn: async (input: CreateGroupInput) => {
      ensureAuth();
      return groupsApi.createGroup(input);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupsKeys.myGroups() });
      if (response.data?.slug) {
        router.push(ROUTES.GROUPS.DETAIL(response.data.slug));
      }
    },
  });

  // Update Group
  const updateGroupMutation = useMutation({
    mutationFn: async ({
      groupId,
      input,
    }: {
      groupId: string;
      input: UpdateGroupInput;
    }) => {
      ensureAuth();
      return groupsApi.updateGroup(groupId, input);
    },
    onSuccess: (response, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupsKeys.myGroups() });
      if (response.data?.slug) {
        queryClient.invalidateQueries({
          queryKey: groupsKeys.detail(response.data.slug),
        });
      }
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
    },
  });

  // Delete Group
  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      ensureAuth();
      return groupsApi.deleteGroup(groupId);
    },
    onSuccess: (_data, groupId) => {
      queryClient.removeQueries({ queryKey: groupsKeys.detail(groupId) });
      if (group?.slug) {
        queryClient.removeQueries({ queryKey: groupsKeys.detail(group.slug) });
      }
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupsKeys.myGroups() });
      router.push(ROUTES.GROUPS.HOME);
    },
  });

  // Remove Member
  const removeMemberMutation = useMutation({
    mutationFn: async ({
      groupId,
      userId,
    }: {
      groupId: string;
      userId: string;
    }) => {
      ensureAuth();
      return groupsApi.removeMember(groupId, userId);
    },
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.members(groupId) });
      if (group?.slug) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.detail(group.slug) });
      }
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
    },
  });

  // Change Member Role
  const changeRoleMutation = useMutation({
    mutationFn: async ({
      groupId,
      userId,
      role,
    }: {
      groupId: string;
      userId: string;
      role: 'MEMBER' | 'MODERATOR' | 'ADMIN';
    }) => {
      ensureAuth();
      return groupsApi.changeMemberRole(groupId, userId, { role });
    },
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.members(groupId) });
      queryClient.invalidateQueries({ queryKey: groupsKeys.membership(groupId) });
      if (group?.slug) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.detail(group.slug) });
      }
    },
  });

  // Accept Join Request
  const acceptRequestMutation = useMutation({
    mutationFn: async ({
      groupId,
      requestId,
    }: {
      groupId: string;
      requestId: string;
    }) => {
      ensureAuth();
      return groupsApi.acceptJoinRequest(groupId, requestId);
    },
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.requests(groupId) });
      queryClient.invalidateQueries({ queryKey: groupsKeys.members(groupId) });
      if (group?.slug) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.detail(group.slug) });
      }
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
    },
  });

  // Reject Join Request
  const rejectRequestMutation = useMutation({
    mutationFn: async ({
      groupId,
      requestId,
    }: {
      groupId: string;
      requestId: string;
    }) => {
      ensureAuth();
      return groupsApi.rejectJoinRequest(groupId, requestId);
    },
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.requests(groupId) });
    },
  });

  // Create Group Post
  const createPostMutation = useMutation({
    mutationFn: async ({
      groupId,
      input,
    }: {
      groupId: string;
      input: CreateGroupPostInput;
    }) => {
      ensureAuth();
      return groupsApi.createGroupPost(groupId, input);
    },
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.posts(groupId) });
      if (group?.slug) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.detail(group.slug) });
      }
    },
  });

  return {
    joinGroup: joinMutation.mutateAsync,
    isJoining: joinMutation.isPending,

    cancelJoinRequest: cancelRequestMutation.mutateAsync,
    isCancellingRequest: cancelRequestMutation.isPending,

    leaveGroup: leaveMutation.mutateAsync,
    isLeaving: leaveMutation.isPending,

    createGroup: createGroupMutation.mutateAsync,
    isCreatingGroup: createGroupMutation.isPending,

    updateGroup: (groupId: string, input: UpdateGroupInput) =>
      updateGroupMutation.mutateAsync({ groupId, input }),
    isUpdatingGroup: updateGroupMutation.isPending,

    deleteGroup: deleteGroupMutation.mutateAsync,
    isDeletingGroup: deleteGroupMutation.isPending,

    removeMember: (groupId: string, userId: string) =>
      removeMemberMutation.mutateAsync({ groupId, userId }),
    isRemovingMember: removeMemberMutation.isPending,

    changeMemberRole: (
      groupId: string,
      userId: string,
      role: 'MEMBER' | 'MODERATOR' | 'ADMIN',
    ) => changeRoleMutation.mutateAsync({ groupId, userId, role }),
    isChangingRole: changeRoleMutation.isPending,

    acceptRequest: (groupId: string, requestId: string) =>
      acceptRequestMutation.mutateAsync({ groupId, requestId }),
    isAcceptingRequest: acceptRequestMutation.isPending,

    rejectRequest: (groupId: string, requestId: string) =>
      rejectRequestMutation.mutateAsync({ groupId, requestId }),
    isRejectingRequest: rejectRequestMutation.isPending,

    createGroupPost: (groupId: string, input: CreateGroupPostInput) =>
      createPostMutation.mutateAsync({ groupId, input }),
    isCreatingPost: createPostMutation.isPending,
  };
}
