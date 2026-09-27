'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GroupDetail } from '../types/groups.types';
import { EditGroupForm } from './EditGroupForm';
import { DeleteGroupDialog } from './DeleteGroupDialog';
import { useGroupActions } from '../hooks/useGroupActions';
import { canDeleteGroup, canManageGroup } from '../utils/group-permissions';
import { Trash2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export interface GroupSettingsProps {
  group: GroupDetail;
}

export function GroupSettings({ group }: GroupSettingsProps) {
  const { locale } = useLanguage();
  const role = group.membership?.role || group.currentUserRole;
  const isManager = canManageGroup(role);
  const isOwner = canDeleteGroup(role);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleteGroup, isDeletingGroup } = useGroupActions(group);

  if (!isManager) {
    return (
      <Card className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center dark:border-rose-900/60 dark:bg-rose-950/30">
        <ShieldAlert className="h-8 w-8 text-rose-600 dark:text-rose-400" />
        <h3 className="mt-2 text-sm font-bold text-rose-800 dark:text-rose-300">
          {locale === 'bn' ? 'অনুমতি নেই' : 'Access Denied'}
        </h3>
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 max-w-sm">
          {locale === 'bn'
            ? 'শুধুমাত্র ওনার এবং অ্যাডমিনরা গ্রুপের সেটিংস পরিবর্তন করতে পারেন।'
            : 'Only group owners and admins can configure group settings.'}
        </p>
      </Card>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteGroup(group.id);
    } catch {
      // Handled by query mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Group Edit Form */}
      <EditGroupForm group={group} />

      {/* 2. Danger Zone (Owner only) */}
      {isOwner && (
        <Card className="rounded-2xl border border-rose-200 bg-rose-50/30 p-5 sm:p-6 dark:border-rose-900/60 dark:bg-rose-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300">
                {locale === 'bn' ? 'বিপদজনক জোন (Danger Zone)' : 'Danger Zone'}
              </h3>
              <p className="mt-1 text-xs text-rose-700/80 dark:text-rose-400 max-w-md">
                {locale === 'bn'
                  ? 'গ্রুপ ডিলিট করলে এর সমস্ত পোস্ট, সদস্য এবং তথ্য চিরতরে মুছে যাবে। এই কাজটি পূর্বাবস্থায় ফিরিয়ে আনা সম্ভব নয়।'
                  : 'Permanently remove this group, all member connections, and its posts. This action cannot be undone.'}
              </p>
            </div>

            <Button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="self-start sm:self-center shrink-0 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {locale === 'bn' ? 'গ্রুপ ডিলিট করুন' : 'Delete Group'}
            </Button>
          </div>
        </Card>
      )}

      {/* Delete Group Modal */}
      <DeleteGroupDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        groupName={group.name}
        isDeleting={isDeletingGroup}
      />
    </div>
  );
}
