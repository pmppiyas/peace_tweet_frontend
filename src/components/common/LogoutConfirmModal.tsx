'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';
import { useLanguage } from '@/providers/LanguageProvider';
import { ROUTES } from '@/constants/routes';

export interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LogoutConfirmModal({
  isOpen,
  onClose,
  onSuccess,
}: LogoutConfirmModalProps) {
  const router = useRouter();
  const { logout, isLoggingOut } = useAuthActions();
  const { locale } = useLanguage();

  const handleConfirmLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignore background logout errors
    } finally {
      onClose();
      if (onSuccess) {
        onSuccess();
      }
      router.replace(ROUTES.HOME);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="flex flex-col items-center text-center space-y-4 pt-1">
        {/* Warning Icon Badge */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 ring-8 ring-primary-50/50 dark:ring-primary-950/20">
          <LogOut className="h-6 w-6 stroke-[2.2]" />
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-[#050505] dark:text-white">
            {locale === 'bn' ? 'লগআউট নিশ্চিতকরণ' : 'Confirm Log Out'}
          </h3>
          <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] max-w-xs leading-relaxed">
            {locale === 'bn'
              ? 'আপনি কি নিশ্চিত যে আপনার অ্যাকাউন্ট থেকে লগআউট করতে চান? লগআউট হওয়ার পর আপনাকে হোম পেজে নেওয়া হবে।'
              : 'Are you sure you want to log out of your account? You will be redirected directly to the home page.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoggingOut}
            className="rounded-xl font-bold text-xs"
          >
            {locale === 'bn' ? 'বাতিল' : 'Cancel'}
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmLogout}
            isLoading={isLoggingOut}
            className="rounded-xl font-bold text-xs gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{locale === 'bn' ? 'লগআউট' : 'Log Out'}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
