'use client';

import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

interface EmptyChatPlaceholderProps {
  onOpenNewMessage?: () => void;
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
          ? 'মেসেজ দেখতে বামপাশের তালিকা থেকে একটি চ্যাট নির্বাচন করুন অথবা ফ্রেন্ড সার্চ করে চ্যাট শুরু করুন।'
          : 'Select a chat from the left to view messages, or search for a friend to connect.'}
      </p>
    </div>
  );
}
