import { PostType } from '@/features/feed/types/feed.types';

export type GroupVisibility = 'PUBLIC' | 'PRIVATE';

export type GroupMemberRole = 'MEMBER' | 'MODERATOR' | 'ADMIN' | 'OWNER';

export type GroupMembershipStatus =
  | 'NONE'
  | 'PENDING'
  | 'MEMBER'
  | 'MODERATOR'
  | 'ADMIN'
  | 'OWNER';

export type GroupJoinRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface GroupUserSummary {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
}

export interface Group {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  visibility: GroupVisibility;
  rules?: string | null;
  createdById: string;
  createdBy?: GroupUserSummary;
  memberCount: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
  isMember?: boolean;
  isPending?: boolean;
  currentUserRole?: GroupMemberRole | null;
}

export interface GroupMembershipInfo {
  status: GroupMembershipStatus;
  role: GroupMemberRole | null;
  requestId: string | null;
}

export interface GroupDetail extends Group {
  membership?: GroupMembershipInfo | null;
}

export interface GroupMemberItem {
  id: string;
  groupId: string;
  userId: string;
  user: GroupUserSummary;
  role: GroupMemberRole;
  joinedAt: string;
}

export interface GroupJoinRequestItem {
  id: string;
  groupId: string;
  userId: string;
  user: GroupUserSummary;
  status: GroupJoinRequestStatus;
  createdAt: string;
}

export interface PaginatedGroupsResponse {
  items: Group[];
  nextCursor: string | null;
}

export interface PaginatedGroupMembersResponse {
  items: GroupMemberItem[];
  nextCursor: string | null;
}

export interface PaginatedGroupJoinRequestsResponse {
  items: GroupJoinRequestItem[];
  nextCursor: string | null;
}

export interface GroupQueryParams {
  search?: string;
  cursor?: string;
  limit?: number;
}

export interface MemberQueryParams {
  search?: string;
  role?: GroupMemberRole;
  cursor?: string;
  limit?: number;
}

export interface CreateGroupInput {
  name: string;
  slug: string;
  description?: string;
  visibility: GroupVisibility;
  rules?: string;
  avatarUrl?: string;
}

export interface UpdateGroupInput {
  name?: string;
  slug?: string;
  description?: string;
  visibility?: GroupVisibility;
  rules?: string;
  avatarUrl?: string;
}

export interface CreateGroupPostInput {
  type: PostType;
  content?: string;
  duaId?: string;
}

export interface ChangeMemberRoleInput {
  role: 'MEMBER' | 'MODERATOR' | 'ADMIN';
}

export interface TransferOwnershipInput {
  newOwnerId: string;
}

export interface GroupActionResponse {
  success: boolean;
  message: string;
}
