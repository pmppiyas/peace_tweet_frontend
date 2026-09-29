'use client';

import React, { useState } from 'react';
import { UserPlus, UserCheck, Clock, Check, X, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useLanguage } from '@/providers/LanguageProvider';
import { useFriendActions } from '../hooks/useFriendActions';
import { FriendshipStatus } from '../types/friends.types';

export interface FriendActionButtonProps {
  userId: string;
  username?: string;
  status: FriendshipStatus;
  requestId?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onStatusChange?: (newStatus: FriendshipStatus) => void;
}

export function FriendActionButton({
  userId,
  username,
  status,
  requestId,
  size = 'md',
  className,
}: FriendActionButtonProps) {
  const { locale } = useLanguage();
  const {
    sendRequest,
    cancelRequest,
    acceptRequest,
    rejectRequest,
    unfriend,
    isSending,
    isCancelling,
    isAccepting,
    isRejecting,
    isUnfriending,
  } = useFriendActions();

  const [isUnfriendModalOpen, setIsUnfriendModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // If viewing self, do not display action button
  if (status === 'SELF') {
    return null;
  }

  // Handle Send Friend Request
  const handleSend = async () => {
    try {
      await sendRequest(userId);
    } catch {
      // Handled in mutation
    }
  };

  // Handle Cancel Sent Request
  const handleConfirmCancel = async () => {
    if (!requestId) return;
    try {
      await cancelRequest(requestId, userId);
      setIsCancelModalOpen(false);
    } catch {
      // Handled in mutation
    }
  };

  // Handle Accept Received Request
  const handleAccept = async () => {
    if (!requestId) return;
    try {
      await acceptRequest(requestId, userId);
    } catch {
      // Handled in mutation
    }
  };

  // Handle Reject Received Request
  const handleReject = async () => {
    if (!requestId) return;
    try {
      await rejectRequest(requestId, userId);
    } catch {
      // Handled in mutation
    }
  };

  // Handle Unfriend
  const handleConfirmUnfriend = async () => {
    try {
      await unfriend(userId);
      setIsUnfriendModalOpen(false);
    } catch {
      // Handled in mutation
    }
  };

  return (
    <>
      <div className="inline-flex items-center gap-2">
        {status === 'NONE' && (
          <Button
            variant="primary"
            size={size}
            onClick={handleSend}
            isLoading={isSending}
            disabled={isSending}
            className={className}
            aria-label="Send friend request"
          >
            <UserPlus className="mr-1.5 h-4 w-4" />
            <span>{locale === 'bn' ? 'বন্ধু যোগ করুন' : 'Add Friend'}</span>
          </Button>
        )}

        {status === 'PENDING_SENT' && (
          <Button
            variant="outline"
            size={size}
            onClick={() => setIsCancelModalOpen(true)}
            isLoading={isCancelling}
            disabled={isCancelling}
            className={className}
            aria-label="Cancel sent friend request"
            title={locale === 'bn' ? 'রিকোয়েস্ট বাতিল করতে ক্লিক করুন' : 'Click to cancel request'}
          >
            <Clock className="mr-1.5 h-4 w-4 text-amber-500" />
            <span>{locale === 'bn' ? 'রিকোয়েস্ট পাঠানো হয়েছে' : 'Request Sent'}</span>
          </Button>
        )}

        {status === 'PENDING_RECEIVED' && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="primary"
              size={size}
              onClick={handleAccept}
              isLoading={isAccepting}
              disabled={isAccepting || isRejecting}
              className={className}
              aria-label="Accept friend request"
            >
              <UserCheck className="mr-1.5 h-4 w-4" />
              <span>{locale === 'bn' ? 'গ্রহণ করুন' : 'Accept'}</span>
            </Button>
            <Button
              variant="outline"
              size={size}
              onClick={handleReject}
              isLoading={isRejecting}
              disabled={isAccepting || isRejecting}
              aria-label="Reject friend request"
            >
              <X className="h-4 w-4 text-gray-500" />
              <span className="sr-only sm:not-sr-only sm:ml-1">
                {locale === 'bn' ? 'বাতিল' : 'Reject'}
              </span>
            </Button>
          </div>
        )}

        {status === 'FRIENDS' && (
          <Button
            variant="secondary"
            size={size}
            onClick={() => setIsUnfriendModalOpen(true)}
            isLoading={isUnfriending}
            disabled={isUnfriending}
            className={className}
            aria-label="Remove friend"
            title={locale === 'bn' ? 'আনফ্রেন্ড করতে ক্লিক করুন' : 'Click to unfriend'}
          >
            <Check className="mr-1.5 h-4 w-4 text-primary-500" />
            <span>{locale === 'bn' ? 'বন্ধু' : 'Friends'}</span>
          </Button>
        )}
      </div>

      {/* Unfriend Confirmation Dialog */}
      <Modal
        isOpen={isUnfriendModalOpen}
        onClose={() => setIsUnfriendModalOpen(false)}
        title={locale === 'bn' ? 'বন্ধু তালিকা থেকে বাদ দিতে চান?' : 'Remove friend?'}
        description={
          locale === 'bn'
            ? `আপনি কি নিশ্চিত যে ${username ? `@${username}` : 'এই ব্যবহারকারীকে'} আপনার বন্ধু তালিকা থেকে বাদ দিতে চান?`
            : `Are you sure you want to remove ${username ? `@${username}` : 'this user'} from your friends list?`
        }
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsUnfriendModalOpen(false)}
            disabled={isUnfriending}
          >
            {locale === 'bn' ? 'ফিরে যান' : 'Cancel'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmUnfriend}
            isLoading={isUnfriending}
          >
            <UserMinus className="mr-1.5 h-4 w-4" />
            <span>{locale === 'bn' ? 'আনফ্রেন্ড করুন' : 'Remove Friend'}</span>
          </Button>
        </div>
      </Modal>

      {/* Cancel Request Confirmation Dialog */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title={locale === 'bn' ? 'রিকোয়েস্ট বাতিল করবেন?' : 'Cancel friend request?'}
        description={
          locale === 'bn'
            ? 'আপনি কি পাঠানো এই ফ্রেন্ড রিকোয়েস্টটি বাতিল করতে চান?'
            : 'Are you sure you want to cancel this sent friend request?'
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
    </>
  );
}
