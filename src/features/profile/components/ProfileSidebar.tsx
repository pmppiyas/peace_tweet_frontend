'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User as UserIcon,
  Settings,
  Users,
  Bookmark,
  Shield,
  Users2,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { useFriends } from '@/features/friends/hooks/useFriends';
import { useBookmarks } from '@/features/bookmark/hooks/useBookmarks';
import { useMyGroups } from '@/features/groups/hooks/useMyGroups';
import { UserProfileResponse } from '@/features/friends/types/friends.types';
import { User } from '@/types/user.types';
import {
  SectionSidebar,
  SidebarNavItem,
} from '@/components/navigation/SectionSidebar';

export interface ProfileSidebarProps {
  activeId?: string;
  targetUser?: UserProfileResponse | User | null;
  baseUrl?: string;
}

export function ProfileSidebar({
  activeId,
  targetUser,
  baseUrl,
}: ProfileSidebarProps) {
  const { locale } = useLanguage();
  const { user: authUser, isAuthenticated, isAdmin } = useAuth();

  const displayUser = targetUser || authUser;
  const isOwner = Boolean(
    !targetUser ||
      (authUser &&
        targetUser &&
        (authUser.id === targetUser.id || authUser.username === targetUser.username))
  );

  const effectiveBaseUrl =
    baseUrl ||
    (isOwner
      ? '/profile'
      : displayUser?.username
        ? `/${displayUser.username}`
        : '/profile');

  const { data: friendsData } = useFriends(undefined, isAuthenticated && isOwner);
  const { data: bookmarkData } = useBookmarks({ limit: 1 });
  const { data: myGroupsData } = useMyGroups({ limit: 10 });

  const totalFriends =
    friendsData?.pages.flatMap((page) => page?.items || []).length;
  const totalBookmarks = bookmarkData?.meta?.total;
  const myGroups =
    myGroupsData?.pages.flatMap((page) => page?.items || []) || [];

  const navItems: SidebarNavItem[] = [
    {
      id: 'profile-overview',
      label: locale === 'bn' ? 'প্রোফাইল' : 'Overview',
      href: effectiveBaseUrl,
      icon: UserIcon,
      iconBg: 'bg-primary-500 text-white',
      exact: true,
    },
    {
      id: 'profile-friends',
      label: isOwner
        ? (locale === 'bn' ? 'আমার বন্ধুরা' : 'Friends')
        : (locale === 'bn' ? 'বন্ধুরা' : 'Friends'),
      href: `${effectiveBaseUrl}?tab=friend&from=nav`,
      icon: Users,
      iconBg: 'bg-indigo-600 text-white',
      count:
        isOwner && typeof totalFriends === 'number' && totalFriends > 0
          ? totalFriends
          : undefined,
    },
    {
      id: 'profile-groups',
      label: isOwner
        ? (locale === 'bn' ? 'আমার গ্রুপসমূহ' : 'My Groups')
        : (locale === 'bn' ? 'গ্রুপসমূহ' : 'Groups'),
      href: `${effectiveBaseUrl}?tab=group&from=nav`,
      icon: Users2,
      iconBg: 'bg-teal-500 text-white',
      count: isOwner && myGroups.length > 0 ? myGroups.length : undefined,
    },
    ...(isOwner
      ? [
          {
            id: 'profile-saved',
            label: locale === 'bn' ? 'সংরক্ষিত আইটেম' : 'Saved Bookmarks',
            href: `${effectiveBaseUrl}?tab=saved&from=nav`,
            icon: Bookmark,
            iconBg: 'bg-purple-600 text-white',
            count:
              typeof totalBookmarks === 'number' && totalBookmarks > 0
                ? totalBookmarks
                : undefined,
          },
          ...(isAdmin
            ? [
                {
                  id: 'profile-admin',
                  label: locale === 'bn' ? 'এডমিন ড্যাশবোর্ড' : 'Admin Panel',
                  href: ROUTES.ADMIN.HOME,
                  icon: Shield,
                  iconBg: 'bg-amber-500 text-white',
                },
              ]
            : []),
          {
            id: 'profile-settings',
            label: locale === 'bn' ? 'অ্যাকাউন্ট ও সেটিংস' : 'Privacy & Settings',
            href: ROUTES.SETTINGS,
            icon: Settings,
            iconBg: 'bg-gray-600 text-white',
          },
        ]
      : []),
  ];

  const userHeader = displayUser ? (
    <Link
      href={effectiveBaseUrl}
      className="items-center gap-3 p-3 rounded-2xl bg-[#e4e6eb]/60 hover:bg-[#e4e6eb] dark:bg-[#3a3b3c]/60 dark:hover:bg-[#3a3b3c] mb-2 shadow-2xs transition-colors block"
      title={locale === 'bn' ? 'প্রোফাইল দেখুন' : 'View Profile'}
    >
      <div className="relative h-11 w-11 shrink-0 rounded-full bg-primary-500 text-white font-bold text-base flex items-center justify-center overflow-hidden shadow-xs">
        {displayUser.avatarUrl ? (
          <Image
            src={displayUser.avatarUrl}
            alt={displayUser.name || 'User'}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span>{displayUser.name?.charAt(0) || 'P'}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm text-[#050505] dark:text-white truncate">
          {displayUser.name}
        </p>
        <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] truncate">
          {displayUser.username ? `@${displayUser.username}` : (displayUser as any).email || ''}
        </p>
      </div>
    </Link>
  ) : null;

  return (
    <SectionSidebar
      title={locale === 'bn' ? 'প্রোফাইল' : 'Profile'}
      backHref="/"
      items={navItems}
      extraHeader={userHeader}
      activeId={activeId}
    />
  );
}
