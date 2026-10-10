'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { SavedSidebar } from './SavedSidebar';
import { TasbihWidget } from './TasbihWidget';
import { TIME_SLOTS, getCurrentTimeSlot } from '@/types/saved.types';
import { cn } from '@/lib/utils/cn';

export interface SavedLayoutProps {
  children: React.ReactNode;
}

export function SavedLayout({ children }: SavedLayoutProps) {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const currentSlotParam = searchParams?.get('slot');
  const currentRoutineSlot = getCurrentTimeSlot();
  const [isMobileTasbihOpen, setIsMobileTasbihOpen] = useState(false);

  interface MobileTabItem {
    id: string;
    label: string;
    href: string;
  }

  const routineMobileTabs: MobileTabItem[] = TIME_SLOTS.map((slot) => ({
    id: `tab-${slot.id}`,
    label: `${slot.icon} ${locale === 'bn' ? slot.labelBn : slot.labelEn}`,
    href: `${ROUTES.SAVED}?slot=${slot.id}`,
  }));

  const mobileTabs: MobileTabItem[] = [
    {
      id: 'tab-all',
      label: locale === 'bn' ? '📌 সকল' : '📌 All',
      href: `${ROUTES.SAVED}?slot=all`,
    },
    ...routineMobileTabs,
    {
      id: 'tab-explore',
      label: locale === 'bn' ? '✨ আরো দেখুন' : '✨ Explore More',
      href: ROUTES.DUAS,
    },
  ];

  const activeMobileTabId = currentSlotParam
    ? `tab-${currentSlotParam}`
    : `tab-${currentRoutineSlot}`;

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a]">
      <Container size="xl" className="h-full px-1 sm:px-6 lg:px-8">
        <div className="flex h-full justify-center gap-4 lg:gap-6">
          {/* 1. Left Column: Saved Routine Sidebar */}
          <SavedSidebar />

          {/* 2. Middle Column: Saved Content Feed (Matching HomePage Width) */}
          <main className="w-full max-w-2xl min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-3 sm:py-4 pb-12 space-y-4 px-1 sm:px-0">
            {/* Mobile / Tablet Routine Tabs */}
            <div className="lg:hidden shrink-0 bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] rounded-2xl p-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-2xs select-none">
              <Link
                href="/"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
                title="Home"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              {mobileTabs.map((tab) => {
                const isActive = tab.id === activeMobileTabId;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={cn(
                      'flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors',
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'bg-[#f0f2f5] text-[#050505] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]'
                    )}
                  >
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>

            {children}
          </main>

          {/* 3. Right Column: Digital Tasbih Widget */}
          <aside className="hidden xl:block w-72 xl:w-80 shrink-0 h-full overflow-y-auto overscroll-contain py-4 select-none">
            <TasbihWidget className="sticky top-0" />
          </aside>
        </div>
      </Container>

      {/* Floating Tasbih Button on Small/Mobile screens */}
      <div className="xl:hidden fixed bottom-6 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsMobileTasbihOpen(true)}
          className="flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl hover:bg-primary-700 active:scale-95 transition-all select-none cursor-pointer"
        >
          <span className="text-base">📿</span>
          <span>{locale === 'bn' ? 'তাসবীহ' : 'Tasbih'}</span>
        </button>
      </div>

      {/* Mobile Tasbih Modal / Bottom Sheet */}
      {isMobileTasbihOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150 select-none"
          onClick={() => setIsMobileTasbihOpen(false)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-[#e4e6eb] bg-white p-4 sm:p-5 shadow-2xl dark:border-[#393a3b] dark:bg-[#242526] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#e4e6eb] dark:border-[#393a3b] mb-2">
              <span className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
                {locale === 'bn' ? 'ডিজিটাল তাসবীহ কাউন্টার' : 'Digital Tasbih Counter'}
              </span>
              <button
                type="button"
                onClick={() => setIsMobileTasbihOpen(false)}
                className="p-1 rounded-full text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <TasbihWidget />
          </div>
        </div>
      )}
    </div>
  );
}
