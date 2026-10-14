'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, Lock, Users } from 'lucide-react';
import { GroupDetail } from '../types/groups.types';
import { GroupActionButton } from './GroupActionButton';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';

export interface GroupListItemProps {
  group: GroupDetail;
}

export function GroupListItem({ group }: GroupListItemProps) {
  const { locale, formatNumber } = useLanguage();
  const isPublic = group.visibility === 'PUBLIC';
  const groupUrl = ROUTES.GROUPS.DETAIL(group.slug);

  return (
    <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 hover:bg-[#f8f9fa] dark:hover:bg-[#2a2b2c]/60 transition-colors group">
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
        {/* Avatar */}
        <Link
          href={groupUrl}
          className="relative h-12 w-12 sm:h-13 sm:w-13 rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-teal-500 to-primary-700 text-white font-bold text-base flex items-center justify-center shadow-xs group-hover:opacity-90 active:scale-95 transition-all select-none"
          title={group.name}
        >
          {group.avatarUrl ? (
            <Image
              src={group.avatarUrl}
              alt={group.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span>{group.name.charAt(0).toUpperCase()}</span>
          )}
        </Link>

        {/* Group Info: Name, Slug, Badge, Members */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={groupUrl}
              className="font-bold text-sm sm:text-[15px] text-[#050505] hover:underline dark:text-white truncate block leading-tight"
            >
              {group.name}
            </Link>
            <Badge
              variant={isPublic ? 'emerald' : 'gold'}
              className="shrink-0 text-[10px] py-0 px-1.5"
            >
              {isPublic ? (
                <span className="flex items-center gap-0.5">
                  <Globe className="h-3 w-3" />
                  <span>{locale === 'bn' ? 'পাবলিক' : 'Public'}</span>
                </span>
              ) : (
                <span className="flex items-center gap-0.5">
                  <Lock className="h-3 w-3" />
                  <span>{locale === 'bn' ? 'প্রাইভেট' : 'Private'}</span>
                </span>
              )}
            </Badge>
          </div>

          <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] truncate mt-0.5">
            @{group.slug}
          </p>

          <div className="flex items-center gap-1.5 pt-1 text-[11px] sm:text-xs text-[#65676b] dark:text-[#b0b3b8]">
            <Users className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>
              {formatNumber(group.memberCount || 0)}{' '}
              {locale === 'bn' ? 'সদস্য' : 'members'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href={groupUrl}>
          <button
            type="button"
            className="text-xs font-bold text-primary-600 hover:underline dark:text-primary-400 px-2.5 py-1.5 rounded-xl hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer"
          >
            {locale === 'bn' ? 'দেখুন' : 'View'}
          </button>
        </Link>
        <GroupActionButton group={group} size="sm" />
      </div>
    </div>
  );
}
