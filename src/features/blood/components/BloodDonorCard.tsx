'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Award, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { BloodDonorUser } from '../types/blood.types';
import { formatBloodGroup } from '../utils/blood-helpers';
import { useLanguage } from '@/providers/LanguageProvider';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';

export interface BloodDonorCardProps {
  donor: BloodDonorUser;
  className?: string;
}

export function BloodDonorCard({ donor, className }: BloodDonorCardProps) {
  const { locale, formatNumber } = useLanguage();

  return (
    <Card
      className={cn(
        'group flex flex-col justify-between rounded-2xl border border-[#e4e6eb] bg-white p-4 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-xs dark:border-[#393a3b] dark:bg-[#242526] dark:hover:border-indigo-700/60',
        className,
      )}
    >
      <div className="space-y-3">
        {/* Top Header: Avatar + Name + Blood Group Badge */}
        <div className="flex items-start justify-between gap-3">
          <Link
            href={ROUTES.USER_PROFILE(donor.username)}
            className="flex items-center gap-3 min-w-0 flex-1"
          >
            <div className="relative h-12 w-12 shrink-0 rounded-2xl overflow-hidden bg-primary-100 dark:bg-primary-900/60 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-lg shadow-2xs select-none">
              {donor.avatarUrl ? (
                <Image
                  src={donor.avatarUrl}
                  alt={donor.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                donor.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h3 className="truncate text-sm font-bold text-[#050505] group-hover:text-primary-600 dark:text-[#e4e6eb] dark:group-hover:text-primary-400 transition-colors">
                  {donor.name}
                </h3>
                {donor.userStatus === 'VERIFIED' && (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary-500 fill-current" />
                )}
              </div>
              <p className="truncate text-xs text-[#65676b] dark:text-[#b0b3b8]">
                @{donor.username}
              </p>
            </div>
          </Link>

          {/* Blood Group Pill */}
          <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs font-black select-none">
            <span className="text-xs font-black leading-none">
              {formatBloodGroup(donor.bloodGroup)}
            </span>
          </div>
        </div>

        {/* Location & Bio */}
        <div className="space-y-1.5 text-xs text-[#65676b] dark:text-[#b0b3b8]">
          {donor.location && (
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-500" />
              <span className="truncate">{donor.location}</span>
            </div>
          )}

          {donor.bio && (
            <p className="line-clamp-2 text-xs text-[#65676b] dark:text-[#b0b3b8]">
              {donor.bio}
            </p>
          )}
        </div>
      </div>

      {/* Footer: Donation Count Badge + Profile Link */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#f0f2f5] pt-3 dark:border-[#3a3b3c]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-lg">
          <Award className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          <span>
            {formatNumber(donor.donationCount)}{' '}
            {locale === 'bn' ? 'বার রক্তদান করেছেন' : 'time(s) donated'}
          </span>
        </div>

        <Link
          href={ROUTES.USER_PROFILE(donor.username)}
          className="text-xs font-bold text-primary-600 hover:underline dark:text-primary-400 px-2 py-1"
        >
          {locale === 'bn' ? 'প্রোফাইল' : 'Profile'}
        </Link>
      </div>
    </Card>
  );
}
