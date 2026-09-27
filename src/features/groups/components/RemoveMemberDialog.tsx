'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { UserX } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { GroupMemberItem } from '../types/groups.types';

export interface RemoveMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  member: GroupMemberItem | null;
  isRemoving: boolean;
}

export function RemoveMemberDialog({
  isOpen,
  onClose,
  onConfirm,
  member,
  isRemoving,
}: RemoveMemberDialogProps) {
  const { locale } = useLanguage();

  if (!member) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={locale === 'bn' ? 'সদস্যকে রিমুভ করবেন?' : 'Remove Member?'}
      description={
        locale === 'bn'
          ? `আপনি কি নিশ্চিত যে "${member.user.name}" (@${member.user.username})-কে এই গ্রুপ থেকে রিমুভ করতে চান?`
          : `Are you sure you want to remove "${member.user.name}" (@${member.user.username}) from this group?`
      }
    >
      <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={onClose}
          disabled={isRemoving}
        >
          {locale === 'bn' ? 'বাতিল' : 'Cancel'}
        </Button>
        <Button
          type="button"
          className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white"
          onClick={onConfirm}
          isLoading={isRemoving}
        >
          <UserX className="h-4 w-4 mr-1.5" />
          {locale === 'bn' ? 'রিমুভ করুন' : 'Remove'}
        </Button>
      </div>
    </Modal>
  );
}
