'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, UserPlus, Users } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useReceivedFriendRequests } from '../hooks/useFriendRequests';
import { useFriends } from '../hooks/useFriends';
import { FriendRequestCard } from './FriendRequestCard';
import { FriendCard } from './FriendCard';
import { FriendRequestSkeleton, FriendCardSkeleton } from './FriendsPageSkeleton';
import { FriendsEmptyState } from './FriendsEmptyState';

export function FriendsHomeView() {
  const { locale } = useLanguage();
  const {
    data: requestsData,
    isLoading: isRequestsLoading,
  } = useReceivedFriendRequests();

  const {
    data: friendsData,
    isLoading: isFriendsLoading,
  } = useFriends();

  const receivedRequests =
    requestsData?.pages?.flatMap((page) => page?.items || []) || [];

  const friends =
    friendsData?.pages?.flatMap((page) => page?.items || []) || [];

  const topRequests = receivedRequests.slice(0, 8);
  const topFriends = friends.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* 1. Friend Requests Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#050505] dark:text-white">
              {locale === 'bn' ? 'ফ্রেন্ড রিকোয়েস্ট' : 'Friend Requests'}
            </h2>
            {receivedRequests.length > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                {receivedRequests.length}
              </span>
            )}
          </div>

          {receivedRequests.length > 0 && (
            <Link
              href={ROUTES.FRIENDS.REQUESTS}
              className="text-sm font-bold text-primary-500 hover:text-primary-600 hover:underline dark:text-primary-400 flex items-center gap-1"
            >
              <span>{locale === 'bn' ? 'সব দেখুন' : 'See all'}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {isRequestsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <FriendRequestSkeleton key={i} />
            ))}
          </div>
        ) : receivedRequests.length === 0 ? (
          <FriendsEmptyState type="received" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {topRequests.map((request) => (
              <FriendRequestCard key={request.id} request={request} variant="received" />
            ))}
          </div>
        )}
      </section>

      {/* 2. All Friends Section */}
      <section className="space-y-4 pt-4 border-t border-[#e4e6eb] dark:border-[#393a3b]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-[#050505] dark:text-white">
            {locale === 'bn' ? 'আপনার বন্ধুরা' : 'All Friends'}
          </h2>

          {friends.length > 0 && (
            <Link
              href={ROUTES.FRIENDS.LIST}
              className="text-sm font-bold text-primary-500 hover:text-primary-600 hover:underline dark:text-primary-400 flex items-center gap-1"
            >
              <span>{locale === 'bn' ? 'সব দেখুন' : 'See all'}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {isFriendsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <FriendCardSkeleton key={i} />
            ))}
          </div>
        ) : friends.length === 0 ? (
          <FriendsEmptyState type="friends" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {topFriends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
