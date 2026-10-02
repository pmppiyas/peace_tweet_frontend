'use client';

import React from 'react';
import { BloodRequestItem } from '../types/blood.types';
import { BloodRequestCard } from './BloodRequestCard';
import { BloodRequestSkeleton } from './BloodRequestSkeleton';
import { BloodEmptyState } from './BloodEmptyState';

export interface BloodRequestListProps {
  requests: BloodRequestItem[];
  isLoading: boolean;
  emptyType?: 'requests' | 'my-requests' | 'my-donations' | 'search';
  onResetFilters?: () => void;
  onSelectDetail?: (request: BloodRequestItem) => void;
}

export function BloodRequestList({
  requests,
  isLoading,
  emptyType = 'requests',
  onResetFilters,
  onSelectDetail,
}: BloodRequestListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <BloodRequestSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return <BloodEmptyState type={emptyType} onResetFilters={onResetFilters} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {requests.map((request) => (
        <BloodRequestCard
          key={request.id}
          request={request}
          onSelectDetail={onSelectDetail}
        />
      ))}
    </div>
  );
}
