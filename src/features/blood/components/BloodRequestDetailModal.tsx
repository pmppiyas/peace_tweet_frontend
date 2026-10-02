'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Droplet,
  Building2,
  MapPin,
  Calendar,
  Phone,
  CheckCircle2,
  Clock,
  HeartHandshake,
  AlertTriangle,
  User,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { BloodRequestItem } from '../types/blood.types';
import {
  formatBloodGroup,
  getUrgencyInfo,
  getStatusInfo,
  getDonationStatusInfo,
} from '../utils/blood-helpers';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { useBloodActions } from '../hooks/useBloodActions';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';

export interface BloodRequestDetailModalProps {
  request: BloodRequestItem;
  isOpen: boolean;
  onClose: () => void;
}

export function BloodRequestDetailModal({
  request,
  isOpen,
  onClose,
}: BloodRequestDetailModalProps) {
  const { locale, formatNumber } = useLanguage();
  const { user } = useAuth();
  const {
    acceptRequest,
    isAccepting,
    completeDonation,
    isCompleting,
    cancelDonation,
    isCancelling,
    updateStatus,
    isUpdatingStatus,
  } = useBloodActions();

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const urgency = getUrgencyInfo(request.urgency, locale);
  const status = getStatusInfo(request.status, locale);

  const isOwner = user?.id === request.requesterId;
  const isCompleted = request.status === 'COMPLETED';

  // Check if current user already accepted
  const myDonation = request.donations?.find(
    (d) => d.donorId === user?.id && d.status !== 'CANCELLED',
  );
  const isMyDonationActive = Boolean(myDonation);

  const activeDonations =
    request.donations?.filter((d) => d.status !== 'CANCELLED') || [];

  const isFullyPledged = activeDonations.length >= request.units;

  const handleAccept = async () => {
    setError(null);
    try {
      await acceptRequest(request.id);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (locale === 'bn'
            ? 'রক্তদান এক্সেপ্ট করতে ব্যর্থ হয়েছে।'
            : 'Failed to accept donation.'),
      );
    }
  };

  const handleCancel = async () => {
    setError(null);
    try {
      await cancelDonation(request.id);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (locale === 'bn'
            ? 'রক্তদান বাতিল করতে ব্যর্থ হয়েছে।'
            : 'Failed to cancel donation.'),
      );
    }
  };

  const handleMarkDonationComplete = async (donationId: string) => {
    setError(null);
    try {
      await completeDonation({ requestId: request.id, donationId });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (locale === 'bn'
            ? 'রক্তদান সম্পন্ন নিশ্চিত করতে ব্যর্থ হয়েছে।'
            : 'Failed to complete donation.'),
      );
    }
  };

  const handleStatusChange = async (newStatus: any) => {
    setError(null);
    try {
      await updateStatus({ requestId: request.id, input: { status: newStatus } });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (locale === 'bn'
            ? 'স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে।'
            : 'Failed to update request status.'),
      );
    }
  };

  const neededDateFormatted = new Date(request.neededDate).toLocaleDateString(
    locale === 'bn' ? 'bn-BD' : 'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-5 sm:p-7">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header: Blood Group, Patient Name, Urgency */}
        <div className="flex items-start gap-4 pr-10">
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-xs font-black">
            <span className="text-base font-black leading-none">
              {formatBloodGroup(request.bloodGroup)}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-rose-200 mt-1 leading-none">
              {locale === 'bn' ? 'রক্ত' : 'Blood'}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-[#050505] dark:text-white">
                {request.patientName}
              </h2>
              {request.forMyself && (
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  {locale === 'bn' ? 'নিজের জন্য' : 'For Myself'}
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
              <p className="mt-1 text-sm font-semibold text-rose-600 dark:text-rose-400">
                {request.problem}
              </p>
            )}

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold',
                  urgency.badgeClass,
                )}
              >
                <span className={cn('h-2 w-2 rounded-full', urgency.dotClass)} />
                {urgency.label}
              </span>
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold',
                  status.badgeClass,
                )}
              >
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Hospital & Medical Info Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#f7f8fa] dark:bg-[#1a1b1c] p-4 rounded-2xl border border-[#eceef1] dark:border-[#323334]">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn' ? 'হাসপাতালের নাম' : 'Hospital Name'}
            </span>
            <div className="flex items-center gap-2 font-bold text-[#050505] dark:text-white">
              <Building2 className="h-4 w-4 text-primary-600" />
              <span>{request.hospitalName}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn' ? 'এলাকা / জেলা' : 'Location'}
            </span>
            <div className="flex items-center gap-2 font-bold text-[#050505] dark:text-white">
              <MapPin className="h-4 w-4 text-rose-600" />
              <span>{request.location}</span>
            </div>
          </div>

          {request.hospitalAddress && (
            <div className="space-y-1 sm:col-span-2">
              <span className="text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8]">
                {locale === 'bn' ? 'ঠিকানা / ওয়ার্ড / বেড' : 'Specific Address'}
              </span>
              <p className="text-xs text-[#050505] dark:text-white">
                {request.hospitalAddress}
              </p>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn' ? 'রক্তের প্রয়োজন হওয়ার তারিখ' : 'Needed Date'}
            </span>
            <div className="flex items-center gap-2 font-bold text-[#050505] dark:text-white">
              <Calendar className="h-4 w-4 text-amber-600" />
              <span>{neededDateFormatted}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn' ? 'যোগাযোগের নম্বর' : 'Contact Number'}
            </span>
            <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
              <Phone className="h-4 w-4" />
              <a href={`tel:${request.contactNumber}`} className="hover:underline">
                {request.contactNumber}
              </a>
              {request.alternateContact && (
                <span className="text-xs font-normal text-gray-500">
                  / {request.alternateContact}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Note / Remarks */}
        {request.note && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">
              {locale === 'bn' ? 'জরুরি নোট:' : 'Special Note:'}
            </span>
            <p className="text-[#050505] dark:text-[#e4e6eb]">{request.note}</p>
          </div>
        )}

        {/* Units Needed & Fulfilled Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#050505] dark:text-white">
              {locale === 'bn' ? 'প্রয়োজনীয় পরিমাণ:' : 'Required Bags:'}{' '}
              <span className="text-rose-600">
                {formatNumber(request.units)} {locale === 'bn' ? 'ব্যাগ' : 'Bag(s)'}
              </span>
            </span>
            <span className="text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn'
                ? `${formatNumber(request.unitsFulfilled)} সম্পন্ন / ${formatNumber(activeDonations.length)} প্রস্তুত`
                : `${request.unitsFulfilled} completed / ${activeDonations.length} pledged`}
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c]">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((request.unitsFulfilled / request.units) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Donors List Section */}
        <div className="mt-6 border-t border-[#f0f2f5] dark:border-[#3a3b3c] pt-4">
          <h4 className="text-sm font-bold text-[#050505] dark:text-white mb-3 flex items-center justify-between">
            <span>
              {locale === 'bn'
                ? `রক্তদাতাদের তালিকা (${activeDonations.length})`
                : `Accepted Donors (${activeDonations.length})`}
            </span>
            <span className="text-xs font-normal text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn' ? '১ জন = ১ ব্যাগ' : '1 person = 1 bag'}
            </span>
          </h4>

          {activeDonations.length === 0 ? (
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] italic">
              {locale === 'bn'
                ? 'এখনো কোনো রক্তদাতা এগিয়ে আসেননি।'
                : 'No donors have stepped forward yet.'}
            </p>
          ) : (
            <div className="space-y-2">
              {activeDonations.map((d) => {
                const donationStatus = getDonationStatusInfo(d.status, locale);
                return (
                  <div
                    key={d.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#f7f8fa] dark:bg-[#1a1b1c] border border-[#eceef1] dark:border-[#323334]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center font-bold text-sm text-primary-700">
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

                      <div className="min-w-0">
                        <Link
                          href={ROUTES.USER_PROFILE(d.donor.username)}
                          className="font-bold text-xs text-[#050505] dark:text-white hover:underline truncate block"
                        >
                          {d.donor.name}
                        </Link>
                        <div className="flex items-center gap-2 text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                          <span className="font-semibold text-rose-600">
                            {formatBloodGroup(d.donor.bloodGroup)}
                          </span>
                          <span>•</span>
                          <span>
                            {formatNumber(d.donor.donationCount)}{' '}
                            {locale === 'bn' ? 'বার রক্ত দিয়েছেন' : 'donations'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold',
                          donationStatus.badgeClass,
                        )}
                      >
                        {donationStatus.label}
                      </span>

                      {/* Requester or Donor can complete the donation */}
                      {(isOwner || user?.id === d.donorId) &&
                        d.status === 'ACCEPTED' && (
                          <button
                            type="button"
                            onClick={() => handleMarkDonationComplete(d.id)}
                            disabled={isCompleting}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-2xs"
                          >
                            {locale === 'bn' ? 'সম্পন্ন নিশ্চিত করুন' : 'Confirm Donated'}
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-7 flex items-center justify-between gap-3 border-t border-[#f0f2f5] dark:border-[#3a3b3c] pt-4">
          {/* If Owner: Change Request Status */}
          {isOwner ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#65676b] dark:text-[#b0b3b8]">
                {locale === 'bn' ? 'স্ট্যাটাস পরিবর্তন:' : 'Change Status:'}
              </span>
              {!isCompleted && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('COMPLETED')}
                  disabled={isUpdatingStatus}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors"
                >
                  {locale === 'bn' ? 'রিকোয়েস্ট সমাপ্ত' : 'Mark Completed'}
                </button>
              )}
              {request.status !== 'CANCELLED' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('CANCELLED')}
                  disabled={isUpdatingStatus}
                  className="px-3 py-1.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-300 transition-colors"
                >
                  {locale === 'bn' ? 'বাতিল করুন' : 'Cancel Request'}
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {isMyDonationActive ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {locale === 'bn'
                        ? 'আপনি রক্তদাতা হিসেবে যুক্ত আছেন'
                        : 'You are accepted as a donor'}
                    </span>
                  </span>
                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isCancelling}
                      className="text-xs font-bold text-rose-600 hover:underline px-2"
                    >
                      {locale === 'bn' ? 'বাতিল করুন' : 'Cancel Pledge'}
                    </button>
                  )}
                </div>
              ) : isFullyPledged ? (
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl">
                  {locale === 'bn'
                    ? 'প্রয়োজনীয় সব রক্তদাতা পাওয়া গেছে'
                    : 'Required donors already pledged'}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isAccepting || isCompleted}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 active:scale-95 transition-all shadow-xs"
                >
                  <HeartHandshake className="h-4 w-4" />
                  <span>
                    {locale === 'bn' ? 'আমি রক্ত দিতে চাই' : 'Pledge to Donate Blood'}
                  </span>
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] text-xs font-bold text-[#050505] dark:text-[#e4e6eb] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {locale === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
