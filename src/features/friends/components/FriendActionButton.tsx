'use client';

import React, { useState } from 'react';
import { UserPlus, UserCheck, Clock, Check, X, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
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

  if (status === 'SELF') {
    return null;
  }

  const handleSend = async () => {
    try {
      await sendRequest(userId);
    } catch {}
  };

  const handleCancel = async () => {
    if (!requestId) return;
    try {
      await cancelRequest(requestId, userId);
    } catch {}
  };

  const handleAccept = async () => {
    if (!requestId) return;
    try {
      await acceptRequest(requestId, userId);
    } catch {}
  };

  // Handle Reject Received Request directly without confirmation dialog
  const handleReject = async () => {
    if (!requestId) return;
    try {
      await rejectRequest(requestId, userId);
    } catch {}
  };

  const handleConfirmUnfriend = async () => {
    try {
      await unfriend(userId);
      setIsUnfriendModalOpen(false);
    } catch {}
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
            <span>Add Friend</span>
          </Button>
        )}

        {status === 'PENDING_SENT' && (
          <Button
            variant="outline"
            size={size}
            onClick={handleCancel}
            isLoading={isCancelling}
            disabled={isCancelling}
            className={className}
            aria-label="Cancel sent friend request"
            title="Click to cancel request"
          >
            <Clock className="mr-1.5 h-4 w-4 text-amber-500" />
            <span>Request Sent</span>
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
              <span>Accept</span>
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
              <span className="sr-only sm:not-sr-only sm:ml-1">Reject</span>
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
        title="Remove friend?"
        description={`Are you sure you want to remove ${username ? `@${username}` : 'this user'} from your friends list?`}
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsUnfriendModalOpen(false)}
            disabled={isUnfriending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmUnfriend}
            isLoading={isUnfriending}
          >
            <UserMinus className="mr-1.5 h-4 w-4" />
            <span>Remove Friend</span>
          </Button>
        </div>
      </Modal>
    </>
  );
}
