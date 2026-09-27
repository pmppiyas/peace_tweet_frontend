'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GroupDetail } from '../types/groups.types';
import { GroupActionButton } from './GroupActionButton';
import { GroupDetailTabs } from './GroupsTabs';
import { canManageGroup } from '../utils/group-permissions';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { Globe, Lock, Users, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface GroupHeaderProps {
  group: GroupDetail;
}

export function GroupHeader({ group }: GroupHeaderProps) {
  const { locale, formatNumber } = useLanguage();
  const isPublic = group.visibility === 'PUBLIC';
  const role = group.membership?.role || group.currentUserRole;
  const isManager = canManageGroup(role);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-2xl border border-[#e4e6eb] bg-white shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
        {/* Cover banner */}
        <div className="h-28 sm:h-36 w-full bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content Section */}
        <div className="px-4 sm:px-6 pb-5 pt-0 relative">
          {/* Avatar floating on cover */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 -mt-12 sm:-mt-14 mb-3">
            <div className="flex items-end gap-3.5">
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold text-2xl sm:text-3xl shadow-md dark:border-[#242526] select-none">
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

              <div className="space-y-0.5 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-[#050505] dark:text-[#e4e6eb] leading-tight">
                    {group.name}
                  </h1>
                  <Badge
                    variant={isPublic ? 'emerald' : 'gold'}
                    className="text-[10px] py-0.5"
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
                <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                  @{group.slug}
                </p>
              </div>
            </div>

            {/* Action buttons on top right */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-end pt-2 sm:pt-0">
              <GroupActionButton group={group} size="md" />

              {isManager && (
                <Link href={ROUTES.GROUPS.SETTINGS(group.slug)}>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Settings className="h-3.5 w-3.5 mr-1" />
                    <span>{locale === 'bn' ? 'ম্যানেজ' : 'Manage'}</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Description */}
          {group.description && (
            <p className="text-xs sm:text-sm text-[#050505] dark:text-[#e4e6eb] leading-relaxed max-w-2xl mt-2">
              {group.description}
            </p>
          )}

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#65676b] dark:text-[#b0b3b8] pt-3 mt-3 border-t border-[#f0f2f5] dark:border-[#3a3b3c]">
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong className="text-[#050505] dark:text-[#e4e6eb]">
                  {formatNumber(group.memberCount || 0)}
                </strong>{' '}
                {locale === 'bn' ? 'সদস্য' : 'members'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <MessageSquare className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>
                <strong className="text-[#050505] dark:text-[#e4e6eb]">
                  {formatNumber(group.postCount || 0)}
                </strong>{' '}
                {locale === 'bn' ? 'পোস্ট' : 'posts'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <GroupDetailTabs slug={group.slug} canManage={isManager} />
    </div>
  );
}
