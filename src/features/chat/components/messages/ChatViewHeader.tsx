'use client';

import React from 'react';
import Link from 'next/link';
import { ChatAvatar } from '../ChatAvatar';
import { ArrowLeft, Info, CheckCircle2 } from 'lucide-react';
import { ChatUser } from '@/features/chat/types/chat.types';
import { useLanguage } from '@/providers/LanguageProvider';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';

interface ChatViewHeaderProps {
  user: ChatUser;
  isOnline: boolean;
  isTyping: boolean;
  isDetailsOpen: boolean;
  onToggleDetails: () => void;
  onBack?: () => void;
}

export function ChatViewHeader({
  user,
  isOnline,
  isTyping,
  isDetailsOpen,
  onToggleDetails,
  onBack,
}: ChatViewHeaderProps) {
  const { locale } = useLanguage();
  const displayName = user.name || (locale === 'bn' ? 'ব্যবহারকারী' : 'User');
  const firstLetter = displayName.trim().charAt(0).toUpperCase() || 'U';

  return (
    <header className="h-14 sm:h-16 px-3.5 sm:px-5 border-b border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#242526] flex items-center justify-between gap-3 shrink-0 z-10 shadow-2xs select-none">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile Back Button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="md:hidden p-2 -ml-1.5 text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] rounded-full transition-colors cursor-pointer"
            title={locale === 'bn' ? 'ফিরে যান' : 'Back'}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* User Info Link */}
        <Link
          href={ROUTES.USER_PROFILE(user.username)}
          className="flex items-center gap-2.5 sm:gap-3 min-w-0 group"
          title={`View @${user.username}`}
        >
          {/* Avatar */}
          <ChatAvatar
            src={user.avatarUrl}
            name={displayName}
            size="md"
            isOnline={isOnline}
            className="transition-transform group-hover:scale-105"
          />

          {/* Name & Status */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#050505] dark:text-white truncate group-hover:underline">
                {displayName}
              </h2>
            </div>
            <p className="text-xs truncate leading-tight">
              {isTyping ? (
                <span className="text-primary-600 dark:text-primary-400 font-semibold animate-pulse">
                  {locale === 'bn' ? 'টাইপ করছেন...' : 'typing...'}
                </span>
              ) : isOnline ? (
                <span className="text-emerald-500 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                  {locale === 'bn' ? 'সক্রিয় আছেন' : 'Active now'}
                </span>
              ) : (
                <span className="text-[#65676b] dark:text-[#b0b3b8]">
                  {locale === 'bn' ? 'অফলাইন' : 'Offline'}
                </span>
              )}
            </p>
          </div>
        </Link>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onToggleDetails}
          className={cn(
            'p-2 sm:p-2.5 rounded-full transition-colors cursor-pointer',
            isDetailsOpen
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400'
              : 'text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] hover:text-[#050505] dark:hover:text-white',
          )}
          title={locale === 'bn' ? 'চ্যাটের বিবরণ' : 'Conversation info'}
        >
          <Info className="h-5 w-5 stroke-[2.2]" />
        </button>
      </div>
    </header>
  );
}
