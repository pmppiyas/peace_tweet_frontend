'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

interface EmptyFeedProps {
  message?: string;
}

export function EmptyFeed({ message = 'এখনো কোনো পোস্ট নেই' }: EmptyFeedProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e4e6eb] bg-white p-12 text-center dark:border-[#393a3b] dark:bg-[#242526]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
        <BookOpen className="h-6 w-6" />
      </div>
      <h3 className="mt-3 text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
        {message}
      </h3>
      <p className="mt-1 text-xs text-[#65676b] dark:text-[#b0b3b8] max-w-sm">
        নতুন দোয়া ও অর্থপূর্ণ ইসলামিক পোস্ট দেখতে সাথেই থাকুন অথবা নিজে একটি পোস্ট তৈরি করুন।
      </p>
    </div>
  );
}
