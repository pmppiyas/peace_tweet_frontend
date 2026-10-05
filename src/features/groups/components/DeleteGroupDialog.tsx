'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export interface DeleteGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  groupName: string;
  isDeleting: boolean;
}

export function DeleteGroupDialog({
  isOpen,
  onClose,
  onConfirm,
  groupName,
  isDeleting,
}: DeleteGroupDialogProps) {
  const { locale } = useLanguage();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={locale === 'bn' ? 'গ্রুপটি ডিলিট করবেন?' : 'Delete Group?'}
      description={
        locale === 'bn'
          ? `আপনি কি নিশ্চিত যে "${groupName}" গ্রুপটি সম্পূর্ণ মুছে ফেলতে চান? এই অ্যাকশনটি পূর্বাবস্থায় ফিরিয়ে আনা সম্ভব নয়। গ্রুপের সকল পোস্ট, সদস্য এবং তথ্য চিরতরে মুছে যাবে।`
          : `Are you sure you want to permanently delete "${groupName}"? This action cannot be undone. All posts, members, and data associated with this group will be deleted.`
      }
    >
      <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={onClose}
          disabled={isDeleting}
        >
          {locale === 'bn' ? 'বাতিল' : 'Cancel'}
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="w-full sm:w-auto font-bold"
          onClick={onConfirm}
          isLoading={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          {locale === 'bn' ? 'স্থায়ীভাবে ডিলিট করুন' : 'Delete Group'}
        </Button>
      </div>
    </Modal>
  );
}
