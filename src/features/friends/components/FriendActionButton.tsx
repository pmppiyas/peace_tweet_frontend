'use client';

import React, { useState, useEffect } from 'react';
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
  onStatusChange,
}: FriendActionButtonProps) {
  const {
    sendRequest,
    cancelRequest,
    acceptRequest,
    rejectRequest,
    unfriend,
  } = useFriendActions();
  const { locale } = useLanguage();

  const [localStatus, setLocalStatus] = useState<FriendshipStatus>(status);
  const [localRequestId, setLocalRequestId] = useState<string | null>(requestId || null);
  const [isUnfriendModalOpen, setIsUnfriendModalOpen] = useState(false);

  // Sync with prop updates from outside
  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  useEffect(() => {
    if (requestId !== undefined) {
      setLocalRequestId(requestId);
    }
  }, [requestId]);

  if (localStatus === 'SELF') {
    return null;
  }

  // 1. Send Request: NONE -> PENDING_SENT immediately
  const handleSend = () => {
    const prevStatus = localStatus;
    const prevReqId = localRequestId;

    // Instant optimistic update (zero spinner, immediate text change)
    setLocalStatus('PENDING_SENT');
    onStatusChange?.('PENDING_SENT');

    // Run network processing in the background
    sendRequest(userId)
      .then((res: any) => {
        const newId = res?.data?.id || res?.id;
        if (newId) {
          setLocalRequestId(newId);
        }
      })
      .catch((err) => {
        console.error('Failed to send friend request:', err);
        setLocalStatus(prevStatus);
        setLocalRequestId(prevReqId);
        onStatusChange?.(prevStatus);
      });
  };

  // 2. Cancel Request: PENDING_SENT -> NONE immediately
  const handleCancel = () => {
    const prevStatus = localStatus;
    const prevReqId = localRequestId;

    // Instant optimistic update
    setLocalStatus('NONE');
    setLocalRequestId(null);
    onStatusChange?.('NONE');

    const targetReqId = prevReqId || requestId || userId;
    cancelRequest(targetReqId, userId).catch((err) => {
      console.error('Failed to cancel friend request:', err);
      setLocalStatus(prevStatus);
      setLocalRequestId(prevReqId);
      onStatusChange?.(prevStatus);
    });
  };

  // 3. Accept Request: PENDING_RECEIVED -> FRIENDS immediately
  const handleAccept = () => {
    const prevStatus = localStatus;
    const prevReqId = localRequestId;

    // Instant optimistic update
    setLocalStatus('FRIENDS');
    setLocalRequestId(null);
    onStatusChange?.('FRIENDS');

    const targetReqId = prevReqId || requestId || userId;
    acceptRequest(targetReqId, userId).catch((err) => {
      console.error('Failed to accept friend request:', err);
      setLocalStatus(prevStatus);
      setLocalRequestId(prevReqId);
      onStatusChange?.(prevStatus);
    });
  };

  // 4. Reject Request: PENDING_RECEIVED -> NONE immediately
  const handleReject = () => {
    const prevStatus = localStatus;
    const prevReqId = localRequestId;

    // Instant optimistic update
    setLocalStatus('NONE');
    setLocalRequestId(null);
    onStatusChange?.('NONE');

    const targetReqId = prevReqId || requestId || userId;
    rejectRequest(targetReqId, userId).catch((err) => {
      console.error('Failed to reject friend request:', err);
      setLocalStatus(prevStatus);
      setLocalRequestId(prevReqId);
      onStatusChange?.(prevStatus);
    });
  };

  // 5. Unfriend: FRIENDS -> NONE immediately
  const handleConfirmUnfriend = () => {
    setIsUnfriendModalOpen(false);
    const prevStatus = localStatus;

    // Instant optimistic update
    setLocalStatus('NONE');
    setLocalRequestId(null);
    onStatusChange?.('NONE');

    unfriend(userId).catch((err) => {
      console.error('Failed to unfriend user:', err);
      setLocalStatus(prevStatus);
      onStatusChange?.(prevStatus);
    });
  };

  return (
    <>
      <div className="inline-flex items-center gap-2">
        {localStatus === 'NONE' && (
          <Button
            variant="primary"
            size={size}
            onClick={handleSend}
            isLoading={false}
            className={className}
            aria-label="Send friend request"
          >
            <UserPlus className="mr-1.5 h-4 w-4" />
            <span>Add Friend</span>
          </Button>
        )}

        {localStatus === 'PENDING_SENT' && (
          <Button
            variant="outline"
            size={size}
            onClick={handleCancel}
            isLoading={false}
            className={className}
            aria-label="Cancel sent friend request"
            title="Click to cancel request"
          >
            <Clock className="mr-1.5 h-4 w-4 text-amber-500" />
            <span>Request Sent</span>
          </Button>
        )}

        {localStatus === 'PENDING_RECEIVED' && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="primary"
              size={size}
              onClick={handleAccept}
              isLoading={false}
              className={className}
              aria-label="Confirm friend request"
            >
              <UserCheck className="mr-1.5 h-4 w-4" />
              <span>{locale === 'bn' ? 'কনফার্ম' : 'Confirm'}</span>
            </Button>
            <Button
              variant="outline"
              size={size}
              onClick={handleReject}
              isLoading={false}
              aria-label="Delete friend request"
            >
              <X className="h-4 w-4 text-gray-500" />
              <span className="sr-only sm:not-sr-only sm:ml-1">{locale === 'bn' ? 'ডিলিট' : 'Delete'}</span>
            </Button>
          </div>
        )}

        {localStatus === 'FRIENDS' && (
          <Button
            variant="secondary"
            size={size}
            onClick={() => setIsUnfriendModalOpen(true)}
            isLoading={false}
            className={className}
            aria-label="Remove friend"
            title="Click to unfriend"
          >
            <Check className="mr-1.5 h-4 w-4 text-primary-500" />
            <span>Friends</span>
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
            ? `আপনি কি নিশ্চিত যে ${username ? `@${username}` : 'এই ব্যবহারকারী'}-কে আপনার বন্ধু তালিকা থেকে বাদ দিতে চান?`
            : `Are you sure you want to remove ${username ? `@${username}` : 'this user'} from your friends list?`
        }
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsUnfriendModalOpen(false)}
          >
            {locale === 'bn' ? 'ফিরে যান' : 'Cancel'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmUnfriend}
            isLoading={false}
          >
            <UserMinus className="mr-1.5 h-4 w-4" />
            <span>{locale === 'bn' ? 'আনফ্রেন্ড করুন' : 'Remove Friend'}</span>
          </Button>
        </div>
      </Modal>
    </>
  );
}
