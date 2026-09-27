'use client';

import React from 'react';
import { FriendsLayout } from '@/features/friends/components/FriendsLayout';
import { SentRequests } from '@/features/friends/components/SentRequests';
import { useLanguage } from '@/providers/LanguageProvider';

export default function SentRequestsRoutePage() {
  const { locale } = useLanguage();

  return (
    <FriendsLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#e4e6eb] dark:border-[#393a3b]">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#050505] dark:text-white">
            {locale === 'bn' ? 'পাঠানো রিকোয়েস্ট' : 'Sent Requests'}
          </h1>
        </div>

        <SentRequests />
      </div>
    </FriendsLayout>
  );
}
