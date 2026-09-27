'use client';

import React from 'react';
import { Calendar, Mail, Shield, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/date';
import { useLanguage } from '@/providers/LanguageProvider';
import { useUserProfile } from '@/features/friends/hooks/useFriendshipStatus';
import { FriendActionButton } from '@/features/friends/components/FriendActionButton';
import { FriendshipStatusBadge } from '@/features/friends/components/FriendshipStatus';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export interface PublicProfileViewProps {
  username: string;
}

export function PublicProfileView({ username }: PublicProfileViewProps) {
  const { locale } = useLanguage();
  const { data: profile, isLoading, isError, refetch } = useUserProfile(username);

  // Loading state
  if (isLoading) {
    return (
      <Card className="border border-[#e4e6eb] bg-white rounded-2xl p-6 dark:border-[#393a3b] dark:bg-[#242526] space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#f0f2f5] dark:border-[#3a3b3c]">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </Card>
    );
  }

  // Error / Not Found state
  if (isError || !profile) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#e4e6eb] bg-white rounded-3xl dark:border-[#393a3b] dark:bg-[#242526]">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <User className="h-8 w-8" />
        </div>
        <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
          {locale === 'bn' ? 'ব্যবহারকারী পাওয়া যায়নি' : 'User not found'}
        </h3>
        <p className="mt-1.5 max-w-sm text-xs text-[#65676b] dark:text-[#b0b3b8]">
          {locale === 'bn'
            ? `(@${username}) নামের কোনো ব্যবহারকারী পাওয়া যায়নি বা প্রোফাইলটি মুছে ফেলা হয়েছে।`
            : `The user @${username} does not exist or has been removed.`}
        </p>
        <div className="mt-5 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {locale === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
          </Button>
          <Link href={ROUTES.HOME}>
            <Button variant="primary" size="sm">
              {locale === 'bn' ? 'হোম পেজে যান' : 'Go Home'}
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  const relationshipStatus = profile.friendship?.status || 'NONE';
  const requestId = profile.friendship?.requestId;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card className="border border-[#e4e6eb] bg-white shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] rounded-2xl overflow-hidden">
        {/* Profile Header */}
        <CardHeader className="text-center pb-5 border-b border-[#e4e6eb] dark:border-[#393a3b]">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-white text-3xl font-black shadow-sm">
            {profile.name?.charAt(0) || 'U'}
          </div>

          <CardTitle className="text-xl font-black text-[#050505] dark:text-white">
            {profile.name}
          </CardTitle>
          <CardDescription className="text-sm font-medium">@{profile.username}</CardDescription>

          {/* Badges */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <Badge variant={profile.role === 'ADMIN' ? 'gold' : 'emerald'}>
              {profile.role === 'ADMIN' ? 'Administrator' : 'Community Member'}
            </Badge>

            {relationshipStatus !== 'NONE' && relationshipStatus !== 'SELF' && (
              <FriendshipStatusBadge status={relationshipStatus} />
            )}
          </div>

          {/* Relationship-Aware Action Button */}
          {relationshipStatus !== 'SELF' && (
            <div className="pt-4 flex justify-center">
              <FriendActionButton
                userId={profile.id}
                username={profile.username}
                status={relationshipStatus}
                requestId={requestId}
                size="md"
              />
            </div>
          )}
        </CardHeader>

        {/* Profile Info Details */}
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {profile.email && (
              <div className="flex items-center gap-3 rounded-xl bg-[#f0f2f5] p-3.5 dark:bg-[#3a3b3c]">
                <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">Email</p>
                  <p className="font-semibold text-[#050505] dark:text-[#e4e6eb] truncate">
                    {profile.email}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 rounded-xl bg-[#f0f2f5] p-3.5 dark:bg-[#3a3b3c]">
              <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                  {locale === 'bn' ? 'যুক্ত হয়েছেন' : 'Member Since'}
                </p>
                <p className="font-semibold text-[#050505] dark:text-[#e4e6eb] truncate">
                  {profile.createdAt ? formatDate(profile.createdAt) : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
