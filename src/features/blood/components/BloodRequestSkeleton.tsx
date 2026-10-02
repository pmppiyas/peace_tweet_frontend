'use client';

import React from 'react';

export function BloodRequestSkeleton() {
  return (
    <div className="rounded-2xl border border-[#e4e6eb] bg-white p-4 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Middle info */}
      <div className="mt-4 space-y-2">
        <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Progress bar */}
      <div className="mt-4 space-y-1.5">
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-[#f0f2f5] pt-3 dark:border-[#3a3b3c]">
        <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-8 w-24 rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
