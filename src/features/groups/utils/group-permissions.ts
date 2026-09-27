import {
  GroupDetail,
  GroupMemberRole,
  GroupMembershipInfo,
  GroupMembershipStatus,
} from '../types/groups.types';

export function isGroupOwner(role?: GroupMemberRole | null): boolean {
  return role === 'OWNER';
}

export function isGroupAdmin(role?: GroupMemberRole | null): boolean {
  return role === 'OWNER' || role === 'ADMIN';
}

export function isGroupModerator(role?: GroupMemberRole | null): boolean {
  return role === 'OWNER' || role === 'ADMIN' || role === 'MODERATOR';
}

export function canManageGroup(role?: GroupMemberRole | null): boolean {
  return isGroupAdmin(role);
}

export function canManageMembers(role?: GroupMemberRole | null): boolean {
  return isGroupModerator(role);
}

export function canManageRequests(role?: GroupMemberRole | null): boolean {
  return isGroupModerator(role);
}

export function canDeleteGroup(role?: GroupMemberRole | null): boolean {
  return isGroupOwner(role);
}

export function canChangeMemberRole(role?: GroupMemberRole | null): boolean {
  return isGroupOwner(role);
}

export function canPostInGroup(
  status?: GroupMembershipStatus | null,
  role?: GroupMemberRole | null,
): boolean {
  if (role && ['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER'].includes(role)) {
    return true;
  }
  return (
    status === 'MEMBER' ||
    status === 'MODERATOR' ||
    status === 'ADMIN' ||
    status === 'OWNER'
  );
}

export function canViewPrivateContent(
  group: GroupDetail,
  membership?: GroupMembershipInfo | null,
): boolean {
  if (group.visibility === 'PUBLIC') return true;
  if (!membership) return false;
  return ['MEMBER', 'MODERATOR', 'ADMIN', 'OWNER'].includes(membership.status);
}
