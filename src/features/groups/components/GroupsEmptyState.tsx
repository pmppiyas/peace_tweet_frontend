'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';

export interface GroupsEmptyStateProps {
  type?: 'discover' | 'my-groups' | 'search' | 'members' | 'requests' | 'posts';
  searchQuery?: string;
  onAction?: () => void;
  actionText?: string;
}

export function GroupsEmptyState({
  type = 'discover',
  searchQuery,
  onAction,
  actionText,
}: GroupsEmptyStateProps) {
  const { locale } = useLanguage();

  const configs: Record<
    'discover' | 'my-groups' | 'search' | 'members' | 'requests' | 'posts',
    {
      icon: React.ReactNode;
      title: string;
      description: string;
      cta?: { label: string; href: string };
    }
  > = {
    discover: {
      icon: <Users className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />,
      title: locale === 'bn' ? 'কোনো গ্রুপ পাওয়া যায়নি' : 'No Groups Found',
      description:
        locale === 'bn'
          ? 'নতুন একটি ইসলামিক গ্রুপ তৈরি করে কমিউনিটি শুরু করুন।'
          : 'Create a new Islamic community group to get started.',
      cta: {
        label: locale === 'bn' ? 'গ্রুপ তৈরি করুন' : 'Create Group',
        href: ROUTES.GROUPS.CREATE,
      },
    },
    'my-groups': {
      icon: <Users className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />,
      title:
        locale === 'bn'
          ? 'আপনি কোনো গ্রুপে যুক্ত হননি'
          : "You Haven't Joined Any Groups Yet",
      description:
        locale === 'bn'
          ? 'পাবলিক গ্রুপগুলো ঘুরে দেখুন এবং আপনার পছন্দের ইসলামিক কমিউনিটিতে যুক্ত হন।'
          : 'Explore public groups and connect with like-minded Islamic communities.',
      cta: {
        label: locale === 'bn' ? 'গ্রুপ খুঁজুন' : 'Explore Groups',
        href: ROUTES.GROUPS.HOME,
      },
    },
    search: {
      icon: <Search className="h-10 w-10 text-gray-400" />,
      title:
        locale === 'bn'
          ? `"${searchQuery}" দিয়ে কোনো গ্রুপ পাওয়া যায়নি`
          : `No Groups Matching "${searchQuery}"`,
      description:
        locale === 'bn'
          ? 'অন্য কোনো নাম দিয়ে সার্চ করুন অথবা নতুন একটি গ্রুপ তৈরি করুন।'
          : 'Try searching with different keywords or create a new group.',
      cta: {
        label: locale === 'bn' ? 'গ্রুপ তৈরি করুন' : 'Create Group',
        href: ROUTES.GROUPS.CREATE,
      },
    },
    members: {
      icon: <Users className="h-10 w-10 text-gray-400" />,
      title: locale === 'bn' ? 'কোনো সদস্য পাওয়া যায়নি' : 'No Members Found',
      description:
        locale === 'bn'
          ? 'অনুসন্ধান ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।'
          : 'Try adjusting your search filters.',
    },
    requests: {
      icon: <Users className="h-10 w-10 text-gray-400" />,
      title:
        locale === 'bn'
          ? 'কোনো অপেক্ষমাণ অনুরোধ নেই'
          : 'No Pending Join Requests',
      description:
        locale === 'bn'
          ? 'নতুন কেউ যুক্ত হওয়ার অনুরোধ জানালে এখানে প্রদর্শিত হবে।'
          : 'When new members request to join, their requests will appear here.',
    },
    posts: {
      icon: <Users className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />,
      title: locale === 'bn' ? 'এই গ্রুপে এখনও কোনো পোস্ট নেই' : 'No Posts in this Group Yet',
      description:
        locale === 'bn'
          ? 'প্রথম পোস্ট বা দোয়া শেয়ার করে আলোচনা শুরু করুন।'
          : 'Be the first to share an Islamic thought or Dua in this group.',
    },
  };

  const current = configs[type] || configs.discover;

  return (
    <Card className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e4e6eb] bg-white p-8 text-center shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 mb-3">
        {current.icon}
      </div>
      <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
        {current.title}
      </h3>
      <p className="mt-1 text-xs text-[#65676b] dark:text-[#b0b3b8] max-w-sm">
        {current.description}
      </p>

      {current.cta && (
        <Link href={current.cta.href} className="mt-4">
          <Button
            size="sm"
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {current.cta.label}
          </Button>
        </Link>
      )}

      {onAction && actionText && (
        <Button
          size="sm"
          onClick={onAction}
          className="mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
        >
          {actionText}
        </Button>
      )}
    </Card>
  );
}
