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
import {
  LocationSelector,
  LocationValue,
} from '@/components/ui/LocationSelector';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/providers/LanguageProvider';
import { usersApi } from '../api/users.api';
import { MapPin, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function LocationSettingsCard() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const { locale } = useLanguage();

  const [location, setLocation] = useState('');
  const [locationData, setLocationData] = useState<LocationValue>({
    country: 'Bangladesh',
    countryCode: 'BD',
    state: '',
    city: '',
    location: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setLocation(user.location || '');
      setLocationData({
        country: user.country || 'Bangladesh',
        countryCode: user.countryCode || 'BD',
        state: user.state || '',
        city: user.city || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    const finalLocation = (location || locationData.location).trim() || null;

    try {
      const res = await usersApi.updateProfile({
        country: locationData.country || null,
        countryCode: locationData.countryCode || null,
        state: locationData.state || null,
        city: locationData.city || null,
        location: finalLocation,
      });

      setUser(res.data);
      setStatus({
        type: 'success',
        text:
          locale === 'bn'
            ? 'অবস্থান তথ্য সফলভাবে সংরক্ষিত হয়েছে!'
            : 'Location details saved successfully!',
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (locale === 'bn'
          ? 'অবস্থান আপডেট করতে সমস্যা হয়েছে।'
          : 'Failed to update location.');
      setStatus({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xs">
      <CardHeader className="pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-[#050505] dark:text-white">
              {locale === 'bn' ? 'অবস্থান ও ঠিকানা' : 'Location & Address'}
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'bn'
                ? 'আপনার দেশ, বিভাগ/স্টেট, জেলা/শহর ও বিস্তারিত ঠিকানা নির্ধারণ করুন'
                : 'Select your country, region, city and specific address'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4 sm:pt-5 md:pt-5 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Detailed Street / House Address Field (Read-only Display Box) */}
          <div>
            <label className="flex items-center justify-start text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 gap-1.5">
              <MapPin className="h-4 w-4 text-primary-500" />

              {locale === 'bn'
                ? 'সম্পূর্ণ অবস্থান বা বিস্তারিত ঠিকানা'
                : 'Current Location & Address'}
            </label>
            <div className="flex h-10 w-full items-center rounded-xl border border-[#e4e6eb] bg-[#f0f2f5] px-3.5 text-sm dark:border-[#393a3b] dark:bg-[#3a3b3c] cursor-default select-none">
              <MapPin className="h-4 w-4 mr-2.5 text-primary-500/80 dark:text-primary-400 shrink-0" />
              {location ? (
                <span className="font-medium text-[#050505] dark:text-[#e4e6eb] truncate">
                  {location}
                </span>
              ) : (
                <span className="text-[#65676b] dark:text-[#b0b3b8] truncate">
                  {locale === 'bn'
                    ? 'নিচের ড্রপডাউনগুলো থেকে অবস্থান নির্বাচন করুন'
                    : 'Select location from dropdowns below'}
                </span>
              )}
            </div>
          </div>

          {/* Cascading Location Selector Component */}
          <div className="rounded-2xl p-4 bg-[#f0f2f5]/60 dark:bg-[#3a3b3c]/40 border border-[#e4e6eb] dark:border-[#393a3b] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb] flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary-500" />
                {locale === 'bn' ? 'অবস্থান নির্বাচন করুন' : 'Select Location'}
              </span>
              {location && (
                <span className="text-[11px] text-primary-600 dark:text-primary-400 font-medium truncate max-w-[200px] sm:max-w-xs">
                  {location}
                </span>
              )}
            </div>

            <LocationSelector
              value={locationData}
              onChange={(val) => {
                setLocationData(val);
                setLocation(val.location);
              }}
              locale={locale}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={isSaving}
              className="rounded-xl px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs h-9.5"
            >
              {locale === 'bn' ? 'অবস্থান সংরক্ষণ করুন' : 'Save Location'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
