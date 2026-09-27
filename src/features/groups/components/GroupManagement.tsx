'use client';

import React from 'react';
import { GroupDetail } from '../types/groups.types';
import { GroupMemberList } from './GroupMemberList';
import { GroupJoinRequestList } from './GroupJoinRequestList';
import { GroupSettings } from './GroupSettings';
import { canManageGroup } from '../utils/group-permissions';
import { Card } from '@/components/ui/Card';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export interface GroupManagementProps {
  group: GroupDetail;
  activeSection?: 'members' | 'requests' | 'settings';
}

export function GroupManagement({
  group,
  activeSection = 'members',
}: GroupManagementProps) {
  const { locale } = useLanguage();
  const role = group.membership?.role || group.currentUserRole;
  const isManager = canManageGroup(role);

  if (!isManager) {
    return (
      <Card className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center dark:border-rose-900/60 dark:bg-rose-950/30">
        <ShieldAlert className="h-8 w-8 text-rose-600 dark:text-rose-400" />
        <h3 className="mt-2 text-sm font-bold text-rose-800 dark:text-rose-300">
          {locale === 'bn' ? 'অনুমতি নেই' : 'Access Denied'}
        </h3>
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 max-w-sm">
          {locale === 'bn'
            ? 'শুধুমাত্র ওনার এবং অ্যাডমিনরা গ্রুপের ম্যানেজমেন্ট অ্যাক্সেস করতে পারেন।'
            : 'Only group owners and admins can access group management.'}
        </p>
      </Card>
    );
  }

  if (activeSection === 'requests') {
    return <GroupJoinRequestList group={group} />;
  }

  if (activeSection === 'settings') {
    return <GroupSettings group={group} />;
  }

  return <GroupMemberList group={group} />;
}
