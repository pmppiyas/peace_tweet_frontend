'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LogoutConfirmModal } from '@/components/common/LogoutConfirmModal';
import { Mail, Calendar, LogOut, MapPin, Droplet, Settings } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { ROUTES } from '@/constants/routes';
import { BloodGroup } from '@/types/user.types';

const formatBloodGroup = (bg?: BloodGroup | null) => {
  if (!bg) return null;
  const map: Record<BloodGroup, string> = {
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-',
  };
  return map[bg] || bg;
};

export function ProfileView() {
  const { user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        User profile not found.
      </div>
    );
  }

  const bloodGroupLabel = formatBloodGroup(user.bloodGroup);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card className="border border-[#e4e6eb] bg-white shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-4 border-b border-[#e4e6eb] dark:border-[#393a3b]">
          {/* User Avatar */}
          <div className="relative mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border-2 border-primary-500/20 bg-primary-500 text-white shadow-xs">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-black">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <CardTitle className="text-lg font-bold">{user.name}</CardTitle>
          <CardDescription className="text-xs">@{user.username}</CardDescription>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <Badge variant={user.role === 'ADMIN' ? 'gold' : 'emerald'}>
              {user.role === 'ADMIN' ? 'Administrator' : 'Standard Member'}
            </Badge>

            {bloodGroupLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600 border border-red-200 dark:bg-red-950/60 dark:border-red-900 dark:text-red-300">
                <Droplet className="h-3 w-3 fill-red-500 text-red-500" />
                <span>Blood: {bloodGroupLabel}</span>
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl bg-[#f0f2f5] p-3.5 dark:bg-[#3a3b3c]">
              <Mail className="h-4 w-4 text-primary-500 dark:text-primary-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">Email Address</p>
                <p className="font-semibold text-[#050505] dark:text-[#e4e6eb] truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-[#f0f2f5] p-3.5 dark:bg-[#3a3b3c]">
              <Calendar className="h-4 w-4 text-primary-500 dark:text-primary-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">Member Since</p>
                <p className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
                  {user.createdAt ? formatDate(user.createdAt) : 'Today'}
                </p>
              </div>
            </div>

            {user.location && (
              <div className="flex items-center gap-3 rounded-xl bg-[#f0f2f5] p-3.5 dark:bg-[#3a3b3c] sm:col-span-2">
                <MapPin className="h-4 w-4 text-primary-500 dark:text-primary-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">Location</p>
                  <p className="font-semibold text-[#050505] dark:text-[#e4e6eb] truncate">{user.location}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#e4e6eb] dark:border-[#393a3b] flex flex-col sm:flex-row gap-2.5">
            <Link href={ROUTES.SETTINGS} className="flex-1">
              <Button
                variant="outline"
                className="w-full gap-2 rounded-xl font-bold border-[#e4e6eb] dark:border-[#393a3b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]"
              >
                <Settings className="h-4 w-4" />
                <span>Edit Profile & Settings</span>
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="gap-2 rounded-xl sm:w-auto"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>
  );
}
