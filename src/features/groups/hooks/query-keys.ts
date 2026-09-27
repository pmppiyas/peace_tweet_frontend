import { GroupQueryParams, MemberQueryParams } from '../types/groups.types';

export const groupsKeys = {
  all: ['groups'] as const,
  lists: () => [...groupsKeys.all, 'list'] as const,
  list: (params?: GroupQueryParams) => [...groupsKeys.lists(), params] as const,
  myGroups: (params?: GroupQueryParams) =>
    [...groupsKeys.all, 'my-groups', params] as const,
  details: () => [...groupsKeys.all, 'detail'] as const,
  detail: (slugOrId: string) => [...groupsKeys.details(), slugOrId] as const,
  membership: (groupId: string) =>
    [...groupsKeys.all, 'membership', groupId] as const,
  members: (groupId: string, params?: MemberQueryParams) =>
    [...groupsKeys.all, 'members', groupId, params] as const,
  requests: (groupId: string, params?: GroupQueryParams) =>
    [...groupsKeys.all, 'requests', groupId, params] as const,
  posts: (groupId: string, params?: GroupQueryParams) =>
    [...groupsKeys.all, 'posts', groupId, params] as const,
};
