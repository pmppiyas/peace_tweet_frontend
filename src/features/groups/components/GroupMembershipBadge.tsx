'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { GroupMemberRole, GroupMembershipStatus } from '../types/groups.types';
import {
  GROUP_MEMBER_ROLE_CONFIG,
  GROUP_MEMBERSHIP_STATUS_CONFIG,
} from '../utils/group-membership-status';
import { useLanguage } from '@/providers/LanguageProvider';

export interface GroupMembershipBadgeProps {
  status?: GroupMembershipStatus;
  role?: GroupMemberRole | null;
  className?: string;
}

export function GroupMembershipBadge({
  status,
  role,
  className,
}: GroupMembershipBadgeProps) {
  const { locale } = useLanguage();

  if (role) {
    const config = GROUP_MEMBER_ROLE_CONFIG[role] || GROUP_MEMBER_ROLE_CONFIG.MEMBER;
    const label = locale === 'bn' ? config.labelBn : config.label;
    return (
      <Badge variant={config.variant} className={className}>
        {label}
      </Badge>
    );
  }

  if (status && status !== 'NONE') {
    const config =
      GROUP_MEMBERSHIP_STATUS_CONFIG[status] ||
      GROUP_MEMBERSHIP_STATUS_CONFIG.NONE;
    const label = locale === 'bn' ? config.labelBn : config.label;
    return (
      <Badge variant={config.variant} className={className}>
        {label}
      </Badge>
    );
  }

  return null;
}
