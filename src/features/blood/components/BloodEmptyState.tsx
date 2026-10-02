'use client';

import React from 'react';
import Link from 'next/link';
import { Droplet, Users, PlusCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';

export interface BloodEmptyStateProps {
  type: 'requests' | 'donors' | 'my-requests' | 'my-donations' | 'search';
  onResetFilters?: () => void;
}

export function BloodEmptyState({ type, onResetFilters }: BloodEmptyStateProps) {
  const { locale } = useLanguage();

  const configs = {
    requests: {
      icon: Droplet,
      iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
      title: locale === 'bn' ? 'কোনো রক্তের রিকোয়েস্ট নেই' : 'No Blood Requests Found',
      description:
        locale === 'bn'
          ? 'এই মুহূর্তে কোনো সক্রিয় রক্তের রিকোয়েস্ট নেই। জরুরি রক্তের প্রয়োজন হলে আপনি এখনই আবেদন করতে পারেন।'
          : 'There are currently no active blood requests. If you need blood, you can create a request now.',
      action: (
        <Link
          href={ROUTES.BLOOD.CREATE}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-2xs"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{locale === 'bn' ? 'রক্তের জন্য আবেদন করুন' : 'Request Blood'}</span>
        </Link>
      ),
    },
    donors: {
      icon: Users,
      iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
      title: locale === 'bn' ? 'কোনো রক্তদাতা পাওয়া যায়নি' : 'No Donors Found',
      description:
        locale === 'bn'
          ? 'নির্বাচিত গ্রুপ বা লোকেশনে কোনো নিবন্ধিত রক্তদাতা পাওয়া যায়নি।'
          : 'No registered donors found for the selected blood group or location.',
      action: onResetFilters ? (
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold text-[#050505] dark:text-[#e4e6eb] hover:bg-gray-200 transition-colors"
        >
          {locale === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
        </button>
      ) : null,
    },
    'my-requests': {
      icon: Droplet,
      iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
      title: locale === 'bn' ? 'আপনার কোনো আবেদন নেই' : 'No Blood Requests Yet',
      description:
        locale === 'bn'
          ? 'আপনি এখনো কোনো রক্তের জন্য আবেদন করেননি।'
          : 'You haven’t posted any blood requests yet.',
      action: (
        <Link
          href={ROUTES.BLOOD.CREATE}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-2xs"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{locale === 'bn' ? 'রক্তের জন্য আবেদন করুন' : 'Request Blood'}</span>
        </Link>
      ),
    },
    'my-donations': {
      icon: Droplet,
      iconBg: 'bg-teal-100 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400',
      title: locale === 'bn' ? 'রক্তদানের কোনো রেকর্ড নেই' : 'No Donations Yet',
      description:
        locale === 'bn'
          ? 'আপনি এখনো রক্তদানের জন্য কোনো রিকোয়েস্ট এক্সেপ্ট করেননি।'
          : 'You haven’t pledged or completed any blood donations yet.',
      action: (
        <Link
          href={ROUTES.BLOOD.HOME}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors shadow-2xs"
        >
          <Droplet className="h-4 w-4" />
          <span>{locale === 'bn' ? 'জরুরি রিকোয়েস্ট দেখুন' : 'Explore Requests'}</span>
        </Link>
      ),
    },
    search: {
      icon: Droplet,
      iconBg: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      title: locale === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No Results Found',
      description:
        locale === 'bn'
          ? 'আপনার সার্চ অনুযায়ী কোনো তথ্য পাওয়া যায়নি। অন্য কোনো কি-ওয়ার্ড দিয়ে চেষ্টা করুন।'
          : 'No results found matching your search. Please try different keywords.',
      action: onResetFilters ? (
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold text-[#050505] dark:text-[#e4e6eb] hover:bg-gray-200 transition-colors"
        >
          {locale === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
        </button>
      ) : null,
    },
  };

  const current = configs[type] || configs.requests;
  const Icon = current.icon;

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e4e6eb] bg-white/50 p-8 text-center dark:border-[#393a3b] dark:bg-[#242526]/50">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${current.iconBg} mb-3.5 shadow-2xs`}
      >
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-[#050505] dark:text-white">
        {current.title}
      </h3>
      <p className="mt-1.5 max-w-sm text-xs text-[#65676b] dark:text-[#b0b3b8]">
        {current.description}
      </p>
      {current.action && <div className="mt-4">{current.action}</div>}
    </div>
  );
}
