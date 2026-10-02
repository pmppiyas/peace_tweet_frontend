'use client';

import React from 'react';
import { BloodDonorUser } from '../types/blood.types';
import { BloodDonorCard } from './BloodDonorCard';
import { BloodEmptyState } from './BloodEmptyState';

export interface BloodDonorListProps {
  donors: BloodDonorUser[];
  isLoading: boolean;
  onResetFilters?: () => void;
}

export function BloodDonorList({
  donors,
  isLoading,
  onResetFilters,
}: BloodDonorListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#e4e6eb] bg-white p-4 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            <div className="mt-4 h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-4 h-8 rounded-xl bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    );
  }

  if (donors.length === 0) {
    return <BloodEmptyState type="donors" onResetFilters={onResetFilters} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {donors.map((donor) => (
        <BloodDonorCard key={donor.id} donor={donor} />
      ))}
    </div>
  );
}
