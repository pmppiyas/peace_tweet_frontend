'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserCheck, X, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useFriendActions } from '../hooks/useFriendActions';
import { FriendRequestItem } from '../types/friends.types';

export interface FriendRequestCardProps {
  request: FriendRequestItem;
  variant: 'received' | 'sent';
}

export function FriendRequestCard({ request, variant }: FriendRequestCardProps) {
  const {
    acceptRequest,
    rejectRequest,
    cancelRequest,
    isAccepting,
    isRejecting,
    isCancelling,
  } = useFriendActions();

  const [activeAction, setActiveAction] = useState<'accept' | 'reject' | null>(null);

  const displayUser = variant === 'received' ? request.sender : request.receiver;
  if (!displayUser) return null;

  const profileUrl = ROUTES.USER_PROFILE(displayUser.username);

  // Accept received request immediately without confirmation dialog
  const handleAccept = async () => {
    setActiveAction('accept');
    try {
      await acceptRequest(request.id, displayUser.id);
    } finally {
      setActiveAction(null);
    }
  };

  // Reject received request immediately without confirmation dialog
  const handleReject = async () => {
    setActiveAction('reject');
    try {
      await rejectRequest(request.id, displayUser.id);
    } finally {
      setActiveAction(null);
    }
  };

  // Cancel sent request immediately without confirmation dialog
  const handleCancel = async () => {
    try {
      await cancelRequest(request.id, displayUser.id);
    } catch {
      // Handled in mutation
    }
  };

  return (
    <Card className="flex flex-col justify-between overflow-hidden border border-[#e4e6eb] bg-white rounded-2xl shadow-2xs hover:shadow-md transition-all duration-200 dark:border-[#393a3b] dark:bg-[#242526]">
      {/* Top Cover / Large Avatar */}
      <Link
        href={profileUrl}
        className="block relative bg-gradient-to-br from-primary-500 via-teal-600 to-primary-700 aspect-[4/3] flex items-center justify-center group overflow-hidden"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs text-white text-3xl font-black shadow-lg group-hover:scale-110 transition-transform">
          {displayUser.name?.charAt(0) || 'U'}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link
            href={profileUrl}
            className="font-bold text-[16px] text-[#050505] hover:underline dark:text-white truncate block"
          >
            {displayUser.name}
          </Link>
          <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] truncate mt-0.5">
            @{displayUser.username}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {variant === 'received' ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAccept}
                isLoading={isAccepting && activeAction === 'accept'}
                disabled={isAccepting || isRejecting}
                className="w-full font-bold text-sm h-9 rounded-xl shadow-xs"
                aria-label={`Accept request from ${displayUser.name}`}
              >
                <UserCheck className="mr-1.5 h-4 w-4" />
                <span>Accept</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleReject}
                isLoading={isRejecting && activeAction === 'reject'}
                disabled={isAccepting || isRejecting}
                className="w-full font-bold text-sm h-9 rounded-xl bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] dark:text-[#e4e6eb]"
                aria-label={`Delete request from ${displayUser.name}`}
              >
                <span>Delete</span>
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#65676b] dark:text-[#b0b3b8] py-0.5">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>Request Sent</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                isLoading={isCancelling}
                disabled={isCancelling}
                className="w-full text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 h-9 rounded-xl"
                aria-label={`Cancel request sent to ${displayUser.name}`}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                <span>Cancel Request</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
