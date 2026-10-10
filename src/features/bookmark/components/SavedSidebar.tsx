'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Bookmark,
  Sparkles,
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Clock,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import {
  SectionSidebar,
  SidebarNavItem,
} from '@/components/navigation/SectionSidebar';
import { TIME_SLOTS, getCurrentTimeSlot } from '@/types/saved.types';

export interface SavedSidebarProps {
  activeId?: string;
}

const slotIcons: Record<string, any> = {
  morning: Sunrise,
  noon: Sun,
  afternoon: CloudSun,
  evening: Sunset,
  night: Moon,
};

const slotColors: Record<string, string> = {
  morning: 'bg-amber-500 text-white',
  noon: 'bg-yellow-500 text-white',
  afternoon: 'bg-sky-500 text-white',
  evening: 'bg-orange-600 text-white',
  night: 'bg-indigo-600 text-white',
};

export function SavedSidebar({ activeId }: SavedSidebarProps) {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const currentSlotParam = searchParams?.get('slot');

  const currentRoutineSlot = getCurrentTimeSlot();

  const routineItems: SidebarNavItem[] = TIME_SLOTS.map((slot) => {
    const Icon = slotIcons[slot.id] || Clock;
    const isCurrent = slot.id === currentRoutineSlot;

    return {
      id: `saved-${slot.id}`,
      label:
        locale === 'bn'
          ? `${slot.labelBn} (${slot.routineBn.split(' ')[0]})`
          : `${slot.labelEn} (${slot.routineEn.split(' ')[0]})`,
      href: `${ROUTES.SAVED}?slot=${slot.id}`,
      icon: Icon,
      iconBg: slotColors[slot.id] || 'bg-primary-500 text-white',
      badge: isCurrent ? (locale === 'bn' ? 'বর্তমান' : 'Now') : undefined,
    };
  });

  const navItems: SidebarNavItem[] = [
    {
      id: 'saved-all',
      label: locale === 'bn' ? 'সকল সংরক্ষিত' : 'All Saved Items',
      href: `${ROUTES.SAVED}?slot=all`,
      icon: Bookmark,
      iconBg: 'bg-purple-600 text-white',
    },
    ...routineItems,
    {
      id: 'saved-explore',
      label: locale === 'bn' ? 'আরো দেখুন' : 'Explore More',
      href: ROUTES.DUAS,
      icon: Sparkles,
      iconBg: 'bg-teal-500 text-white',
    },
  ];

  const computedActiveId =
    activeId ||
    (currentSlotParam
      ? `saved-${currentSlotParam}`
      : `saved-${currentRoutineSlot}`);

  return (
    <SectionSidebar
      title={locale === 'bn' ? 'সংরক্ষিত রুটিন' : 'Saved Routines'}
      backHref="/"
      items={navItems}
      showUserProfile={true}
      activeId={computedActiveId}
      className="sticky top-14 h-[calc(100vh-3.5rem)]"
    />
  );
}
