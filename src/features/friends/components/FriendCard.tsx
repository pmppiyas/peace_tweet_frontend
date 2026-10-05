'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserMinus, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useFriendActions } from '../hooks/useFriendActions';
import { FriendItem } from '../types/friends.types';

export interface FriendCardProps {
  friend: FriendItem;
}

export function FriendCard({ friend }: FriendCardProps) {
  const { locale } = useLanguage();
  const { unfriend } = useFriendActions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnfriended, setIsUnfriended] = useState(false);

  const targetUser = friend.user;
  const profileUrl = ROUTES.USER_PROFILE(targetUser.username);

  const handleConfirmUnfriend = () => {
    setIsModalOpen(false);
    setIsUnfriended(true);
    unfriend(targetUser.id).catch((err) => {
      console.error('Failed to unfriend:', err);
      setIsUnfriended(false);
    });
  };

  return (
    <>
      <Card className="flex flex-col justify-between overflow-hidden border border-[#e4e6eb] bg-white rounded-2xl shadow-2xs hover:shadow-md transition-all duration-200 dark:border-[#393a3b] dark:bg-[#242526]">
        {/* Top Cover / Large Avatar */}
        <Link href={profileUrl} className="block relative bg-gradient-to-br from-primary-500 via-teal-700 to-indigo-800 aspect-[4/3] flex items-center justify-center group overflow-hidden">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs text-white text-3xl font-black shadow-lg group-hover:scale-110 transition-transform">
            {targetUser.name?.charAt(0) || 'U'}
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <Link
              href={profileUrl}
              className="font-bold text-[16px] text-[#050505] hover:underline dark:text-white truncate block"
            >
              {targetUser.name}
            </Link>
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] truncate mt-0.5">
              @{targetUser.username}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {isUnfriended ? (
              <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-[#65676b] dark:text-[#b0b3b8] font-medium text-xs">
                <span>{locale === 'bn' ? 'বন্ধু তালিকা থেকে সরানো হয়েছে' : 'Unfriended'}</span>
              </div>
            ) : (
              <>
                <Link href={profileUrl} className="block w-full">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full font-bold text-sm h-9 rounded-xl shadow-xs"
                  >
                    <User className="mr-1.5 h-4 w-4" />
                    <span>{locale === 'bn' ? 'প্রোফাইল দেখুন' : 'View Profile'}</span>
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full font-bold text-sm h-9 rounded-xl bg-[#e4e6eb] hover:bg-red-50 hover:text-red-600 dark:bg-[#3a3b3c] dark:hover:bg-red-950/40 dark:hover:text-red-400 text-[#050505] dark:text-[#e4e6eb] transition-colors"
                  aria-label={`Unfriend ${targetUser.name}`}
                >
                  <UserMinus className="mr-1.5 h-3.5 w-3.5" />
                  <span>{locale === 'bn' ? 'আনফ্রেন্ড' : 'Unfriend'}</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={locale === 'bn' ? 'বন্ধু তালিকা থেকে বাদ দিতে চান?' : 'Remove friend?'}
        description={
          locale === 'bn'
            ? `আপনি কি নিশ্চিত যে @${targetUser.username} কে আপনার বন্ধু তালিকা থেকে বাদ দিতে চান?`
            : `Are you sure you want to remove @${targetUser.username} from your friends list?`
        }
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
          >
            {locale === 'bn' ? 'ফিরে যান' : 'Cancel'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmUnfriend}
            isLoading={false}
          >
            <UserMinus className="mr-1.5 h-4 w-4" />
            <span>{locale === 'bn' ? 'আনফ্রেন্ড করুন' : 'Remove Friend'}</span>
          </Button>
        </div>
      </Modal>
    </>
  );
}
