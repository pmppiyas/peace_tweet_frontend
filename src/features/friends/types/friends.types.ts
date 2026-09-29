import { BloodGroup } from '@/types/user.types';

// Relationship status states returned by backend
export type FriendshipStatus =
  | 'NONE'
  | 'SELF'
  | 'PENDING_SENT'
  | 'PENDING_RECEIVED'
  | 'FRIENDS';

// Relationship status response
export interface FriendshipStatusResponse {
  status: FriendshipStatus;
  requestId: string | null;
}

// User summary in friend listings
export interface FriendUser {
  id: string;
  name: string;
  username: string;
  avatar?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  bloodGroup?: BloodGroup | null;
}

// Friend list item
export interface FriendItem {
  id: string;
  friendId: string;
  friendSince: string;
  user: FriendUser;
}

// Friend request list item
export interface FriendRequestItem {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  sender?: FriendUser;
  receiver?: FriendUser;
}

// Paginated friends response
export interface PaginatedFriendsResponse {
  items: FriendItem[];
  nextCursor: string | null;
}

// Paginated friend requests response
export interface PaginatedFriendRequestsResponse {
  items: FriendRequestItem[];
  nextCursor: string | null;
}

// Query parameters for friends
export interface FriendQueryParams {
  limit?: number;
  cursor?: string;
  search?: string;
}

// Query parameters for friend requests
export interface FriendRequestQueryParams {
  limit?: number;
  cursor?: string;
}

// Send friend request payload
export interface SendFriendRequestInput {
  receiverId: string;
}

// Generic action response
export interface FriendActionResponse {
  success: boolean;
  message: string;
}

// Full public user profile with relationship status
export interface UserProfileResponse extends FriendUser {
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  friendship?: FriendshipStatusResponse;
}
