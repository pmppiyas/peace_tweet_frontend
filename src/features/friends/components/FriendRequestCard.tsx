'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserCheck, X, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useFriendActions } from '../hooks/useFriendActions';
import { FriendRequestItem } from '../types/friends.types';

export interface FriendRequestCardProps {
  request: FriendRequestItem;
  variant: 'received' | 'sent';
}

export function FriendRequestCard({ request, variant }: FriendRequestCardProps) {
  const { locale } = useLanguage();
  const {
    acceptRequest,
    rejectRequest,
    cancelRequest,
    isAccepting,
    isRejecting,
    isCancelling,
  } = useFriendActions();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<'accept' | 'reject' | null>(null);

  const displayUser = variant === 'received' ? request.sender : request.receiver;
  if (!displayUser) return null;

  const profileUrl = ROUTES.USER_PROFILE(displayUser.username);

  // Accept received request
  const handleAccept = async () => {
    setActiveAction('accept');
    try {
      await acceptRequest(request.id, displayUser.id);
    } finally {
      setActiveAction(null);
    }
  };

  // Reject received request
  const handleReject = async () => {
    setActiveAction('reject');
    try {
      await rejectRequest(request.id, displayUser.id);
    } finally {
      setActiveAction(null);
    }
  };

  // Cancel sent request
  const handleConfirmCancel = async () => {
    try {
      await cancelRequest(request.id, displayUser.id);
      setIsCancelModalOpen(false);
    } catch {
      // Handled in mutation
    }
  };

  return (
    <>
      <Card className="flex flex-col justify-between overflow-hidden border border-[#e4e6eb] bg-white rounded-2xl shadow-2xs hover:shadow-md transition-all duration-200 dark:border-[#393a3b] dark:bg-[#242526]">
        {/* Top Cover / Large Avatar */}
        <Link href={profileUrl} className="block relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 aspect-[4/3] flex items-center justify-center group overflow-hidden">
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
                  aria-label={`Confirm request from ${displayUser.name}`}
                >
                  <UserCheck className="mr-1.5 h-4 w-4" />
                  <span>{locale === 'bn' ? 'কনফার্ম করুন' : 'Confirm'}</span>
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
                  <span>{locale === 'bn' ? 'ডিলিট করুন' : 'Delete'}</span>
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#65676b] dark:text-[#b0b3b8] py-0.5">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  <span>{locale === 'bn' ? 'অপেক্ষারত' : 'Request Sent'}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCancelModalOpen(true)}
                  isLoading={isCancelling}
                  disabled={isCancelling}
                  className="w-full text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 h-9 rounded-xl"
                  aria-label={`Cancel request sent to ${displayUser.name}`}
                >
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  <span>{locale === 'bn' ? 'বাতিল করুন' : 'Cancel Request'}</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Cancel Sent Request Modal */}
      {variant === 'sent' && (
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title={locale === 'bn' ? 'রিকোয়েস্ট বাতিল করবেন?' : 'Cancel friend request?'}
          description={
            locale === 'bn'
              ? `আপনি কি নিশ্চিত যে @${displayUser.username} এর কাছে পাঠানো ফ্রেন্ড রিকোয়েস্টটি বাতিল করতে চান?`
              : `Are you sure you want to cancel the friend request sent to @${displayUser.username}?`
          }
        >
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsCancelModalOpen(false)}
              disabled={isCancelling}
            >
              {locale === 'bn' ? 'না' : 'No'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              isLoading={isCancelling}
            >
              {locale === 'bn' ? 'হ্যাঁ, বাতিল করুন' : 'Yes, Cancel'}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
