'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  GroupDetail,
  GroupMembershipStatus,
  GroupVisibility,
} from '../types/groups.types';
import { useGroupActions } from '../hooks/useGroupActions';
import { useGroupMembership } from '../hooks/useGroupMembership';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { LeaveGroupDialog } from './LeaveGroupDialog';
import {
  Check,
  Clock,
  LogOut,
  Plus,
  Shield,
  ShieldAlert,
  Crown,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface GroupActionButtonProps {
  group: GroupDetail;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showManageLink?: boolean;
}

export function GroupActionButton({
  group,
  size = 'md',
  className,
}: GroupActionButtonProps) {
  const { locale } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { data: membershipData, isLoading: isLoadingMembership } =
    useGroupMembership(group.id);
  const {
    joinGroup,
    isJoining,
    cancelJoinRequest,
    isCancellingRequest,
    leaveGroup,
    isLeaving,
  } = useGroupActions(group);

  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Derive effective status
  const status: GroupMembershipStatus =
    membershipData?.status ||
    (group.isMember
      ? (group.currentUserRole as GroupMembershipStatus) || 'MEMBER'
      : group.isPending
        ? 'PENDING'
        : 'NONE');

  const role = membershipData?.role || group.currentUserRole;
  const isOwner = role === 'OWNER';

  const handleJoin = async () => {
    try {
      await joinGroup(group.id);
    } catch {
      // Error handled by mutation
    }
  };

  const handleCancelRequest = async () => {
    try {
      await cancelJoinRequest(group.id);
    } catch {
      // Error handled by mutation
    }
  };

  const handleConfirmLeave = async () => {
    try {
      await leaveGroup(group.id);
      setShowLeaveModal(false);
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoadingMembership && isAuthenticated) {
    return (
      <Button
        size={size === 'lg' ? 'md' : size}
        variant="secondary"
        isLoading
        className={cn('rounded-xl select-none', className)}
      >
        {locale === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}
      </Button>
    );
  }

  // 1. OWNER
  if (status === 'OWNER' || role === 'OWNER') {
    return (
      <div className="inline-flex items-center gap-1.5">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-700 border border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 select-none',
            className,
          )}
        >
          <Crown className="h-3.5 w-3.5" />
          <span>{locale === 'bn' ? 'প্রতিষ্ঠাতা (Owner)' : 'Owner'}</span>
        </span>
      </div>
    );
  }

  // 2. ADMIN
  if (status === 'ADMIN' || role === 'ADMIN') {
    return (
      <>
        <div className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 select-none',
              className,
            )}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{locale === 'bn' ? 'অ্যাডমিন (Admin)' : 'Admin'}</span>
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowLeaveModal(true)}
            className="text-xs text-gray-500 hover:text-rose-600 rounded-lg p-1.5"
            title={locale === 'bn' ? 'গ্রুপ ত্যাগ করুন' : 'Leave Group'}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <LeaveGroupDialog
          isOpen={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          onConfirm={handleConfirmLeave}
          groupName={group.name}
          isLeaving={isLeaving}
          isOwner={false}
        />
      </>
    );
  }

  // 3. MODERATOR
  if (status === 'MODERATOR' || role === 'MODERATOR') {
    return (
      <>
        <div className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-700 border border-blue-500/20 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 select-none',
              className,
            )}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>{locale === 'bn' ? 'মডারেটর (Moderator)' : 'Moderator'}</span>
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowLeaveModal(true)}
            className="text-xs text-gray-500 hover:text-rose-600 rounded-lg p-1.5"
            title={locale === 'bn' ? 'গ্রুপ ত্যাগ করুন' : 'Leave Group'}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <LeaveGroupDialog
          isOpen={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          onConfirm={handleConfirmLeave}
          groupName={group.name}
          isLeaving={isLeaving}
          isOwner={false}
        />
      </>
    );
  }

  // 4. MEMBER (Joined)
  if (status === 'MEMBER' || role === 'MEMBER') {
    return (
      <>
        <div className="inline-flex items-center gap-1.5">
          <Button
            type="button"
            size={size === 'lg' ? 'md' : size}
            variant="secondary"
            onClick={() => setShowLeaveModal(true)}
            className={cn(
              'rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 group transition-all',
              className,
            )}
          >
            <Check className="h-3.5 w-3.5 mr-1 group-hover:hidden" />
            <LogOut className="h-3.5 w-3.5 mr-1 hidden group-hover:inline" />
            <span className="group-hover:hidden">
              {locale === 'bn' ? 'যুক্ত আছেন' : 'Joined'}
            </span>
            <span className="hidden group-hover:inline">
              {locale === 'bn' ? 'ত্যাগ করুন' : 'Leave Group'}
            </span>
          </Button>
        </div>

        <LeaveGroupDialog
          isOpen={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          onConfirm={handleConfirmLeave}
          groupName={group.name}
          isLeaving={isLeaving}
          isOwner={isOwner}
        />
      </>
    );
  }

  // 5. PENDING (Request Pending)
  if (status === 'PENDING') {
    return (
      <Button
        type="button"
        size={size === 'lg' ? 'md' : size}
        variant="secondary"
        onClick={handleCancelRequest}
        disabled={isCancellingRequest}
        isLoading={isCancellingRequest}
        className={cn(
          'rounded-xl border border-amber-300 bg-amber-50 text-amber-800 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 group transition-all',
          className,
        )}
      >
        <Clock className="h-3.5 w-3.5 mr-1 group-hover:hidden" />
        <X className="h-3.5 w-3.5 mr-1 hidden group-hover:inline text-rose-600" />
        <span className="group-hover:hidden">
          {locale === 'bn' ? 'অনুরোধ অপেক্ষমাণ' : 'Request Pending'}
        </span>
        <span className="hidden group-hover:inline">
          {locale === 'bn' ? 'অনুরোধ বাতিল করুন' : 'Cancel Request'}
        </span>
      </Button>
    );
  }

  // 6. NONE + PRIVATE: [ Request to Join ]
  if (group.visibility === 'PRIVATE') {
    return (
      <Button
        type="button"
        size={size === 'lg' ? 'md' : size}
        onClick={handleJoin}
        disabled={isJoining}
        isLoading={isJoining}
        className={cn(
          'rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-2xs transition-all',
          className,
        )}
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        <span>
          {isJoining
            ? locale === 'bn'
              ? 'অনুরোধ পাঠানো হচ্ছে...'
              : 'Requesting...'
            : locale === 'bn'
              ? 'যুক্ত হওয়ার অনুরোধ'
              : 'Request to Join'}
        </span>
      </Button>
    );
  }

  // 7. NONE + PUBLIC: [ Join Group ]
  return (
    <Button
      type="button"
      size={size === 'lg' ? 'md' : size}
      onClick={handleJoin}
      disabled={isJoining}
      isLoading={isJoining}
      className={cn(
        'rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-2xs transition-all',
        className,
      )}
    >
      <Plus className="h-3.5 w-3.5 mr-1" />
      <span>
        {isJoining
          ? locale === 'bn'
            ? 'যুক্ত হচ্ছে...'
            : 'Joining...'
          : locale === 'bn'
            ? 'গ্রুপে যুক্ত হন'
            : 'Join Group'}
      </span>
    </Button>
  );
}
