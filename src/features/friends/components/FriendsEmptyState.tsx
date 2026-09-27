'use client';

import React from 'react';
import { Users, UserPlus, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useLanguage } from '@/providers/LanguageProvider';

export interface FriendsEmptyStateProps {
  type: 'friends' | 'received' | 'sent';
  message?: string;
}

export function FriendsEmptyState({ type, message }: FriendsEmptyStateProps) {
  const { locale } = useLanguage();

  const configs = {
    friends: {
      icon: Users,
      title: locale === 'bn' ? 'আপনার এখনো কোনো friend নেই' : 'No friends yet',
      description:
        locale === 'bn'
          ? 'অন্যান্য ব্যবহারকারীদের প্রোফাইল ভিজিট করে বন্ধু যোগ করুন।'
          : 'Discover other users and send friend requests to build your network.',
    },
    received: {
      icon: UserPlus,
      title: locale === 'bn' ? 'কোনো নতুন friend request নেই' : 'No new friend requests',
      description:
        locale === 'bn'
          ? 'কেউ ফ্রেন্ড রিকোয়েস্ট পাঠালে এখানে প্রদর্শিত হবে।'
          : 'When someone sends you a friend request, it will appear here.',
    },
    sent: {
      icon: Clock,
      title: locale === 'bn' ? 'আপনার কোনো pending request নেই' : 'No pending requests',
      description:
        locale === 'bn'
          ? 'আপনার পাঠানো অপেক্ষারত রিকোয়েস্টগুলো এখানে দেখতে পাবেন।'
          : 'Outgoing friend requests awaiting acceptance will appear here.',
    },
  };

  const current = configs[type] || configs.friends;
  const Icon = current.icon;

  return (
    <Card className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-[#e4e6eb] bg-white rounded-3xl dark:border-[#393a3b] dark:bg-[#242526]">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
        {message || current.title}
      </h3>
      <p className="mt-1.5 max-w-sm text-xs text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
        {current.description}
      </p>
    </Card>
  );
}
