'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserCheck, X, Clock, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
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
  } = useFriendActions();
  const { locale } = useLanguage();

  const [cardStatus, setCardStatus] = useState<'idle' | 'accepted' | 'rejected' | 'cancelled'>('idle');

  const displayUser = variant === 'received' ? request.sender : request.receiver;
  if (!displayUser) return null;

  const profileUrl = ROUTES.USER_PROFILE(displayUser.username);

  // Accept received request immediately without loading delay
  const handleAccept = () => {
    setCardStatus('accepted');
    acceptRequest(request.id, displayUser.id).catch((err) => {
      console.error('Failed to accept request:', err);
      setCardStatus('idle');
    });
  };

  // Reject received request immediately without loading delay
  const handleReject = () => {
    setCardStatus('rejected');
    rejectRequest(request.id, displayUser.id).catch((err) => {
      console.error('Failed to reject request:', err);
      setCardStatus('idle');
    });
  };

  // Cancel sent request immediately without loading delay
  const handleCancel = () => {
    setCardStatus('cancelled');
    cancelRequest(request.id, displayUser.id).catch((err) => {
      console.error('Failed to cancel request:', err);
      setCardStatus('idle');
    });
  };

  return (
    <Card className="flex flex-col justify-between overflow-hidden border border-[#e4e6eb] bg-white rounded-2xl shadow-2xs hover:shadow-md transition-all duration-200 dark:border-[#393a3b] dark:bg-[#242526]">
      {/* Top Cover / Large Avatar */}
      <Link
        href={profileUrl}
        className="block relative bg-gradient-to-br from-primary-500 via-teal-600 to-primary-700 aspect-[4/3] flex items-center justify-center group overflow-hidden"
      >
        {displayUser.avatar ? (
          <Image
            src={displayUser.avatar}
            alt={displayUser.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs text-white text-3xl font-black shadow-lg group-hover:scale-110 transition-transform">
            {displayUser.name?.charAt(0) || 'U'}
          </div>
        )}
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

        {/* Action Buttons or Immediate Feedback Status */}
        <div className="space-y-2 pt-1">
          {cardStatus === 'accepted' ? (
            <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm">
              <Check className="h-4 w-4" />
              <span>{locale === 'bn' ? 'কনফার্ম করা হয়েছে' : 'Confirmed'}</span>
            </div>
          ) : cardStatus === 'rejected' ? (
            <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-[#65676b] dark:text-[#b0b3b8] font-medium text-xs">
              <span>{locale === 'bn' ? 'রিকোয়েস্ট মুছে ফেলা হয়েছে' : 'Request removed'}</span>
            </div>
          ) : cardStatus === 'cancelled' ? (
            <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-[#65676b] dark:text-[#b0b3b8] font-medium text-xs">
              <span>{locale === 'bn' ? 'রিকোয়েস্ট বাতিল করা হয়েছে' : 'Request cancelled'}</span>
            </div>
          ) : variant === 'received' ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAccept}
                isLoading={false}
                className="w-full font-bold text-sm h-9 rounded-xl shadow-xs"
                aria-label={`Confirm request from ${displayUser.name}`}
              >
                <UserCheck className="mr-1.5 h-4 w-4" />
                <span>{locale === 'bn' ? 'কনফার্ম' : 'Confirm'}</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleReject}
                isLoading={false}
                className="w-full font-bold text-sm h-9 rounded-xl bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] dark:text-[#e4e6eb]"
                aria-label={`Delete request from ${displayUser.name}`}
              >
                <span>{locale === 'bn' ? 'ডিলিট' : 'Delete'}</span>
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#65676b] dark:text-[#b0b3b8] py-0.5">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>{locale === 'bn' ? 'রিকোয়েস্ট পাঠানো হয়েছে' : 'Request Sent'}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                isLoading={false}
                className="w-full text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 h-9 rounded-xl"
                aria-label={`Cancel request sent to ${displayUser.name}`}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                <span>{locale === 'bn' ? 'রিকোয়েস্ট বাতিল' : 'Cancel Request'}</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
