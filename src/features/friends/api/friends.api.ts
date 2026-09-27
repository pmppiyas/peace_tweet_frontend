import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import {
  FriendActionResponse,
  FriendQueryParams,
  FriendRequestItem,
  FriendRequestQueryParams,
  FriendshipStatusResponse,
  PaginatedFriendRequestsResponse,
  PaginatedFriendsResponse,
  UserProfileResponse,
} from '../types/friends.types';

export const friendsApi = {
  // Get friends list with cursor pagination and search
  getFriends: async (
    params?: FriendQueryParams,
  ): Promise<ApiResponse<PaginatedFriendsResponse>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedFriendsResponse>>(
      API_ENDPOINTS.FRIENDS.LIST,
      { params },
    );
    return data;
  },

  // Get received pending friend requests
  getReceivedFriendRequests: async (
    params?: FriendRequestQueryParams,
  ): Promise<ApiResponse<PaginatedFriendRequestsResponse>> => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedFriendRequestsResponse>
    >(API_ENDPOINTS.FRIENDS.RECEIVED_REQUESTS, { params });
    return data;
  },

  // Get sent pending friend requests
  getSentFriendRequests: async (
    params?: FriendRequestQueryParams,
  ): Promise<ApiResponse<PaginatedFriendRequestsResponse>> => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedFriendRequestsResponse>
    >(API_ENDPOINTS.FRIENDS.SENT_REQUESTS, { params });
    return data;
  },

  // Get relationship status with a user
  getFriendshipStatus: async (
    userId: string,
  ): Promise<ApiResponse<FriendshipStatusResponse>> => {
    const { data } = await apiClient.get<ApiResponse<FriendshipStatusResponse>>(
      API_ENDPOINTS.FRIENDS.STATUS(userId),
    );
    return data;
  },

  // Get public user profile with friendship status
  getUserProfile: async (
    username: string,
  ): Promise<ApiResponse<UserProfileResponse>> => {
    const { data } = await apiClient.get<ApiResponse<UserProfileResponse>>(
      API_ENDPOINTS.USERS.PROFILE(username),
    );
    return data;
  },

  // Send a friend request
  sendFriendRequest: async (
    receiverId: string,
  ): Promise<ApiResponse<FriendRequestItem>> => {
    const { data } = await apiClient.post<ApiResponse<FriendRequestItem>>(
      API_ENDPOINTS.FRIENDS.SEND_REQUEST,
      { receiverId },
    );
    return data;
  },

  // Cancel a pending sent friend request
  cancelFriendRequest: async (
    requestId: string,
  ): Promise<ApiResponse<FriendActionResponse>> => {
    const { data } = await apiClient.delete<ApiResponse<FriendActionResponse>>(
      API_ENDPOINTS.FRIENDS.CANCEL_REQUEST(requestId),
    );
    return data;
  },

  // Accept a received friend request
  acceptFriendRequest: async (
    requestId: string,
  ): Promise<ApiResponse<FriendActionResponse>> => {
    const { data } = await apiClient.post<ApiResponse<FriendActionResponse>>(
      API_ENDPOINTS.FRIENDS.ACCEPT_REQUEST(requestId),
    );
    return data;
  },

  // Reject a received friend request
  rejectFriendRequest: async (
    requestId: string,
  ): Promise<ApiResponse<FriendActionResponse>> => {
    const { data } = await apiClient.post<ApiResponse<FriendActionResponse>>(
      API_ENDPOINTS.FRIENDS.REJECT_REQUEST(requestId),
    );
    return data;
  },

  // Unfriend / remove friend
  unfriend: async (
    userId: string,
  ): Promise<ApiResponse<FriendActionResponse>> => {
    const { data } = await apiClient.delete<ApiResponse<FriendActionResponse>>(
      API_ENDPOINTS.FRIENDS.UNFRIEND(userId),
    );
    return data;
  },
};
