'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Shield, ShieldAlert, User, Check } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { GroupMemberItem } from '../types/groups.types';
import { cn } from '@/lib/utils/cn';

export interface ChangeMemberRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (role: 'MEMBER' | 'MODERATOR' | 'ADMIN') => Promise<void>;
  member: GroupMemberItem | null;
  isChanging: boolean;
}

export function ChangeMemberRoleDialog({
  isOpen,
  onClose,
  onConfirm,
  member,
  isChanging,
}: ChangeMemberRoleDialogProps) {
  const { locale } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<
    'MEMBER' | 'MODERATOR' | 'ADMIN'
  >('MEMBER');

  useEffect(() => {
    if (member && member.role !== 'OWNER') {
      setSelectedRole(member.role);
    }
  }, [member]);

  if (!member) return null;

  const roles: Array<{
    id: 'MEMBER' | 'MODERATOR' | 'ADMIN';
    title: string;
    desc: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'MEMBER',
      title: locale === 'bn' ? 'সাধারণ সদস্য (Member)' : 'Member',
      desc:
        locale === 'bn'
          ? 'গ্রুপে পোস্ট এবং আলোচনায় অংশগ্রহণ করতে পারবে।'
          : 'Can post, comment, and participate in discussions.',
      icon: <User className="h-4 w-4 text-gray-500" />,
    },
    {
      id: 'MODERATOR',
      title: locale === 'bn' ? 'মডারেটর (Moderator)' : 'Moderator',
      desc:
        locale === 'bn'
          ? 'সদস্য অনুমোদন/বাতিল এবং পোস্ট ম্যানেজ করতে পারবে।'
          : 'Can manage join requests and moderate posts.',
      icon: <Shield className="h-4 w-4 text-blue-600" />,
    },
    {
      id: 'ADMIN',
      title: locale === 'bn' ? 'অ্যাডমিন (Admin)' : 'Admin',
      desc:
        locale === 'bn'
          ? 'গ্রুপ সেটিংস পরিবর্তন এবং সদস্য রিমুভ করতে পারবে।'
          : 'Full management of members, settings, and requests.',
      icon: <ShieldAlert className="h-4 w-4 text-primary-500" />,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(selectedRole);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={locale === 'bn' ? 'সদস্যের রোল পরিবর্তন' : 'Change Member Role'}
      description={
        locale === 'bn'
          ? `"${member.user.name}" (@${member.user.username})-এর রোল নির্বাচন করুন:`
          : `Select a new role for "${member.user.name}" (@${member.user.username}):`
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div className="space-y-2">
          {roles.map((r) => {
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={cn(
                  'flex w-full items-start justify-between rounded-2xl border p-3.5 text-left transition-all',
                  isSelected
                    ? 'border-primary-500 bg-primary-50/60 dark:border-primary-600 dark:bg-primary-900/40 shadow-xs'
                    : 'border-[#e4e6eb] bg-white hover:bg-[#f0f2f5] dark:border-[#393a3b] dark:bg-[#242526] dark:hover:bg-[#3a3b3c]',
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{r.icon}</div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
                      {r.title}
                    </p>
                    <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                      {r.desc}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <Check className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-[#f0f2f5] dark:border-[#3a3b3c]">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={onClose}
            disabled={isChanging}
          >
            {locale === 'bn' ? 'বাতিল' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-bold"
            isLoading={isChanging}
          >
            {locale === 'bn' ? 'রোল আপডেট করুন' : 'Save Role'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
