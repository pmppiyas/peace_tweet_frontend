'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LogoutConfirmModal } from '@/components/common/LogoutConfirmModal';
import {
  User,
  Settings,
  Users,
  Bookmark,
  Shield,
  LogOut,
  Users2,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { usePendingRequestsCount } from '@/features/friends/hooks/useFriendRequests';
import { useBookmarks } from '@/features/bookmark/hooks/useBookmarks';
import { useMyGroups } from '@/features/groups/hooks/useMyGroups';
import {
  SectionSidebar,
  SidebarNavItem,
} from '@/components/navigation/SectionSidebar';

export interface ProfileSidebarProps {
  activeId?: string;
}

export function ProfileSidebar({ activeId }: ProfileSidebarProps) {
  const { locale } = useLanguage();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { data: requestCount = 0 } = usePendingRequestsCount(isAuthenticated);
  const { data: bookmarkData } = useBookmarks({ limit: 1 });
  const { data: myGroupsData } = useMyGroups({ limit: 10 });

  const totalBookmarks = bookmarkData?.meta?.total;
  const myGroups =
    myGroupsData?.pages.flatMap((page) => page?.items || []) || [];

  const navItems: SidebarNavItem[] = [
    {
      id: 'profile-overview',
      label: locale === 'bn' ? 'প্রোফাইল' : 'Overview',
      href: ROUTES.PROFILE,
      icon: User,
      iconBg: 'bg-primary-500 text-white',
      exact: true,
    },

    {
      id: 'profile-friends',
      label: locale === 'bn' ? 'আমার বন্ধুরা' : 'Friends',
      href: ROUTES.FRIENDS.LIST,
      icon: Users,
      iconBg: 'bg-indigo-600 text-white',
      count: requestCount > 0 ? requestCount : undefined,
    },
    {
      id: 'profile-groups',
      label: locale === 'bn' ? 'আমার গ্রুপসমূহ' : 'My Groups',
      href: '/groups?tab=my-groups',
      icon: Users2,
      iconBg: 'bg-teal-500 text-white',
      count: myGroups.length > 0 ? myGroups.length : undefined,
    },
    {
      id: 'profile-saved',
      label: locale === 'bn' ? 'সংরক্ষিত আইটেম' : 'Saved Bookmarks',
      href: ROUTES.SAVED,
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
  ];

  const userHeader = user ? (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#e4e6eb]/60 dark:bg-[#3a3b3c]/60 mb-2 shadow-2xs">
      <div className="relative h-11 w-11 shrink-0 rounded-full bg-primary-500 text-white font-bold text-base flex items-center justify-center overflow-hidden shadow-xs">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name || 'User'}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span>{user.name?.charAt(0) || 'P'}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm text-[#050505] dark:text-white truncate">
          {user.name}
        </p>
        <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] truncate">
          {user.username ? `@${user.username}` : user.email}
        </p>
      </div>
    </div>
  ) : null;

  const logoutFooter = isAuthenticated ? (
    <button
      type="button"
      onClick={() => setShowLogoutModal(true)}
      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600">
        <LogOut className="h-4 w-4" />
      </div>
      <span>{locale === 'bn' ? 'লগআউট করুন' : 'Log Out'}</span>
    </button>
  ) : undefined;

  return (
    <>
      <SectionSidebar
        title={locale === 'bn' ? 'প্রোফাইল' : 'Profile'}
        backHref="/"
        items={navItems}
        extraHeader={userHeader}
        footer={logoutFooter}
        activeId={activeId}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
}
