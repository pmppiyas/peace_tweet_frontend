'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GroupDetail, GroupMemberItem, GroupMemberRole } from '../types/groups.types';
import { useGroupMembers } from '../hooks/useGroupMembers';
import { useGroupActions } from '../hooks/useGroupActions';
import { GroupMemberCard } from './GroupMemberCard';
import { GroupMemberListSkeleton } from './GroupMemberSkeleton';
import { GroupsEmptyState } from './GroupsEmptyState';
import { RemoveMemberDialog } from './RemoveMemberDialog';
import { ChangeMemberRoleDialog } from './ChangeMemberRoleDialog';
import {
  canManageMembers,
  canChangeMemberRole,
} from '../utils/group-permissions';
import { Search, Users, Shield } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

export interface GroupMemberListProps {
  group: GroupDetail;
}

export function GroupMemberList({ group }: GroupMemberListProps) {
  const { locale } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<GroupMemberRole | undefined>(
    undefined,
  );
  const [memberToRemove, setMemberToRemove] = useState<GroupMemberItem | null>(
    null,
  );
  const [memberToChangeRole, setMemberToChangeRole] =
    useState<GroupMemberItem | null>(null);

  const currentUserRole = group.membership?.role || group.currentUserRole;
  const canManage = canManageMembers(currentUserRole);
  const canChangeRole = canChangeMemberRole(currentUserRole);

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGroupMembers(group.id, {
    search: search || undefined,
    role: selectedRole,
    limit: 20,
  });

  const {
    removeMember,
    isRemovingMember,
    changeMemberRole: updateRole,
    isChangingRole,
  } = useGroupActions(group);

  const allMembers = data?.pages.flatMap((page) => page?.items || []) || [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px', threshold: 0.1 },
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;
    try {
      await removeMember(group.id, memberToRemove.userId);
      setMemberToRemove(null);
    } catch {
      // Handled by query mutation
    }
  };

  const handleConfirmChangeRole = async (
    newRole: 'MEMBER' | 'MODERATOR' | 'ADMIN',
  ) => {
    if (!memberToChangeRole) return;
    try {
      await updateRole(group.id, memberToChangeRole.userId, newRole);
      setMemberToChangeRole(null);
    } catch {
      // Handled by query mutation
    }
  };

  const roleFilterTabs: Array<{ label: string; role?: GroupMemberRole }> = [
    { label: locale === 'bn' ? 'সকল' : 'All', role: undefined },
    { label: locale === 'bn' ? 'ওনার' : 'Owner', role: 'OWNER' },
    { label: locale === 'bn' ? 'অ্যাডমিন' : 'Admins', role: 'ADMIN' },
    { label: locale === 'bn' ? 'মডারেটর' : 'Moderators', role: 'MODERATOR' },
    { label: locale === 'bn' ? 'সদস্য' : 'Members', role: 'MEMBER' },
  ];

  return (
    <div className="space-y-3.5">
      {/* Search & Role Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              locale === 'bn'
                ? 'সদস্যের নাম বা ইউজারনেম দিয়ে খুঁজুন...'
                : 'Search members by name or username...'
            }
            className="h-10 w-full rounded-2xl border border-[#e4e6eb] bg-white pl-9 pr-4 text-xs sm:text-sm text-[#050505] placeholder:text-[#65676b] focus:border-primary-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb]"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {roleFilterTabs.map((tab) => {
            const isActive = selectedRole === tab.role;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setSelectedRole(tab.role)}
                className={cn(
                  'inline-flex shrink-0 items-center rounded-xl px-3 py-1 text-xs font-bold transition-all',
                  isActive
                    ? 'bg-primary-500 text-white shadow-2xs'
                    : 'bg-white border border-[#e4e6eb] text-[#65676b] hover:bg-[#f0f2f5] dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#b0b3b8]',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Members List */}
      {isLoading ? (
        <GroupMemberListSkeleton count={6} />
      ) : allMembers.length === 0 ? (
        <GroupsEmptyState type="members" />
      ) : (
        <div className="space-y-2.5">
          {allMembers.map((member) => (
            <GroupMemberCard
              key={member.id}
              member={member}
              canManage={canManage}
              canChangeRole={canChangeRole}
              onRemove={(m) => setMemberToRemove(m)}
              onChangeRole={(m) => setMemberToChangeRole(m)}
            />
          ))}

          {/* Infinite Scroll Sentinel */}
          <div ref={loadMoreRef} className="h-4 w-full" />

          {isFetchingNextPage && <GroupMemberListSkeleton count={2} />}
        </div>
      )}

      {/* Remove Member Confirmation Dialog */}
      <RemoveMemberDialog
        isOpen={Boolean(memberToRemove)}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleConfirmRemove}
        member={memberToRemove}
        isRemoving={isRemovingMember}
      />

      {/* Change Role Dialog */}
      <ChangeMemberRoleDialog
        isOpen={Boolean(memberToChangeRole)}
        onClose={() => setMemberToChangeRole(null)}
        onConfirm={handleConfirmChangeRole}
        member={memberToChangeRole}
        isChanging={isChangingRole}
      />
    </div>
  );
}
