'use client';

import React, { useState } from 'react';
import { ChatAvatar } from '../ChatAvatar';
import Link from 'next/link';
import {
  X,
  User,
  Bell,
  BellOff,
  Shield,
  Heart,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { ChatUser } from '@/features/chat/types/chat.types';
import { useLanguage } from '@/providers/LanguageProvider';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';

interface ConversationDetailsPanelProps {
  user: ChatUser;
  isOnline: boolean;
  isOpen: boolean;
  onClose: () => void;
  onQuickSalam?: () => void;
}

export function ConversationDetailsPanel({
  user,
  isOnline,
  isOpen,
  onClose,
  onQuickSalam,
}: ConversationDetailsPanelProps) {
  const { locale } = useLanguage();
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen) return null;

  const displayName = user.name || (locale === 'bn' ? 'ব্যবহারকারী' : 'User');
  const firstLetter = displayName.trim().charAt(0).toUpperCase() || 'U';

  const content = (
    <div className="h-full flex flex-col bg-white dark:bg-[#1f2021] text-[#050505] dark:text-[#e4e6eb] overflow-y-auto select-none">
      {/* Header */}
      <div className="p-4 border-b border-[#e4e6eb] dark:border-[#393a3b] flex items-center justify-between shrink-0">
        <h3 className="font-bold text-base text-[#050505] dark:text-white">
          {locale === 'bn' ? 'কথোপকথনের বিবরণ' : 'Chat Details'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer"
          title={locale === 'bn' ? 'বন্ধ করুন' : 'Close'}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-5 flex flex-col items-center text-center border-b border-[#e4e6eb] dark:border-[#393a3b] shrink-0">
        {/* Large Avatar */}
        <ChatAvatar
          src={user.avatarUrl}
          name={displayName}
          size="xl"
          isOnline={isOnline}
          className="mb-3"
        />

        {/* User Name & Handle */}
        <h4 className="text-lg font-black text-[#050505] dark:text-white leading-tight">
          {displayName}
        </h4>
        <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
          @{user.username}
        </p>

        <p className="text-xs mt-2 font-medium">
          {isOnline ? (
            <span className="text-emerald-500 flex items-center gap-1.5 justify-center">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {locale === 'bn' ? 'এখন সক্রিয় আছেন' : 'Active now'}
            </span>
          ) : (
            <span className="text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn' ? 'অফলাইন' : 'Offline'}
            </span>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4 w-full">
          <Link
            href={ROUTES.USER_PROFILE(user.username)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-xs font-bold text-[#050505] dark:text-[#e4e6eb] transition-colors"
          >
            <User className="h-4 w-4" />
            <span>{locale === 'bn' ? 'প্রোফাইল' : 'Profile'}</span>
          </Link>

          {onQuickSalam && (
            <button
              type="button"
              onClick={onQuickSalam}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/60 dark:hover:bg-primary-900/60 text-xs font-bold text-primary-600 dark:text-primary-400 transition-colors cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-primary-500" />
              <span>{locale === 'bn' ? 'সালাম দিন' : 'Salam'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Options & Settings Section */}
      <div className="p-4 space-y-3 flex-1">
        <h5 className="text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-[#b0b3b8] px-1">
          {locale === 'bn' ? 'চ্যাট সেটিংস' : 'Chat Options'}
        </h5>

        {/* Mute Notifications */}
        <button
          type="button"
          onClick={() => setIsMuted((prev) => !prev)}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#f0f2f5] dark:hover:bg-[#2a2b2c] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            {isMuted ? (
              <BellOff className="h-5 w-5 text-amber-500" />
            ) : (
              <Bell className="h-5 w-5 text-[#65676b] dark:text-[#b0b3b8]" />
            )}
            <div>
              <p className="text-sm font-semibold text-[#050505] dark:text-white">
                {locale === 'bn' ? 'বিজ্ঞপ্তি বন্ধ রাখুন' : 'Mute Notifications'}
              </p>
              <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                {isMuted
                  ? locale === 'bn'
                    ? 'মেসেজ নোটিফিকেশন বন্ধ রয়েছে'
                    : 'Notifications are muted'
                  : locale === 'bn'
                    ? 'নতুন মেসেজের শব্দ চালু আছে'
                    : 'Alerts are on'}
              </p>
            </div>
          </div>
          <span
            className={cn(
              'h-5 w-9 rounded-full transition-colors relative flex items-center px-0.5',
              isMuted ? 'bg-primary-500 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start',
            )}
          >
            <span className="h-4 w-4 rounded-full bg-white shadow-xs" />
          </span>
        </button>

        {/* Peaceful Communication Reminder Card */}
        <div className="p-3.5 rounded-2xl bg-primary-50/70 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/50 mt-4 text-left">
          <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300 text-xs font-bold mb-1">
            <Heart className="h-4 w-4 text-primary-500 fill-primary-500" />
            <span>{locale === 'bn' ? 'উত্তম আচরণ ও শান্তি' : 'Peace & Kindness'}</span>
          </div>
          <p className="text-[11px] text-primary-800/80 dark:text-primary-300/80 leading-relaxed">
            {locale === 'bn'
              ? 'কথোপকথনে সুন্দর ও মার্জিত শব্দ ব্যবহার করুন। পারস্পরিক সম্প্রীতি বজায় রাখা মুমিনের ভূষণ।'
              : 'Communicate with warmth and kindness. Maintaining peace and respect is the true essence of brotherhood.'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Column */}
      <aside className="hidden lg:block w-[300px] xl:w-[320px] h-full border-l border-[#e4e6eb] dark:border-[#393a3b] shrink-0">
        {content}
      </aside>

      {/* Mobile / Tablet Slide-over Drawer */}
      <div className="lg:hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-[#1f2021] shadow-2xl animate-in slide-in-from-right duration-250">
          {content}
        </div>
      </div>
    </>
  );
}
