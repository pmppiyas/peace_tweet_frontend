'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { FeedItem } from '../types/feed.types';
import { useLanguage } from '@/providers/LanguageProvider';

import { PostContent } from './PostContent';

interface QuestionPostCardProps {
  post: FeedItem;
}

export function QuestionPostCard({ post }: QuestionPostCardProps) {
  const { locale } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
        <HelpCircle className="h-3.5 w-3.5" />
        <span>{locale === 'bn' ? 'প্রশ্ন ও জিজ্ঞাসা' : 'Question & Reflection'}</span>
      </div>

      {post.content && <PostContent content={post.content} />}
    </div>
  );
}
