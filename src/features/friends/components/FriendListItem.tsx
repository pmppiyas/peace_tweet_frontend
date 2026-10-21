'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { FriendActionButton } from './FriendActionButton';
import { FriendItem } from '../types/friends.types';

export interface FriendListItemProps {
  friend: FriendItem;
  showUnfriend?: boolean;
}

export function FriendListItem({ friend, showUnfriend = true }: FriendListItemProps) {
  const { locale } = useLanguage();

  const targetUser = friend.user;
  const profileUrl = ROUTES.USER_PROFILE(targetUser.username);
  const avatarSrc = targetUser.avatarUrl || targetUser.avatar;
  const isSelf = targetUser.relationship?.status === 'SELF';
  const mutualCount = targetUser.mutualFriendsCount ?? 0;

  return (
    <div className="flex items-center justify-between gap-3 p-3 sm:p-3.5 hover:bg-[#f8f9fa] dark:hover:bg-[#2a2b2c]/60 transition-colors group">
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
        {/* 1. Profile Photo */}
        <Link
          href={profileUrl}
          className="relative h-12 w-12 sm:h-13 sm:w-13 rounded-full overflow-hidden shrink-0 bg-primary-500 text-white font-bold text-base flex items-center justify-center shadow-xs group-hover:opacity-90 active:scale-95 transition-all select-none"
          title={targetUser.name}
        >
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={targetUser.name || 'Friend'}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span>{targetUser.name?.charAt(0) || 'U'}</span>
          )}
        </Link>

        {/* 2. User Info: Name, and Mutual Friends count (or Username if no mutual friends) */}
        <div className="min-w-0">
          <Link
            href={profileUrl}
            className="font-bold text-sm sm:text-[15px] text-[#050505] hover:underline dark:text-white truncate block leading-tight"
          >
            {targetUser.name}
          </Link>

          {!isSelf && mutualCount > 0 ? (
            <div className="flex items-center gap-1 font-medium text-[11px] sm:text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
              <Users className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
              <span>
                {mutualCount}{' '}
                {locale === 'bn'
                  ? 'টি মিউচুয়াল ফ্রেন্ড'
                  : mutualCount === 1
                    ? 'mutual friend'
                    : 'mutual friends'}
              </span>
            </div>
          ) : (
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] truncate mt-0.5">
              @{targetUser.username}
            </p>
          )}
        </div>
      </div>

      {/* 3. Action Buttons: Friend button on right */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <FriendActionButton
          userId={targetUser.id}
          username={targetUser.username}
          status={targetUser.relationship?.status || (showUnfriend ? 'FRIENDS' : 'NONE')}
          requestId={targetUser.relationship?.requestId}
          size="sm"
        />
      </div>
    </div>
  );
}
