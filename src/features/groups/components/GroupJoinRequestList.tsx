'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GroupDetail, GroupJoinRequestItem } from '../types/groups.types';
import { useGroupRequests } from '../hooks/useGroupRequests';
import { useGroupActions } from '../hooks/useGroupActions';
import { GroupJoinRequestCard } from './GroupJoinRequestCard';
import { GroupRequestListSkeleton } from './GroupRequestSkeleton';
import { GroupsEmptyState } from './GroupsEmptyState';
import { canManageRequests } from '../utils/group-permissions';
import { Card } from '@/components/ui/Card';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export interface GroupJoinRequestListProps {
  group: GroupDetail;
}

export function GroupJoinRequestList({ group }: GroupJoinRequestListProps) {
  const { locale } = useLanguage();
  const currentUserRole = group.membership?.role || group.currentUserRole;
  const canManage = canManageRequests(currentUserRole);

  const [processingId, setProcessingId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGroupRequests(group.id, { limit: 20 }, canManage);

  const { acceptRequest, rejectRequest } = useGroupActions(group);

  const allRequests = data?.pages.flatMap((page) => page?.items || []) || [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px', threshold: 0.1 },
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!canManage) {
    return (
      <Card className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center dark:border-rose-900/60 dark:bg-rose-950/30">
        <ShieldAlert className="h-8 w-8 text-rose-600 dark:text-rose-400" />
        <h3 className="mt-2 text-sm font-bold text-rose-800 dark:text-rose-300">
          {locale === 'bn' ? 'অনুমতি নেই' : 'Access Denied'}
        </h3>
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 max-w-sm">
          {locale === 'bn'
            ? 'শুধুমাত্র ওনার এবং অ্যাডমিনরা এই গ্রুপের যুক্ত হওয়ার অনুরোধ দেখতে পারেন।'
            : 'Only group owners and admins can review join requests.'}
        </p>
      </Card>
    );
  }

  const handleAccept = async (req: GroupJoinRequestItem) => {
    try {
      setProcessingId(req.id);
      await acceptRequest(group.id, req.id);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (req: GroupJoinRequestItem) => {
    try {
      setProcessingId(req.id);
      await rejectRequest(group.id, req.id);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return <GroupRequestListSkeleton count={4} />;
  }

  if (allRequests.length === 0) {
    return <GroupsEmptyState type="requests" />;
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {allRequests.map((req) => (
          <GroupJoinRequestCard
            key={req.id}
            request={req}
            onAccept={handleAccept}
            onReject={handleReject}
            isProcessing={processingId === req.id}
          />
        ))}

        {/* Infinite Scroll Sentinel */}
        <div ref={loadMoreRef} className="h-4 w-full" />

        {isFetchingNextPage && <GroupRequestListSkeleton count={2} />}
      </div>
    </div>
  );
}
