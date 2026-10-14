'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, MessageCircle, Users, FileText, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useChatStore } from '@/stores/useChatStore';
import { useFriendActions } from '../hooks/useFriendActions';
import { FriendItem } from '../types/friends.types';
import { cn } from '@/lib/utils/cn';

export interface FriendListItemProps {
  friend: FriendItem;
  showUnfriend?: boolean;
}

export function FriendListItem({ friend, showUnfriend = true }: FriendListItemProps) {
  const { locale } = useLanguage();
  const { unfriend } = useFriendActions();
  const openChat = useChatStore((state) => state.openChat);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnfriended, setIsUnfriended] = useState(false);

  const targetUser = friend.user;
  const profileUrl = ROUTES.USER_PROFILE(targetUser.username);
  const avatarSrc = targetUser.avatarUrl || targetUser.avatar;

  const friendsCount = targetUser.friendsCount ?? targetUser.friendCount ?? 0;
  const postCount = targetUser.postCount ?? 0;

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
      <div className="flex items-center justify-between gap-3 p-3 sm:p-3.5 hover:bg-[#f8f9fa] dark:hover:bg-[#2a2b2c]/60 transition-colors group">
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          {/* 1. Profile Photo */}
          <Link
            href={profileUrl}
            className="relative h-12 w-12 sm:h-13 sm:w-13 rounded-full overflow-hidden shrink-0 bg-primary-500 text-white font-bold text-base flex items-center justify-center shadow-xs group-hover:opacity-90 active:scale-95 transition-all select-none"
            title={targetUser.name}
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={targetUser.name || 'Friend'}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span>{targetUser.name?.charAt(0) || 'U'}</span>
            )}
          </Link>

          {/* 2. User Info: Name, Username, Friends count, Post count */}
          <div className="min-w-0">
            <Link
              href={profileUrl}
              className="font-bold text-sm sm:text-[15px] text-[#050505] hover:underline dark:text-white truncate block leading-tight"
            >
              {targetUser.name}
            </Link>
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] truncate mt-0.5">
              @{targetUser.username}
            </p>

            {/* Counts: Friends & Posts */}
            <div className="flex items-center gap-2.5 sm:gap-3 pt-1 text-[11px] sm:text-xs text-[#65676b] dark:text-[#b0b3b8]">
              <span className="flex items-center gap-1 font-medium">
                <Users className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                <span>
                  {friendsCount}{' '}
                  {locale === 'bn'
                    ? 'বন্ধু'
                    : friendsCount === 1
                      ? 'friend'
                      : 'friends'}
                </span>
              </span>

              <span>•</span>

              <span className="flex items-center gap-1 font-medium">
                <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>
                  {postCount}{' '}
                  {locale === 'bn'
                    ? 'পোস্ট'
                    : postCount === 1
                      ? 'post'
                      : 'posts'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isUnfriended ? (
            <span className="text-xs font-semibold text-[#65676b] dark:text-[#b0b3b8] px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
              {locale === 'bn' ? 'রিমুভ হয়েছে' : 'Removed'}
            </span>
          ) : (
            <>
              {/* Message Button */}
              <Button
                variant="primary"
                size="sm"
                onClick={() => openChat(targetUser)}
                className="rounded-xl font-bold text-xs h-8 sm:h-9 px-3 gap-1.5 shadow-xs"
                title={locale === 'bn' ? 'মেসেজ পাঠান' : 'Send Message'}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {locale === 'bn' ? 'মেসেজ' : 'Message'}
                </span>
              </Button>

              {/* Profile Link Button */}
              <Link href={profileUrl}>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl font-bold text-xs h-8 sm:h-9 px-2.5 sm:px-3 bg-[#e4e6eb] hover:bg-[#d8dadf] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb]"
                  title={locale === 'bn' ? 'প্রোফাইল দেখুন' : 'View Profile'}
                >
                  <User className="h-3.5 w-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">
                    {locale === 'bn' ? 'প্রোফাইল' : 'Profile'}
                  </span>
                </Button>
              </Link>

              {/* Unfriend Icon Button */}
              {showUnfriend && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="h-8 sm:h-9 px-2 rounded-xl bg-[#e4e6eb] hover:bg-rose-50 hover:text-rose-600 dark:bg-[#3a3b3c] dark:hover:bg-rose-950/40 dark:hover:text-rose-400 text-[#050505] dark:text-[#e4e6eb] transition-colors"
                  title={locale === 'bn' ? 'আনফ্রেন্ড' : 'Unfriend'}
                  aria-label={`Unfriend ${targetUser.name}`}
                >
                  <UserMinus className="h-3.5 w-3.5" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

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
          >
            {locale === 'bn' ? 'বাদ দিন' : 'Remove Friend'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
