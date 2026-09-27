'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GroupMemberItem } from '../types/groups.types';
import { GroupMembershipBadge } from './GroupMembershipBadge';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { Shield, UserX, User } from 'lucide-react';

export interface GroupMemberCardProps {
  member: GroupMemberItem;
  canManage?: boolean;
  canChangeRole?: boolean;
  onRemove?: (member: GroupMemberItem) => void;
  onChangeRole?: (member: GroupMemberItem) => void;
}

export function GroupMemberCard({
  member,
  canManage,
  canChangeRole,
  onRemove,
  onChangeRole,
}: GroupMemberCardProps) {
  const { user } = useAuth();
  const { locale } = useLanguage();
  const isCurrentUser = user?.id === member.userId;
  const isOwner = member.role === 'OWNER';

  return (
    <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#e4e6eb] bg-white p-3.5 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
      {/* User Info */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href={ROUTES.USER_PROFILE(member.user.username)}
          className="shrink-0"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold text-sm shadow-2xs select-none">
            {member.user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.user.avatarUrl}
                alt={member.user.name}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              member.user.name.charAt(0).toUpperCase()
            )}
          </div>
        </Link>

        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <Link
              href={ROUTES.USER_PROFILE(member.user.username)}
              className="truncate text-xs sm:text-sm font-bold text-[#050505] hover:text-emerald-700 dark:text-[#e4e6eb] dark:hover:text-emerald-400 transition-colors"
            >
              {member.user.name}
            </Link>
            {isCurrentUser && (
              <span className="text-[10px] bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 px-1.5 py-0.2 rounded-md font-semibold">
                {locale === 'bn' ? 'আপনি' : 'You'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-xs text-[#65676b] dark:text-[#b0b3b8]">
              @{member.user.username}
            </span>
            <GroupMembershipBadge role={member.role} className="text-[10px]" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <Link href={ROUTES.USER_PROFILE(member.user.username)}>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-xl text-xs h-8 px-3 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <User className="h-3.5 w-3.5 mr-1" />
            <span>{locale === 'bn' ? 'প্রোফাইল' : 'Profile'}</span>
          </Button>
        </Link>

        {/* Change Role (Owner only, not on self/owner) */}
        {canChangeRole && !isCurrentUser && !isOwner && onChangeRole && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onChangeRole(member)}
            className="rounded-xl text-xs h-8 px-2.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
            title={locale === 'bn' ? 'রোল পরিবর্তন করুন' : 'Change Role'}
          >
            <Shield className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* Remove Member (Admin/Owner, not on self/owner) */}
        {canManage && !isCurrentUser && !isOwner && onRemove && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemove(member)}
            className="rounded-xl text-xs h-8 px-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            title={locale === 'bn' ? 'সদস্য রিমুভ করুন' : 'Remove Member'}
          >
            <UserX className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </Card>
  );
}
