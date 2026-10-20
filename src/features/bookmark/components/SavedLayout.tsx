'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
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
    icon: string;
    label: string;
    href: string;
  }

  const routineMobileTabs: MobileTabItem[] = TIME_SLOTS.map((slot) => ({
    id: `tab-${slot.id}`,
    icon: slot.icon,
    label: locale === 'bn' ? slot.labelBn : slot.labelEn,
    href: `${ROUTES.SAVED}?slot=${slot.id}`,
  }));

  const mobileTabs: MobileTabItem[] = [
    {
      id: 'tab-all',
      icon: '📌',
      label: locale === 'bn' ? 'সকল' : 'All',
      href: `${ROUTES.SAVED}?slot=all`,
    },
    ...routineMobileTabs,
  ];

  const activeMobileTabId = currentSlotParam
    ? `tab-${currentSlotParam}`
    : `tab-${currentRoutineSlot}`;

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a]">
      <Container
        size="2xl"
        className="h-full px-0 sm:px-0 md:px-0 lg:px-6 2xl:px-8"
      >
        <div className="flex h-full justify-between gap-0 lg:gap-6 2xl:gap-8">
          {/* 1. Left Column: Saved Routine Sidebar */}
          <SavedSidebar />

          {/* 2. Middle Column: Saved Content Feed (Matching HomePage Width, Padding & Margins) */}
          <main className="flex-1 w-full min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none pt-0 sm:pt-4 pb-[68px] sm:pb-8 space-y-2.5 sm:space-y-4 px-0">
            <div className="w-full max-w-[720px] mx-auto space-y-2.5 sm:space-y-4">
              {/* Mobile / Tablet Routine Filter Bar (Scroll-less & Ultra Clean, Matching Feed Composer Style) */}
              <div className="lg:hidden shrink-0 w-full bg-white dark:bg-[#242526] rounded-none sm:rounded-2xl border-y sm:border border-[#e4e6eb] dark:border-[#393a3b] shadow-none sm:shadow-2xs p-1.5 sm:p-2 select-none transition-all">
                <div className="grid grid-cols-6 gap-0.5 sm:gap-1">
                  {mobileTabs.map((tab) => {
                    const isActive = tab.id === activeMobileTabId;
                    return (
                      <Link
                        key={tab.id}
                        href={tab.href}
                        className={cn(
                          'flex flex-col items-center justify-center py-1 sm:py-2 px-0.5 rounded-lg sm:rounded-xl text-center transition-all select-none',
                          isActive
                            ? 'bg-primary-500 text-white font-bold shadow-xs'
                            : 'text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] hover:text-[#050505] dark:hover:text-[#e4e6eb]'
                        )}
                      >
                        <span className="text-xs sm:text-sm leading-none">
                          {tab.icon}
                        </span>
                        <span className="text-[10px] sm:text-[11px] leading-tight font-semibold truncate max-w-full mt-0.5 sm:mt-1">
                          {tab.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {children}
            </div>
          </main>

          {/* 3. Right Column: Digital Tasbih Widget */}
          <aside className="hidden xl:block w-72 xl:w-80 2xl:w-88 shrink-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-4 select-none">
            <TasbihWidget className="sticky top-0" />
          </aside>
        </div>
      </Container>

      {/* Floating Tasbih Button on Small/Mobile screens */}
      <div className="xl:hidden fixed bottom-20 right-4 sm:bottom-6 sm:right-5 z-40">
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
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150 select-none"
          onClick={() => setIsMobileTasbihOpen(false)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl rounded-b-none sm:rounded-3xl border-t sm:border border-[#e4e6eb] bg-white p-4 sm:p-5 pb-5 sm:pb-5 shadow-2xl dark:border-[#393a3b] dark:bg-[#242526] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <TasbihWidget
              showCloseButton={true}
              onClose={() => setIsMobileTasbihOpen(false)}
              className="border-0 shadow-none p-0 bg-transparent rounded-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
