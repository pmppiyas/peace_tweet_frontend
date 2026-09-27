import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import {
  ChangeMemberRoleInput,
  CreateGroupInput,
  CreateGroupPostInput,
  GroupActionResponse,
  GroupDetail,
  GroupMembershipInfo,
  GroupQueryParams,
  MemberQueryParams,
  PaginatedGroupJoinRequestsResponse,
  PaginatedGroupMembersResponse,
  PaginatedGroupsResponse,
  UpdateGroupInput,
} from '../types/groups.types';
import { FeedItem, FeedResponse } from '@/features/feed/types/feed.types';

export const groupsApi = {
  // Discover / search groups with cursor pagination
  getGroups: async (
    params?: GroupQueryParams,
  ): Promise<ApiResponse<PaginatedGroupsResponse>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedGroupsResponse>>(
      API_ENDPOINTS.GROUPS.LIST,
      { params },
    );
    return data;
  },

  // Get current user's joined groups
  getMyGroups: async (
    params?: GroupQueryParams,
  ): Promise<ApiResponse<PaginatedGroupsResponse>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedGroupsResponse>>(
      API_ENDPOINTS.GROUPS.MY_GROUPS,
      { params },
    );
    return data;
  },

  // Get group details by slug
  getGroupBySlug: async (slug: string): Promise<ApiResponse<GroupDetail>> => {
    const { data } = await apiClient.get<ApiResponse<GroupDetail>>(
      API_ENDPOINTS.GROUPS.BY_SLUG(slug),
    );
    return data;
  },

  // Get group details by UUID
  getGroupById: async (groupId: string): Promise<ApiResponse<GroupDetail>> => {
    const { data } = await apiClient.get<ApiResponse<GroupDetail>>(
      API_ENDPOINTS.GROUPS.BY_ID(groupId),
    );
    return data;
  },

  // Create a new group
  createGroup: async (
    input: CreateGroupInput,
  ): Promise<ApiResponse<GroupDetail>> => {
    const { data } = await apiClient.post<ApiResponse<GroupDetail>>(
      API_ENDPOINTS.GROUPS.CREATE,
      input,
    );
    return data;
  },

  // Update group details
  updateGroup: async (
    groupId: string,
    input: UpdateGroupInput,
  ): Promise<ApiResponse<GroupDetail>> => {
    const { data } = await apiClient.patch<ApiResponse<GroupDetail>>(
      API_ENDPOINTS.GROUPS.UPDATE(groupId),
      input,
    );
    return data;
  },

  // Delete a group
  deleteGroup: async (
    groupId: string,
  ): Promise<ApiResponse<GroupActionResponse>> => {
    const { data } = await apiClient.delete<ApiResponse<GroupActionResponse>>(
      API_ENDPOINTS.GROUPS.DELETE(groupId),
    );
    return data;
  },

  // Get current user's membership status with a group
  getMembershipStatus: async (
    groupId: string,
  ): Promise<ApiResponse<GroupMembershipInfo>> => {
    const { data } = await apiClient.get<ApiResponse<GroupMembershipInfo>>(
      API_ENDPOINTS.GROUPS.MEMBERSHIP(groupId),
    );
    return data;
  },

  // Join public group OR request to join private group
  joinGroup: async (
    groupId: string,
  ): Promise<ApiResponse<{ status: string; role?: string }>> => {
    const { data } = await apiClient.post<
      ApiResponse<{ status: string; role?: string }>
    >(API_ENDPOINTS.GROUPS.JOIN(groupId));
    return data;
  },

  // Cancel pending join request for a private group
  cancelJoinRequest: async (
    groupId: string,
  ): Promise<ApiResponse<GroupActionResponse>> => {
    const { data } = await apiClient.delete<ApiResponse<GroupActionResponse>>(
      API_ENDPOINTS.GROUPS.CANCEL_REQUEST(groupId),
    );
    return data;
  },

  // Leave a group
  leaveGroup: async (
    groupId: string,
  ): Promise<ApiResponse<GroupActionResponse>> => {
    const { data } = await apiClient.delete<ApiResponse<GroupActionResponse>>(
      API_ENDPOINTS.GROUPS.LEAVE(groupId),
    );
    return data;
  },

  // Get group members with cursor pagination and search
  getMembers: async (
    groupId: string,
    params?: MemberQueryParams,
  ): Promise<ApiResponse<PaginatedGroupMembersResponse>> => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedGroupMembersResponse>
    >(API_ENDPOINTS.GROUPS.MEMBERS(groupId), { params });
    return data;
  },

  // Remove a member from the group
  removeMember: async (
    groupId: string,
    userId: string,
  ): Promise<ApiResponse<GroupActionResponse>> => {
    const { data } = await apiClient.delete<ApiResponse<GroupActionResponse>>(
      API_ENDPOINTS.GROUPS.REMOVE_MEMBER(groupId, userId),
    );
    return data;
  },

  // Change a member's role
  changeMemberRole: async (
    groupId: string,
    userId: string,
    input: ChangeMemberRoleInput,
  ): Promise<ApiResponse<GroupActionResponse>> => {
    const { data } = await apiClient.patch<ApiResponse<GroupActionResponse>>(
      API_ENDPOINTS.GROUPS.CHANGE_ROLE(groupId, userId),
      input,
    );
    return data;
  },

  // Get pending join requests
  getJoinRequests: async (
    groupId: string,
    params?: GroupQueryParams,
  ): Promise<ApiResponse<PaginatedGroupJoinRequestsResponse>> => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedGroupJoinRequestsResponse>
    >(API_ENDPOINTS.GROUPS.REQUESTS(groupId), { params });
    return data;
  },

  // Accept a join request
  acceptJoinRequest: async (
    groupId: string,
    requestId: string,
  ): Promise<ApiResponse<GroupActionResponse>> => {
    const { data } = await apiClient.post<ApiResponse<GroupActionResponse>>(
      API_ENDPOINTS.GROUPS.ACCEPT_REQUEST(groupId, requestId),
    );
    return data;
  },

  // Reject a join request
  rejectJoinRequest: async (
    groupId: string,
    requestId: string,
  ): Promise<ApiResponse<GroupActionResponse>> => {
    const { data } = await apiClient.post<ApiResponse<GroupActionResponse>>(
      API_ENDPOINTS.GROUPS.REJECT_REQUEST(groupId, requestId),
    );
    return data;
  },

  // Get posts inside a group (cursor pagination)
  getGroupPosts: async (
    groupId: string,
    params?: GroupQueryParams,
  ): Promise<ApiResponse<FeedResponse>> => {
    const { data } = await apiClient.get<ApiResponse<FeedResponse>>(
      API_ENDPOINTS.GROUPS.POSTS(groupId),
      { params },
    );
    return data;
  },

  // Create a post inside a group
  createGroupPost: async (
    groupId: string,
    input: CreateGroupPostInput,
  ): Promise<ApiResponse<FeedItem>> => {
    const { data } = await apiClient.post<ApiResponse<FeedItem>>(
      API_ENDPOINTS.GROUPS.CREATE_POST(groupId),
      input,
    );
    return data;
  },
};
