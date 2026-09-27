'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export interface LeaveGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  groupName: string;
  isLeaving: boolean;
  isOwner?: boolean;
}

export function LeaveGroupDialog({
  isOpen,
  onClose,
  onConfirm,
  groupName,
  isLeaving,
  isOwner,
}: LeaveGroupDialogProps) {
  const { locale } = useLanguage();

  if (isOwner) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={locale === 'bn' ? 'গ্রুপ ত্যাগ করা সম্ভব নয়' : 'Cannot Leave Group'}
        description={
          locale === 'bn'
            ? `আপনি "${groupName}" গ্রুপের ওনার/প্রতিষ্ঠাতা। গ্রুপ ত্যাগ করার পূর্বে আপনাকে অন্য কোনো সদস্যকে ওনারশিপ ট্রান্সফার করতে হবে অথবা গ্রুপ ডিলিট করতে হবে।`
            : `You are the owner of "${groupName}". You must transfer ownership to another member or delete the group before leaving.`
        }
      >
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            {locale === 'bn' ? 'ঠিক আছে' : 'Got it'}
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={locale === 'bn' ? 'গ্রুপ ত্যাগ করবেন?' : 'Leave Group?'}
      description={
        locale === 'bn'
          ? `আপনি কি নিশ্চিত যে "${groupName}" গ্রুপ থেকে বের হতে চান?`
          : `Are you sure you want to leave "${groupName}"?`
      }
    >
      <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={onClose}
          disabled={isLeaving}
        >
          {locale === 'bn' ? 'বাতিল' : 'Cancel'}
        </Button>
        <Button
          type="button"
          className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white"
          onClick={onConfirm}
          isLoading={isLeaving}
        >
          <LogOut className="h-4 w-4 mr-1.5" />
          {locale === 'bn' ? 'গ্রুপ ত্যাগ করুন' : 'Leave Group'}
        </Button>
      </div>
    </Modal>
  );
}
