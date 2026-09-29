'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GroupDetail } from '../types/groups.types';
import { GroupActionButton } from './GroupActionButton';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { Globe, Lock, Users } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface GroupCardProps {
  group: GroupDetail;
  className?: string;
}

export function GroupCard({ group, className }: GroupCardProps) {
  const { locale, formatNumber } = useLanguage();
  const isPublic = group.visibility === 'PUBLIC';

  return (
    <Card
      className={cn(
        'group flex flex-col justify-between rounded-2xl border border-[#e4e6eb] bg-white p-4 shadow-2xs transition-all hover:border-primary-300/80 hover:shadow-xs dark:border-[#393a3b] dark:bg-[#242526] dark:hover:border-primary-600/60',
        className,
      )}
    >
      <div className="space-y-3">
        {/* Top bar: Avatar, Title, Slug, and Visibility Badge */}
        <div className="flex items-start justify-between gap-2.5">
          <Link
            href={ROUTES.GROUPS.DETAIL(group.slug)}
            className="flex items-center gap-3 min-w-0 flex-1"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-teal-700 text-white font-bold text-lg shadow-2xs select-none">
              {group.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={group.avatarUrl}
                  alt={group.name}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                group.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold text-[#050505] group-hover:text-primary-600 dark:text-[#e4e6eb] dark:group-hover:text-primary-400 transition-colors">
                {group.name}
              </h3>
              <p className="truncate text-xs text-[#65676b] dark:text-[#b0b3b8]">
                @{group.slug}
              </p>
            </div>
          </Link>

          <Badge
            variant={isPublic ? 'emerald' : 'gold'}
            className="shrink-0 text-[10px]"
          >
            {isPublic ? (
              <>
                <Globe className="h-3 w-3 mr-0.5" />
                <span>{locale === 'bn' ? 'পাবলিক' : 'Public'}</span>
              </>
            ) : (
              <>
                <Lock className="h-3 w-3 mr-0.5" />
                <span>{locale === 'bn' ? 'প্রাইভেট' : 'Private'}</span>
              </>
            )}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] line-clamp-2 min-h-[2rem]">
          {group.description ||
            (locale === 'bn'
              ? 'এই গ্রুপের জন্য কোনো বিবরণ নেই।'
              : 'No description provided for this group.')}
        </p>
      </div>

      {/* Footer: Member Count & Action Button */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#f0f2f5] pt-3 dark:border-[#3a3b3c]">
        <div className="flex items-center gap-1.5 text-xs text-[#65676b] dark:text-[#b0b3b8]">
          <Users className="h-3.5 w-3.5 text-primary-500 dark:text-primary-400" />
          <span>
            {formatNumber(group.memberCount || 0)}{' '}
            {locale === 'bn' ? 'সদস্য' : 'members'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href={ROUTES.GROUPS.DETAIL(group.slug)}>
            <button
              type="button"
              className="text-xs font-bold text-primary-600 hover:underline dark:text-primary-400 px-2 py-1"
            >
              {locale === 'bn' ? 'দেখুন' : 'View Group'}
            </button>
          </Link>
          <GroupActionButton group={group} size="sm" />
        </div>
      </div>
    </Card>
  );
}
