import { FriendshipStatus } from '../types/friends.types';

export interface FriendshipStatusConfig {
  label: string;
  labelBn: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gold';
  actionable: boolean;
}

export const FRIENDSHIP_STATUS_CONFIG: Record<FriendshipStatus, FriendshipStatusConfig> = {
  NONE: {
    label: 'Add Friend',
    labelBn: 'বন্ধু যোগ করুন',
    variant: 'primary',
    actionable: true,
  },
  PENDING_SENT: {
    label: 'Request Sent',
    labelBn: 'রিকোয়েস্ট পাঠানো হয়েছে',
    variant: 'outline',
    actionable: true,
  },
  PENDING_RECEIVED: {
    label: 'Accept Request',
    labelBn: 'রিকোয়েস্ট গ্রহণ করুন',
    variant: 'primary',
    actionable: true,
  },
  FRIENDS: {
    label: 'Friends',
    labelBn: 'বন্ধু',
    variant: 'secondary',
    actionable: true,
  },
  SELF: {
    label: 'You',
    labelBn: 'আপনি',
    variant: 'ghost',
    actionable: false,
  },
};

// Check if user can send a request
export function canSendRequest(status?: FriendshipStatus): boolean {
  return status === 'NONE';
}

// Check if relationship is active friends
export function isFriends(status?: FriendshipStatus): boolean {
  return status === 'FRIENDS';
}

// Check if request is sent by viewer
export function isPendingSent(status?: FriendshipStatus): boolean {
  return status === 'PENDING_SENT';
}

// Check if request is received by viewer
export function isPendingReceived(status?: FriendshipStatus): boolean {
  return status === 'PENDING_RECEIVED';
}
