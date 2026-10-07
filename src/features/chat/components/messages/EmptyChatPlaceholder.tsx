'use client';

import React from 'react';
import { MessageSquare, SquarePen, Sparkles } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

interface EmptyChatPlaceholderProps {
  onOpenNewMessage: () => void;
}

export function EmptyChatPlaceholder({
  onOpenNewMessage,
}: EmptyChatPlaceholderProps) {
  const { locale } = useLanguage();

  return (
    <div className="h-full flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#f8f9fa] dark:bg-[#18191a] select-none">
      <div className="relative mb-4">
        <div className="h-20 w-20 rounded-3xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center text-primary-500 shadow-sm border border-primary-100/60 dark:border-primary-900/40">
          <MessageSquare className="h-10 w-10 stroke-[1.8]" />
        </div>
        <div className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-[#050505] dark:text-white tracking-tight">
        {locale === 'bn' ? 'আপনার মেসেজসমূহ' : 'Your Messages'}
      </h2>
      <p className="text-sm text-[#65676b] dark:text-[#b0b3b8] max-w-sm mt-2 leading-relaxed">
        {locale === 'bn'
          ? 'কথোপকথন দেখতে বামপাশের তালিকা থেকে একটি চ্যাট নির্বাচন করুন অথবা নতুন কাউকে মেসেজ পাঠান।'
          : 'Select a conversation from the left to start chatting, or start a new message with a friend.'}
      </p>

      <button
        type="button"
        onClick={onOpenNewMessage}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
      >
        <SquarePen className="h-4 w-4" />
        <span>{locale === 'bn' ? 'নতুন মেসেজ শুরু করুন' : 'New Message'}</span>
      </button>
    </div>
  );
}
