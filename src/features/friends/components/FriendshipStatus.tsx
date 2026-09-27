'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { FriendshipStatus } from '../types/friends.types';
import { FRIENDSHIP_STATUS_CONFIG } from '../utils/friendship-status';
import { useLanguage } from '@/providers/LanguageProvider';

export interface FriendshipStatusProps {
  status: FriendshipStatus;
  className?: string;
}

export function FriendshipStatusBadge({ status, className }: FriendshipStatusProps) {
  const { locale } = useLanguage();
  const config = FRIENDSHIP_STATUS_CONFIG[status] || FRIENDSHIP_STATUS_CONFIG.NONE;
  const label = locale === 'bn' ? config.labelBn : config.label;

  const badgeVariantMap: Record<FriendshipStatus, 'emerald' | 'gold' | 'default'> = {
    FRIENDS: 'emerald',
    PENDING_SENT: 'gold',
    PENDING_RECEIVED: 'emerald',
    NONE: 'default',
    SELF: 'default',
  };

  return (
    <Badge variant={badgeVariantMap[status] || 'default'} className={className}>
      {label}
    </Badge>
  );
}
