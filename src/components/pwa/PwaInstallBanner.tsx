'use client';

import React from 'react';
import Image from 'next/image';
import { Download, X } from 'lucide-react';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { useLanguage } from '@/providers/LanguageProvider';

export function PwaInstallBanner() {
  const { showBanner, isInstalled, promptInstall, dismiss } = usePwaInstall();
  const { locale } = useLanguage();

  if (!showBanner || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-2 right-2 sm:left-auto sm:right-6 z-50 max-w-sm sm:max-w-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-lg text-[#050505] dark:text-white">
        {/* App Icon */}
        <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-lg overflow-hidden shadow-2xs border border-[#e4e6eb] dark:border-[#393a3b]">
          <Image
            src="/p-logo.svg"
            alt="PeaceTweet App"
            width={40}
            height={40}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold truncate">
            {locale === 'bn' ? 'PeaceTweet অ্যাপ' : 'PeaceTweet App'}
          </h4>
          <p className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] truncate">
            {locale === 'bn'
              ? 'মোবাইলে সহজে অ্যাপের মতো চালান'
              : 'Add to home screen for fast access'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={promptInstall}
            className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-2xs transition-transform active:scale-95 cursor-pointer"
          >
            <Download className="h-3 w-3" />
            <span>{locale === 'bn' ? 'ইনস্টল' : 'Install'}</span>
          </button>

          <button
            type="button"
            onClick={() => dismiss()}
            title={locale === 'bn' ? 'পরে' : 'Later'}
            className="p-1 rounded-full text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
