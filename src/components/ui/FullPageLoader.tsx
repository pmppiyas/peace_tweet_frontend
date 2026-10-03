'use client';

import React from 'react';
import Image from 'next/image';

interface FullPageLoaderProps {
  className?: string;
}

export function FullPageLoader({ className }: FullPageLoaderProps) {
  return (
    <div
      className={`fixed inset-0 z-[9999] w-full h-full min-h-screen flex items-center justify-center bg-white dark:bg-[#18191a] select-none transition-colors overflow-hidden ${
        className || ''
      }`}
      role="status"
      aria-label="Loading PeaceTweet"
    >
      {/* 1. Exact Dead Center: Brand Logo with gentle breathing pulse */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 animate-pulse">
          <Image
            src="/p-logo.svg"
            alt="PeaceTweet"
            width={96}
            height={96}
            priority
            className="rounded-3xl shadow-sm drop-shadow-md"
          />
        </div>
      </div>

      {/* 2. Fixed at Bottom: "from PeaceTweet" branding + slogan */}
      <div className="absolute bottom-8 sm:bottom-10 left-0 right-0 flex flex-col items-center justify-center gap-1.5 text-center px-4">
        <span className="text-[11px] font-semibold text-[#8a8d91] dark:text-[#b0b3b8] tracking-widest uppercase">
          from
        </span>
        <div className="flex items-center gap-2">
          <div className="relative h-5 w-5 shrink-0">
            <Image
              src="/p-logo.svg"
              alt="PeaceTweet Logo"
              width={20}
              height={20}
              className="rounded-md"
            />
          </div>
          <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-primary-600 via-primary-500 to-teal-600 bg-clip-text text-transparent">
            PeaceTweet
          </span>
        </div>
        <p className="text-xs sm:text-[13px] font-medium text-[#65676b] dark:text-[#b0b3b8] tracking-wide pt-0.5">
          সুন্নাহ আঁকড়ে, উম্মাহর পাশে
        </p>
      </div>
    </div>
  );
}
