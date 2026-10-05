'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

interface PostUnavailableCardProps {
  reason?: string;
  className?: string;
}

export function PostUnavailableCard({ reason, className = '' }: PostUnavailableCardProps) {
  const { locale } = useLanguage();
  const isBn = locale === 'bn';

  return (
    <div
      className={`rounded-xl border border-dashed border-[#ccd0d5] bg-[#f8f9fa] p-5 sm:p-6 text-center flex flex-col items-center justify-center space-y-2.5 transition-colors dark:border-[#393a3b] dark:bg-[#18191a]/80 ${className}`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e4e6eb] text-[#65676b] dark:bg-[#242526] dark:text-[#b0b3b8]">
        <AlertCircle className="h-6 w-6 stroke-[1.75]" />
      </div>
      <div className="space-y-1">
        <h4 className="text-[14px] sm:text-[15px] font-semibold text-[#050505] dark:text-[#e4e6eb]">
          {isBn ? 'এই পোস্টটি আর উপলব্ধ নেই' : "This content isn't available right now"}
        </h4>
        <p className="text-[12px] sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] max-w-sm mx-auto leading-relaxed">
          {reason ||
            (isBn
              ? 'পোস্টটি হয়তো এর মূল লেখক মুছে ফেলেছেন অথবা এর প্রাইভেসী সেটিংস পরিবর্তন করা হয়েছে।'
              : "When this happens, it's usually because the owner only shared it with a small group of people, changed who can see it or it's been deleted.")}
        </p>
      </div>
    </div>
  );
}
