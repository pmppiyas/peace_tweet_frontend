'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Calendar,
  Building2,
  HeartHandshake,
  CheckCircle2,
  Phone,
  ArrowRight,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BloodRequestItem } from '../types/blood.types';
import {
  formatBloodGroup,
  getUrgencyInfo,
  getStatusInfo,
  formatLocationWithFlag,
} from '../utils/blood-helpers';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { useBloodActions } from '../hooks/useBloodActions';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';

export interface BloodRequestCardProps {
  request: BloodRequestItem;
  className?: string;
  onSelectDetail?: (request: BloodRequestItem) => void;
}

export function BloodRequestCard({
  request,
  className,
  onSelectDetail,
}: BloodRequestCardProps) {
  const { locale, formatNumber } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { acceptRequest, isAccepting, cancelDonation, isCancelling } =
    useBloodActions();

  const [actionError, setActionError] = useState<string | null>(null);

  const urgency = getUrgencyInfo(request.urgency, locale);
  const status = getStatusInfo(request.status, locale);

  const isOwner = user?.id === request.requesterId;
  const isCompleted = request.status === 'COMPLETED';
  const isCancelled = request.status === 'CANCELLED';

  // Check if current user is an active donor in this request
  const myDonation = request.donations?.find(
    (d) => d.donorId === user?.id && d.status !== 'CANCELLED',
  );
  const isMyDonationActive = Boolean(myDonation);

  const activeDonationsCount =
    request.donations?.filter(
      (d) => d.status === 'ACCEPTED' || d.status === 'COMPLETED',
    ).length || 0;

  const isFullyPledged = activeDonationsCount >= request.units;
  const progressPercent = Math.min(
    100,
    Math.round((request.unitsFulfilled / request.units) * 100),
  );

  const handleAccept = async () => {
    setActionError(null);
    try {
      await acceptRequest(request.id);
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message ||
          (locale === 'bn'
            ? 'রক্তদান এক্সেপ্ট করতে ব্যর্থ হয়েছে।'
            : 'Failed to accept blood donation.'),
      );
    }
  };

  const handleCancel = async () => {
    setActionError(null);
    try {
      await cancelDonation(request.id);
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message ||
          (locale === 'bn'
            ? 'রক্তদান বাতিল করতে ব্যর্থ হয়েছে।'
            : 'Failed to cancel blood donation pledge.'),
      );
    }
  };

  // Needed Date formatted
  const neededDateFormatted = new Date(request.neededDate).toLocaleDateString(
    locale === 'bn' ? 'bn-BD' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  );

  return (
    <Card
      className={cn(
        'group flex flex-col justify-between rounded-2xl border border-[#e4e6eb] bg-white p-4 shadow-2xs transition-all hover:border-rose-300 hover:shadow-xs dark:border-[#393a3b] dark:bg-[#242526] dark:hover:border-rose-800/80',
        request.urgency === 'EMERGENCY' &&
          'border-rose-300/80 bg-rose-50/20 dark:border-rose-900/60 dark:bg-rose-950/10',
        className,
      )}
    >
      <div className="space-y-3.5">
        {/* Top Header: Blood Group Icon Badge + Patient Name + Urgency Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Blood Group Badge */}
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-xs font-black select-none">
              <span className="text-sm font-extrabold tracking-tight leading-none">
                {formatBloodGroup(request.bloodGroup)}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-rose-200 mt-0.5 leading-none">
                {locale === 'bn' ? 'রক্ত' : 'Blood'}
              </span>
            </div>

            {/* Patient Name & Problem / Relation */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="truncate text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
                  {request.patientName}
                </h3>
                {request.forMyself && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                    {locale === 'bn' ? 'নিজের জন্য' : 'Self'}
                  </span>
                )}
                {request.patientAge && (
                  <span className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                    ({formatNumber(request.patientAge)}{' '}
                    {locale === 'bn' ? 'বছর' : 'yrs'})
                  </span>
                )}
              </div>

              {request.problem && (
                <p className="truncate text-xs font-medium text-rose-700 dark:text-rose-400 mt-0.5">
                  {request.problem}
                </p>
              )}
            </div>
          </div>

          {/* Urgency Badge */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold',
                urgency.badgeClass,
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', urgency.dotClass)} />
              {urgency.label}
            </span>
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold',
                status.badgeClass,
              )}
            >
              {status.label}
            </span>
          </div>
        </div>

        {/* Hospital & Location Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#65676b] dark:text-[#b0b3b8] bg-[#f7f8fa] dark:bg-[#1f2021] p-2.5 rounded-xl border border-[#eceef1] dark:border-[#323334]">
          <div className="flex items-center gap-2 truncate">
            <Building2 className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
            <span className="truncate font-semibold text-[#050505] dark:text-[#e4e6eb]">
              {request.hospitalName}
            </span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 text-rose-500" />
            <span className="truncate">{formatLocationWithFlag(request.location, request.countryCode)}</span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <Calendar className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
            <span className="truncate">
              {locale === 'bn' ? 'প্রয়োজন:' : 'Needed:'} {neededDateFormatted}
            </span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <Phone className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <a
              href={`tel:${request.contactNumber}`}
              className="truncate font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {request.contactNumber}
            </a>
          </div>
        </div>

        {/* Units Needed & Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
              {locale === 'bn' ? 'রক্তের পরিমাণ:' : 'Required Units:'}{' '}
              <span className="text-rose-600 font-bold">
                {formatNumber(request.units)}{' '}
                {locale === 'bn' ? 'ব্যাগ' : 'bag(s)'}
              </span>
            </span>

            <span className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn'
                ? `${formatNumber(request.unitsFulfilled)} সম্পন্ন / ${formatNumber(activeDonationsCount)} প্রতিশ্রুতিবদ্ধ`
                : `${request.unitsFulfilled} completed / ${activeDonationsCount} pledged`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c]">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                progressPercent >= 100
                  ? 'bg-emerald-500'
                  : progressPercent > 0
                    ? 'bg-amber-500'
                    : 'bg-rose-500',
              )}
              style={{
                width: `${Math.max(
                  progressPercent,
                  activeDonationsCount > 0 ? (activeDonationsCount / request.units) * 100 : 0,
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Pledged Donors preview */}
        {request.donations && request.donations.length > 0 && (
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[11px] font-medium text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn' ? 'ডোনারসমূহ:' : 'Donors:'}
            </span>
            <div className="flex -space-x-1.5 overflow-hidden">
              {request.donations
                .filter((d) => d.status !== 'CANCELLED')
                .slice(0, 4)
                .map((d) => (
                  <div
                    key={d.id}
                    title={`${d.donor.name} (${formatBloodGroup(d.donor.bloodGroup)})`}
                    className="relative h-6 w-6 rounded-full border-2 border-white dark:border-[#242526] bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700 uppercase overflow-hidden"
                  >
                    {d.donor.avatarUrl ? (
                      <Image
                        src={d.donor.avatarUrl}
                        alt={d.donor.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      d.donor.name.charAt(0)
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {actionError && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#f0f2f5] pt-3 dark:border-[#3a3b3c]">
        {/* Requester Profile */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative h-7 w-7 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold shrink-0">
            {request.requester.avatarUrl ? (
              <Image
                src={request.requester.avatarUrl}
                alt={request.requester.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              request.requester.name.charAt(0).toUpperCase()
            )}
          </div>
          <span className="truncate text-xs text-[#65676b] dark:text-[#b0b3b8]">
            {request.requester.name}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Details Button */}
          {onSelectDetail ? (
            <button
              type="button"
              onClick={() => onSelectDetail(request)}
              className="text-xs font-bold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {locale === 'bn' ? 'বিস্তারিত' : 'Details'}
            </button>
          ) : (
            <Link
              href={ROUTES.BLOOD.DETAIL(request.id)}
              className="text-xs font-bold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {locale === 'bn' ? 'বিস্তারিত' : 'Details'}
            </Link>
          )}

          {/* Conditional Action based on User & Status */}
          {isOwner ? (
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-md">
              {locale === 'bn' ? 'আপনার আবেদন' : 'Your Request'}
            </span>
          ) : isMyDonationActive ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {locale === 'bn' ? 'যুক্ত আছেন' : 'Accepted'}
              </span>
              {!isCompleted && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="text-xs text-rose-600 hover:underline px-1 py-1"
                >
                  {locale === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
              )}
            </div>
          ) : isCompleted ? (
            <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">
              {locale === 'bn' ? 'সম্পন্ন' : 'Closed'}
            </span>
          ) : isFullyPledged ? (
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md">
              {locale === 'bn' ? 'ডোনার পূর্ণ' : 'Fulfilled'}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleAccept}
              disabled={isAccepting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-rose-700 active:scale-95 transition-all disabled:opacity-50"
            >
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>{locale === 'bn' ? 'রক্ত দিন' : 'Donate'}</span>
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
