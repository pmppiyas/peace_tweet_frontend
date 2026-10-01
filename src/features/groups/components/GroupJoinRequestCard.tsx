'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GroupJoinRequestItem } from '../types/groups.types';
import { ROUTES } from '@/constants/routes';
import { formatDate } from '@/lib/utils/date';
import { useLanguage } from '@/providers/LanguageProvider';
import { Check, X } from 'lucide-react';

export interface GroupJoinRequestCardProps {
  request: GroupJoinRequestItem;
  onAccept: (request: GroupJoinRequestItem) => void;
  onReject: (request: GroupJoinRequestItem) => void;
  isProcessing?: boolean;
}

export function GroupJoinRequestCard({
  request,
  onAccept,
  onReject,
  isProcessing,
}: GroupJoinRequestCardProps) {
  const { locale } = useLanguage();

  return (
    <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#e4e6eb] bg-white p-3.5 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
      {/* User info */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href={ROUTES.USER_PROFILE(request.user.username)}
          className="shrink-0"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-teal-700 text-white font-bold text-sm shadow-2xs select-none">
            {request.user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={request.user.avatarUrl}
                alt={request.user.name}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              request.user.name.charAt(0).toUpperCase()
            )}
          </div>
        </Link>

        <div className="min-w-0 flex-1 space-y-0.5">
          <Link
            href={ROUTES.USER_PROFILE(request.user.username)}
            className="truncate text-xs sm:text-sm font-bold text-[#050505] hover:text-primary-600 dark:text-[#e4e6eb] dark:hover:text-primary-400 transition-colors"
          >
            {request.user.name}
          </Link>
          <p className="truncate text-xs text-[#65676b] dark:text-[#b0b3b8]">
            @{request.user.username}
          </p>
          <p className="text-[10px] text-gray-400">
            {locale === 'bn' ? 'অনুরোধ পাঠানো হয়েছে:' : 'Requested:'}{' '}
            {formatDate(request.createdAt, locale)}
          </p>
        </div>
      </div>

      {/* Accept / Reject Action buttons */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Button
          size="sm"
          onClick={() => onAccept(request)}
          disabled={isProcessing}
          className="h-8 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold px-3 shadow-2xs"
        >
          <Check className="h-3.5 w-3.5 mr-1" />
          <span>{locale === 'bn' ? 'অনুমোদন' : 'Accept'}</span>
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => onReject(request)}
          disabled={isProcessing}
          className="h-8 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 px-3"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          <span>{locale === 'bn' ? 'প্রত্যাখ্যান' : 'Reject'}</span>
        </Button>
      </div>
    </Card>
  );
}
