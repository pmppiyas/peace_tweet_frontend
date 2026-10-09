'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BloodGroup } from '@/types/user.types';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/providers/LanguageProvider';
import { usersApi } from '../api/users.api';
import { Droplet, Heart, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const BLOOD_GROUPS: { value: BloodGroup; label: string }[] = [
  { value: 'A_POSITIVE', label: 'A+' },
  { value: 'A_NEGATIVE', label: 'A-' },
  { value: 'B_POSITIVE', label: 'B+' },
  { value: 'B_NEGATIVE', label: 'B-' },
  { value: 'AB_POSITIVE', label: 'AB+' },
  { value: 'AB_NEGATIVE', label: 'AB-' },
  { value: 'O_POSITIVE', label: 'O+' },
  { value: 'O_NEGATIVE', label: 'O-' },
];

export function BloodSettingsCard() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const { locale } = useLanguage();

  const [bloodGroup, setBloodGroup] = useState<BloodGroup | undefined>(
    undefined
  );
  const [isDonor, setIsDonor] = useState(false);
  const [donationCount, setDonationCount] = useState<number>(0);

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setBloodGroup(user.bloodGroup || undefined);
      setIsDonor(Boolean(user.isDonor));
      setDonationCount(user.donationCount || 0);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    try {
      const res = await usersApi.updateProfile({
        bloodGroup: bloodGroup || null,
        isDonor,
        donationCount: Number(donationCount) || 0,
      });

      setUser(res.data);
      setStatus({
        type: 'success',
        text:
          locale === 'bn'
            ? 'রক্তদানের তথ্য সফলভাবে সংরক্ষিত হয়েছে!'
            : 'Blood donation settings saved successfully!',
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (locale === 'bn'
          ? 'তথ্য আপডেট করতে ব্যর্থ হয়েছে।'
          : 'Failed to update blood info.');
      setStatus({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xs">
      <CardHeader className="pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <Droplet className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-[#050505] dark:text-white">
              {locale === 'bn'
                ? 'রক্তদান ও ডোনার সেটিংস'
                : 'Blood Donation & Donor Settings'}
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'bn'
                ? 'আপনার রক্তের গ্রুপ এবং জরুরি প্রয়োজনে রক্তদাতা হওয়ার সম্মতি নির্ধারণ করুন'
                : 'Set your blood group and declare willingness as a voluntary blood donor'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4 sm:pt-5 md:pt-5 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Blood Group Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#050505] dark:text-white flex items-center gap-1.5">
                <Droplet className="h-4 w-4 text-rose-500" />
                <span>
                  {locale === 'bn'
                    ? 'রক্তের গ্রুপ নির্বাচন করুন'
                    : 'Select Blood Group'}
                </span>
              </label>
              {bloodGroup && (
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                  {BLOOD_GROUPS.find((b) => b.value === bloodGroup)?.label}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BLOOD_GROUPS.map((bg) => {
                const isSelected = bloodGroup === bg.value;
                return (
                  <button
                    key={bg.value}
                    type="button"
                    onClick={() =>
                      setBloodGroup(isSelected ? undefined : bg.value)
                    }
                    className={cn(
                      'flex flex-col items-center justify-center gap-1 rounded-2xl border py-3 px-2 text-xs font-bold transition-all cursor-pointer shadow-2xs',
                      isSelected
                        ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 ring-2 ring-rose-500/20 shadow-xs'
                        : 'border-[#e4e6eb] bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]'
                    )}
                  >
                    <span className="text-sm font-black">{bg.label}</span>
                    {isSelected && (
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                        ✓ {locale === 'bn' ? 'বাছাইকৃত' : 'Active'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Donor Status Toggle */}
          <div className="rounded-2xl p-4 border border-[#e4e6eb] dark:border-[#393a3b] bg-[#f0f2f5]/60 dark:bg-[#3a3b3c]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Heart
                  className={cn(
                    'h-4.5 w-4.5',
                    isDonor ? 'text-rose-500 fill-rose-500' : 'text-gray-400'
                  )}
                />
                <h4 className="text-xs font-bold text-[#050505] dark:text-white">
                  {locale === 'bn'
                    ? 'আমি স্বেচ্ছায় রক্তদাতা হতে আগ্রহী'
                    : 'I want to be a voluntary blood donor'}
                </h4>
              </div>
              <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                {locale === 'bn'
                  ? 'এটি চালু রাখলে আপনার এলাকার মানুষের রক্তের প্রয়োজনে আপনার প্রোফাইল ডোনার তালিকায় প্রদর্শিত হবে।'
                  : 'Enabling this allows patients in your area to contact you in emergency blood needs.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsDonor(!isDonor)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                isDonor ? 'bg-rose-500' : 'bg-gray-300 dark:bg-gray-600'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                  isDonor ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </div>

          {/* 3. Donation Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-xs font-bold text-[#050505] dark:text-white mb-1 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" />
                <span>
                  {locale === 'bn'
                    ? 'মোট রক্তদানের সংখ্যা'
                    : 'Total Times Donated Blood'}
                </span>
              </label>
              <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] mb-2">
                {locale === 'bn'
                  ? 'আপনি অতীতে কতবার রক্তদান করেছেন?'
                  : 'How many times have you donated blood?'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDonationCount(Math.max(0, donationCount - 1))}
                className="h-9 w-9 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#242526] text-lg font-bold flex items-center justify-center hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer select-none"
              >
                -
              </button>
              <Input
                type="number"
                min="0"
                max="999"
                value={donationCount}
                onChange={(e) =>
                  setDonationCount(
                    Math.max(0, parseInt(e.target.value, 10) || 0)
                  )
                }
                className="h-9 text-center font-bold text-sm w-24"
              />
              <button
                type="button"
                onClick={() => setDonationCount(donationCount + 1)}
                className="h-9 w-9 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#242526] text-lg font-bold flex items-center justify-center hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer select-none"
              >
                +
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={isSaving}
              className="rounded-xl px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs h-9.5"
            >
              {locale === 'bn'
                ? 'রক্তদানের তথ্য সংরক্ষণ'
                : 'Save Blood Settings'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
